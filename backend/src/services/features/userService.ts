import type { PrismaClient, User } from "../database/client";
import type { IServiceContainer } from "#/dependencyInjection";
import type { IPasswordHasher } from "../common/authentication/passwordHasher";
import type { IUserDtoFactory } from "../common/dtos";
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
  private readonly userDtoFactory: IUserDtoFactory;

  public constructor({ prisma, databaseErrorHandler, passwordHasher, userDtoFactory }: IServiceContainer) {
    this.prisma = prisma;
    this.databaseErrorHandler = databaseErrorHandler;
    this.passwordHasher = passwordHasher;
    this.userDtoFactory = userDtoFactory;
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

    return this.userDtoFactory.createDetailResponseDto(user);
  }
}
