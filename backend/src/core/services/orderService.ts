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
import { NotFoundError } from "@hc-management/shared/errors";

export interface IOrderService {
  getListAsync(requestDto: OrderListRequestDto): Promise<OrderListResponseDto>;
  getDetailAsync(id: number): Promise<OrderDetailResponseDto>;
  createAsync(requestDto: OrderUpsertRequestDto): Promise<number>;
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
      throw new NotFoundError();
    }

    return this.dtoFactory.createOrderDetail(order);
  }

  public async createAsync(requestDto: OrderUpsertRequestDto): Promise<number> {
    const calculateItemAmount = (amountBeforeVatPerUnit: number, vatAmountPerUnit: number, quantity: number) => {
      return Math.floor(amountBeforeVatPerUnit * (vatAmountPerUnit / 100)) * quantity;
    };

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
        data: {
          seatingId: requestDto.seatingId,
          cachedItemAmount: requestDto.items.reduce((total, item) => {
            const itemAmount = calculateItemAmount(item.amountBeforeVatPerUnit, item.vatPercentagePerUnit, item.quantity);
            return itemAmount + total;
          }, 0),
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

      return order.id;
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
}
