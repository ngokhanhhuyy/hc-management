import type { IServiceContainer } from "#/framework/dependencyInjection";
import type { ICallerDetailProvider } from "../common/authentication";
import type { IDtoFactory } from "../common/dtos";
import type { IDatabaseErrorHandler, IErrorFactory } from "../common/errors";
import type { Prisma, PrismaClient, MenuItem } from "../database/client";
import type {
  MenuItemListRequestDto,
  MenuItemBasicResponseDto,
  MenuItemDetailResponseDto,
  MenuItemUpsertRequestDto
} from "@hc-management/shared/dtos";

export interface IMenuItemService {
  getListAsync(requestDto: MenuItemListRequestDto): Promise<MenuItemBasicResponseDto[]>;
  getDetailAsync(id: number): Promise<MenuItemDetailResponseDto>;
  createAsync(requestDto: MenuItemUpsertRequestDto): Promise<number>;
  updateAsync(id: number, requestDto: MenuItemUpsertRequestDto): Promise<void>;
  deleteAsync(id: number): Promise<void>;
}

export class MenuItemService implements IMenuItemService {
  private readonly database: PrismaClient;
  private readonly databaseErrorHandler: IDatabaseErrorHandler;
  private readonly dtoFactory: IDtoFactory;
  private readonly errorFactory: IErrorFactory;
  private readonly callerDetailProvider: ICallerDetailProvider;

  public constructor(dependencies: IServiceContainer) {
    this.database = dependencies.prisma;
    this.databaseErrorHandler = dependencies.databaseErrorHandler;
    this.dtoFactory = dependencies.dtoFactory;
    this.errorFactory = dependencies.errorFactory;
    this.callerDetailProvider = dependencies.callerDetailProvider;
  }

  public async getListAsync(requestDto: MenuItemListRequestDto): Promise<MenuItemBasicResponseDto[]> {
    let conditions: Prisma.MenuItemWhereInput = { };
    if (requestDto.categoryId != null) {
      conditions = { categoryId: requestDto.categoryId };
    }

    const menuItems = await this.database.menuItem.findMany({ where: conditions });
    return menuItems.map(mc => this.dtoFactory.createMenuItemBasic(mc));
  }

  public async getDetailAsync(id: number): Promise<MenuItemDetailResponseDto> {
    const menuItem = await this.database.menuItem.findUnique({
      include: {
        category: true,
        createdUser: true,
        lastUpdatedUser: true
      },
      where: { id }
    });

    if (!menuItem) {
      throw this.errorFactory.createNotFoundError();
    }

    return this.dtoFactory.createMenuItemDetail(menuItem);
  }

  public async createAsync(requestDto: MenuItemUpsertRequestDto): Promise<number> {
    try {
      const menuItem = await this.database.menuItem.create({
        data: {
          name: requestDto.name,
          unit: requestDto.unit,
          defaultAmountBeforeVatPerUnit: requestDto.defaultAmountBeforeVatPerUnit,
          defaultVatPercentagePerUnit: requestDto.defaultAmountBeforeVatPerUnit,
          categoryId: requestDto.categoryId,
          createdUserId: this.callerDetailProvider.getCallerId()
        }
      });

      return menuItem.id;
    } catch (error) {
      throw this.convertModificationError(error);
    }
  }

  public async updateAsync(id: number, requestDto: MenuItemUpsertRequestDto): Promise<void> {
    try {
      await this.database.menuItem.update({
        data: {
          name: requestDto.name,
          unit: requestDto.unit,
          defaultAmountBeforeVatPerUnit: requestDto.defaultAmountBeforeVatPerUnit,
          defaultVatPercentagePerUnit: requestDto.defaultVatPercentagePerUnit,
          categoryId: requestDto.categoryId,
          lastUpdatedDateTime: new Date()
        },
        where: { id }
      });
    } catch (error) {
      throw this.convertModificationError(error);
    }
  }

  public async deleteAsync(id: number): Promise<void> {
    try {
      await this.database.menuCategory.update({
        data: { deletedDateTime: new Date() },
        where: { id }
      });
    } catch (error) {
      throw this.convertModificationError(error);
    }
  }

  private convertModificationError(error: unknown): unknown {
    const handledResult = this.databaseErrorHandler.handle<MenuItem>(error);

    if (handledResult?.type === "RecordNotFound") {
      throw this.errorFactory.createNotFoundError();
    }

    if (handledResult?.type === "UniqueConstraintViolation" && handledResult?.violatedColumnNames.includes("name")) {
      return this.errorFactory.createOperationErrorIndicatingDuplicatedCase("name", "name");
    }

    const isForeignKeyConstraintViolation = handledResult?.type === "ForeignKeyConstraintViolation";
    if (isForeignKeyConstraintViolation && handledResult?.violatedColumnNames.includes("categoryId")) {
      return this.errorFactory.createOperationErrorIndicatingNotFoundCase("menuCategory");
    }

    return error;
  }
}
