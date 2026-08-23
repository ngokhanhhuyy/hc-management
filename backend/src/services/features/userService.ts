import { type PrismaClient, type User, Prisma } from "#/prisma/client";
import type { IServiceContainer } from "#/dependencyInjection";
import { IPasswordHasher } from "../common/authentication/passwordHasher";
import { dtoFactories } from "../common/dtos";
import { errorFactories, type IDatabaseErrorHandler } from "../common/errors";
import type { UserDetailResponseDto, UserCreateRequestDto } from "@hc-management/shared/dtos";
import { NotFoundError } from "@hc-management/shared/errors";

export interface IUserService {
  getDetailByIdAsync(id: number): Promise<UserDetailResponseDto>;
  getDetailByUserNameAsync(userName: string): Promise<UserDetailResponseDto>;
  createAsync(requestDto: UserCreateRequestDto): Promise<number>;
}

export class UserService implements IUserService {
  private readonly prisma: PrismaClient;
  private readonly databaseErrorHandler: IDatabaseErrorHandler;
  private readonly passwordHasher: IPasswordHasher;

  public constructor({ prisma, databaseErrorHandler, passwordHasher }: IServiceContainer) {
    this.prisma = prisma;
    this.databaseErrorHandler = databaseErrorHandler;
    this.passwordHasher = passwordHasher;
  }

  public async getDetailByIdAsync(id: number): Promise<UserDetailResponseDto> {
    return this.getDetailAsync(async () => await this.prisma.user.findUnique({
      where: { id }
    }));
  }
  
  public async getDetailByUserNameAsync(userName: string): Promise<UserDetailResponseDto> {
    return this.getDetailAsync(() => this.prisma.user.findUnique({
      where: { userName }
    }));
  }

  public async createAsync(requestDto: UserCreateRequestDto): Promise<number> {
    try {
      const user = await this.prisma.user.create({
        data: {
          userName: requestDto.userName,
          passwordHash: await this.passwordHasher.hashPasswordAsync(requestDto.password)
        }
      });

      return user.id;
    } catch (error: any) {
      const handledResult = this.databaseErrorHandler.handle<User>(error);
      if (handledResult?.type !== "UniqueConstraintViolation") {
        throw error;
      }

      throw errorFactories.operationError.createDuplicated("userName", "userName");
    }
  }

  private async getDetailAsync(fetcher: () => Promise<User | null>): Promise<UserDetailResponseDto> {
    const user = await fetcher();
    if (!user) {
      throw new NotFoundError();
    }

    return dtoFactories.user.detailResponseDto(user);
  }
}
