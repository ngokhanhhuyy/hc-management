import type { PrismaClient, MenuCategory } from "../database/client";
import type { IServiceContainer } from "#/framework/dependencyInjection";
import type { IDtoFactory } from "../common/dtos";
import type { IDatabaseErrorHandler, IErrorFactory } from "../common/errors";
import type { MenuCategoryBasicResponseDto, MenuCategoryUpsertRequestDto } from "@hc-management/shared/dtos";

export interface IMenuCategoryService {
  getAllAsync(): Promise<MenuCategoryBasicResponseDto[]>;
  getSingleAsync(id: number): Promise<MenuCategoryBasicResponseDto>;
  getSingleAsync(id: number): Promise<MenuCategoryBasicResponseDto>;
  createAsync(requestDto: MenuCategoryUpsertRequestDto): Promise<number>;
  updateAsync(id: number, requestDto: MenuCategoryUpsertRequestDto): Promise<void>;
  deleteAsync(id: number): Promise<void>;
}

export class MenuCategoryService implements IMenuCategoryService {
  private readonly prisma: PrismaClient;
  private readonly databaseErrorHandler: IDatabaseErrorHandler;
  private readonly dtoFactory: IDtoFactory;
  private readonly errorFactory: IErrorFactory;

  public constructor({ prisma, databaseErrorHandler, dtoFactory, errorFactory }: IServiceContainer) {
    this.prisma = prisma;
    this.databaseErrorHandler = databaseErrorHandler;
    this.dtoFactory = dtoFactory;
    this.errorFactory = errorFactory;
  }

  public async getAllAsync(): Promise<MenuCategoryBasicResponseDto[]> {
    const menuCategories = await this.prisma.menuCategory.findMany();
    return menuCategories.map((mc) => this.dtoFactory.createMenuCategoryBasic(mc));
  }

  public async getSingleAsync(id: number): Promise<MenuCategoryBasicResponseDto> {
    const menuCategory = await this.prisma.menuCategory.findUnique({
      where: { id }
    });

    if (!menuCategory) {
      throw this.errorFactory.createNotFoundError();
    }

    return this.dtoFactory.createMenuCategoryBasic(menuCategory);
  }

  public async createAsync(requestDto: MenuCategoryUpsertRequestDto): Promise<number> {
    try {
      const menuCategory = await this.prisma.menuCategory.create({
        data: {
          name: requestDto.name
        }
      });

      return menuCategory.id;
    } catch (error) {
      throw this.convertError(error);
    }
  }

  public async updateAsync(id: number, requestDto: MenuCategoryUpsertRequestDto): Promise<void> {
    try {
      await this.prisma.menuCategory.update({
        data: { name: requestDto.name },
        where: { id }
      });
    } catch (error) {
      throw this.convertError(error);
    }
  }

  public async deleteAsync(id: number): Promise<void> {
    try {
      await this.prisma.menuCategory.delete({
        where: { id }
      });
    } catch (error) {
      throw this.convertError(error);
    }
  }

  private convertError(error: unknown): unknown {
    const handledResult = this.databaseErrorHandler.handle<MenuCategory>(error);
    if (handledResult?.type === "RecordNotFound") {
      return this.errorFactory.createNotFoundError();
    }

    if (handledResult?.type === "UniqueConstraintViolation" && handledResult?.violatedColumnNames.includes("name")) {
      return this.errorFactory.createOperationErrorIndicatingDuplicatedCase("name", "name");
    }

    return error;
  }
}
