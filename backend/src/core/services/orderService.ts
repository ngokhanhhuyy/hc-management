import type { PrismaClient, Prisma, Order, OrderItem } from "../database/client";
import type { ICallerDetailProvider } from "../common/authentication";
import type { IDtoFactory } from "../common/dtos";
import type { IDatabaseErrorHandler, IErrorFactory } from "../common/errors";
import type { IServiceContainer } from "#/framework/dependencyInjection";
import type {
  OrderListRequestDto,
  OrderListResponseDto,
  OrderDetailResponseDto,
  OrderUpsertRequestDto,
  OrderItemUpsertRequestDto
} from "@hc-management/shared/dtos";
import { errorMessages } from "@hc-management/shared/localization";
import { calculateOrderAmount } from "@hc-management/shared/helpers";

export interface IOrderService {
  getListAsync(requestDto: OrderListRequestDto): Promise<OrderListResponseDto>;
  getDetailAsync(id: number): Promise<OrderDetailResponseDto>;
  createAsync(requestDto: OrderUpsertRequestDto): Promise<OrderDetailResponseDto>;
  updateAsync(id: number, requestDto: OrderUpsertRequestDto): Promise<OrderDetailResponseDto>;
  finishAsync(id: number): Promise<void>;
  // deleteAsync(id: number): Promise<void>;
}

export class OrderService implements IOrderService {
  private readonly prisma: PrismaClient;
  private readonly databaseErrorHandler: IDatabaseErrorHandler;
  private readonly dtoFactory: IDtoFactory;
  private readonly errorFactory: IErrorFactory;
  private readonly callerDetailProvider: ICallerDetailProvider;

  public constructor(dependencies: IServiceContainer) {
    this.prisma = dependencies.prisma;
    this.databaseErrorHandler = dependencies.databaseErrorHandler;
    this.dtoFactory = dependencies.dtoFactory;
    this.errorFactory = dependencies.errorFactory;
    this.callerDetailProvider = dependencies.callerDetailProvider;
  }

  public async getListAsync(requestDto: OrderListRequestDto): Promise<OrderListResponseDto> {
    const sortingDirection: "asc" | "desc" = requestDto.sortByAscending ? "asc" : "desc";
    const sortingByFieldName: keyof Order = requestDto.sortByFieldName === "itemAmount"
      ? "cachedItemAmount"
      : requestDto.sortByFieldName;

    const userCount = await this.prisma.user.count({
      where: { isDeleted: false }
    });

    const pageCount = Math.ceil(userCount / requestDto.resultsPerPage);

    const orders = await this.prisma.order.findMany({
      include: {
        seating: true,
        createdUser: true,
        lastUpdatedUser: true
      },
      where: {
        deletedDateTime: { equals: null }
      },
      orderBy: {
        [sortingByFieldName]: sortingDirection
      },
      skip: requestDto.resultsPerPage * (requestDto.page - 1),
      take: requestDto.resultsPerPage
    });

    return this.dtoFactory.createOrderList(pageCount, userCount, orders);
  }

  public async getDetailAsync(id: number): Promise<OrderDetailResponseDto> {
    const order = await this.prisma.order.findUnique({
      include: {
        items: {
          include: { menuItem: true }
        },
        createdUser: true,
        lastUpdatedUser: true,
        finishedUser: true,
        seating: true
      },
      where: { id }
    });

    if (!order) {
      throw this.errorFactory.createNotFoundError();
    }

    return this.dtoFactory.createOrderDetail(order);
  }

  public async createAsync(requestDto: OrderUpsertRequestDto): Promise<OrderDetailResponseDto> {
    const activeOrderWithSeatName = await this.prisma.order.findFirst({
      where: {
        seatingId: requestDto.seatingId,
        finishedDateTime: {
          not: null
        }
      },
      select: {
        id: true,
        seating: {
          select: {
            id: true,
            name: true
          },
        }
      }
    });

    if (activeOrderWithSeatName) {
      throw this.errorFactory.createOperationError(
        "",
        errorMessages.seatingActiveOrderNotFinished(activeOrderWithSeatName.seating.name)
      );
    }

    const deduplicatedItemRequestDtos: OrderItemUpsertRequestDto[] = [];
    for (const itemRequestDto of requestDto.items) {
      let deduplicatedItemRequestDto = deduplicatedItemRequestDtos.find(oi => {
        return oi.menuItemId === itemRequestDto.menuItemId;
      });

      if (!deduplicatedItemRequestDto) {
        deduplicatedItemRequestDto = {
          id: null,
          amountBeforeVatPerUnit: 0,
          vatPercentagePerUnit: 0,
          quantity: 1,
          menuItemId: 0,
          concurrencyVersion: null
        };

        deduplicatedItemRequestDtos.push(deduplicatedItemRequestDto);
      }

      deduplicatedItemRequestDto.amountBeforeVatPerUnit = itemRequestDto.amountBeforeVatPerUnit;
      deduplicatedItemRequestDto.vatPercentagePerUnit = itemRequestDto.vatPercentagePerUnit;
      deduplicatedItemRequestDto.quantity = itemRequestDto.quantity;
      deduplicatedItemRequestDto.menuItemId = itemRequestDto.menuItemId;
    }

    try {
      const order = await this.prisma.order.create({
        include: {
          items: {
            include: { menuItem: true }
          },
          createdUser: true,
          lastUpdatedUser: true,
          finishedUser: true,
          seating: true
        },
        data: {
          seatingId: requestDto.seatingId,
          cachedItemAmount: calculateOrderAmount(requestDto),
          items: {
            create: requestDto.items.map(dto => ({
              amountBeforeVatPerUnit: dto.amountBeforeVatPerUnit,
              vatPercentagePerUnit: dto.vatPercentagePerUnit,
              quantity: dto.quantity,
              menuItemId: dto.menuItemId
            }))
          },
          createdUserId: this.callerDetailProvider.getCallerId()
        }
      });

      return this.dtoFactory.createOrderDetail(order);
    } catch (error) {
      const handledResult = this.databaseErrorHandler.handle<Order & OrderItem>(error);
      if (handledResult == null) {
        throw error;
      }

      if (handledResult.type === "ForeignKeyConstraintViolation") {
        if (handledResult.violatedColumnNames.includes("seatingId")) {
          throw this.errorFactory.createOperationErrorIndicatingNotFoundCase("seating");
        }

        if (handledResult.violatedColumnNames.includes("menuItemId")) {
          throw this.errorFactory.createOperationErrorIndicatingNotFoundCase("menuItem");
        }
      }

      throw error;
    }
  }

  public async updateAsync(id: number, requestDto: OrderUpsertRequestDto): Promise<OrderDetailResponseDto> {
    const concurrencyVersion = crypto.randomUUID();
    let evaluatingOrderItemIndex: number = NaN;
    let evaluatingEntityType: string = "";
    const itemsToCreate: OrderItemUpsertRequestDto[] = [];
    const itemsToUpdate: OrderItemUpsertRequestDto[] = [];
    for (const itemRequestDto of requestDto.items) {
      if (itemRequestDto.id == null) {
        itemsToCreate.push(itemRequestDto);
        continue;
      }

      itemsToUpdate.push(itemRequestDto);
    }

    try {
      await this.prisma.$transaction(async (transaction) => {
        evaluatingEntityType = "OrderItem";
        for (let index = 0; index < requestDto.items.length; index += 1) {
          const itemRequestDto = requestDto.items[index];
          evaluatingOrderItemIndex = index;
          if (itemRequestDto.id === null) {
            await transaction.orderItem.create({
              data: {
                amountBeforeVatPerUnit: itemRequestDto.amountBeforeVatPerUnit,
                vatPercentagePerUnit: itemRequestDto.vatPercentagePerUnit,
                quantity: itemRequestDto.quantity,
                menuItemId: itemRequestDto.menuItemId,
                orderId: id
              }
            });

            continue;
          }

          await transaction.orderItem.update({
            where: { id: itemRequestDto.id },
            data: {
              amountBeforeVatPerUnit: itemRequestDto.amountBeforeVatPerUnit,
              vatPercentagePerUnit: itemRequestDto.vatPercentagePerUnit,
              quantity: itemRequestDto.quantity,
            }
          });
        }

        await this.prisma.orderItem.deleteMany({
          where: {
            id: { notIn: requestDto.items.map(i => i.id).filter(id => id != null) },
            orderId: id,
          }
        });
        
        evaluatingEntityType = "Order";
        const order = await this.prisma.order.update({
          where: { id, concurrencyVersion: requestDto.concurrencyVersion ?? undefined },
          data: {
            lastUpdatedDateTime: new Date(),
            lastUpdatedUserId: this.callerDetailProvider.getCallerId(),
            cachedItemAmount: calculateOrderAmount(requestDto),
            concurrencyVersion
          }
        });

        if (!order) {
          throw this.errorFactory.createNotFoundError();
        }
      });
    } catch (error) {
      const handledResult = this.databaseErrorHandler.handle<Order & OrderItem>(error);
      if (!handledResult) {
        throw error;
      }

      if (evaluatingEntityType === "OrderItem") {
        if (handledResult.type === "RecordNotFound") {
          throw this.errorFactory.createOperationErrorIndicatingNotFoundCase(
            "menuItem",
            `items[${evaluatingOrderItemIndex}].id`,
          );
        }

        if (handledResult.type === "UniqueConstraintViolation") {
          throw this.errorFactory.createOperationErrorIndicatingDuplicatedCase(
            `items[${evaluatingOrderItemIndex}].menuItemId`, "menuItem"
          );
        }
      }

      if (evaluatingEntityType === "Order" && handledResult.type === "RecordNotFound") {
        throw this.errorFactory.createNotFoundError();
      }

      throw error;
    }

    const updatedOrder = await this.prisma.order.findUnique({
      include: {
          items: {
            include: { menuItem: true }
          },
          createdUser: true,
          lastUpdatedUser: true,
          finishedUser: true,
          seating: true
      },
      where: { id, concurrencyVersion }
    });

    if (!updatedOrder) {
      throw this.errorFactory.createConcurrencyError();
    }

    return this.dtoFactory.createOrderDetail(updatedOrder);
  }

  public async finishAsync(id: number): Promise<void> {
    try {
      await this.prisma.order.update({
        where: { id },
        data: {
          finishedDateTime: new Date(),
          finishedUserId: this.callerDetailProvider.getCallerId()
        }
      });
    } catch (error) {
      const handledResult = this.databaseErrorHandler.handle(error);
      if (handledResult?.type === "RecordNotFound") {
        throw this.errorFactory.createNotFoundError();
      }

      throw error;
    }
  }
}
