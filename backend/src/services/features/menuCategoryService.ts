import type { PrismaClient, MenuCategory } from "../prisma/client";
import type { IServiceContainer } from "#/dependencyInjection";
import { dtoFactories } from "../common/dtos";
import { errorFactories, IDatabaseErrorHandler } from "../common/errors";
import type { MenuCategoryBasicResponseDto, MenuCategoryUpsertRequestDto } from "@hc-management/shared/dtos";
import { NotFoundError } from "@hc-management/shared/errors";

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

  public constructor({ prisma, databaseErrorHandler }: IServiceContainer) {
    this.prisma = prisma;
    this.databaseErrorHandler = databaseErrorHandler;
  }

  public async getAllAsync(): Promise<MenuCategoryBasicResponseDto[]> {
    const menuCategories = await this.prisma.menuCategory.findMany();
    return menuCategories.map(dtoFactories.menuCategory.basicResponseDto);
  }

  public async getSingleAsync(id: number): Promise<MenuCategoryBasicResponseDto> {
    const menuCategory = await this.prisma.menuCategory.findUnique({
      where: { id }
    });

    if (!menuCategory) {
      throw new NotFoundError();
    }

    return dtoFactories.menuCategory.basicResponseDto(menuCategory);
  }

  public async createAsync(requestDto: MenuCategoryUpsertRequestDto): Promise<number> {
    try {
      const menuCategory = await this.prisma.menuCategory.create({
        data: {
          name: requestDto.name
        }
      });

      return menuCategory.id;
    } catch (error: any) {
      const handledResult = this.databaseErrorHandler.handle<MenuCategory>(error);
      if (handledResult?.type === "UniqueConstraintViolation" && handledResult?.violatedColumnNames.includes("name")) {
        throw errorFactories.operationError.createDuplicated("name", "name");
      }

      throw error;
    }
  }

  public async updateAsync(id: number, requestDto: MenuCategoryUpsertRequestDto): Promise<void> {
    try {
      await this.prisma.menuCategory.update({
        data: { name: requestDto.name },
        where: { id }
      });
    } catch (error: any) {
      const handledResult = this.databaseErrorHandler.handle<MenuCategory>(error);
      if (handledResult?.type === "RecordNotFound") {
        throw new NotFoundError();
      }

      if (handledResult?.type === "UniqueConstraintViolation" && handledResult?.violatedColumnNames.includes("name")) {
        throw errorFactories.operationError.createDuplicated("name", "name");
      }

      throw error;
    }
  }

  public async deleteAsync(id: number): Promise<void> {
    try {
      await this.prisma.menuCategory.delete({
        where: { id }
      });
    } catch (error: any) {
      const handledResult = this.databaseErrorHandler.handle<MenuCategory>(error);
      if (handledResult?.type === "RecordNotFound") {
        throw new NotFoundError();
      }

      if (handledResult?.type === "UniqueConstraintViolation" && handledResult?.violatedColumnNames.includes("name")) {
        throw errorFactories.operationError.createDuplicated("name", "name");
      }

      throw error;
    }
  }
}
