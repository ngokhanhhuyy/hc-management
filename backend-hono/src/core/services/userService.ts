import type { PrismaClient, User } from "../database/client";
import type { IServiceContainer } from "#/framework/dependencyInjection";
import type { IPasswordHasher } from "../common/authentication/passwordHasher";
import type { IDtoFactory } from "../common/dtos";
import type { IDatabaseErrorHandler, IErrorFactory } from "../common/errors";
import type { UserDetailResponseDto, UserCreateRequestDto } from "@hc-management/shared/dtos";

export interface IUserService {
  getDetailByIdAsync(id: number): Promise<UserDetailResponseDto>;
  getDetailByUserNameAsync(userName: string): Promise<UserDetailResponseDto>;
  createAsync(requestDto: UserCreateRequestDto): Promise<number>;
}

export class UserService implements IUserService {
  private readonly prisma: PrismaClient;
  private readonly databaseErrorHandler: IDatabaseErrorHandler;
  private readonly passwordHasher: IPasswordHasher;
  private readonly dtoFactory: IDtoFactory;
  private readonly errorFactory: IErrorFactory;

  public constructor(dependencies: IServiceContainer) {
    this.prisma = dependencies.prisma;
    this.databaseErrorHandler = dependencies.databaseErrorHandler;
    this.passwordHasher = dependencies.passwordHasher;
    this.dtoFactory = dependencies.dtoFactory;
    this.errorFactory = dependencies.errorFactory;
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

      throw this.errorFactory.createOperationErrorIndicatingDuplicatedCase("userName", "userName");
    }
  }

  private async getDetailAsync(fetcher: () => Promise<User | null>): Promise<UserDetailResponseDto> {
    const user = await fetcher();
    if (!user) {
      throw this.errorFactory.createNotFoundError();
    }

    return this.dtoFactory.createUserDetail(user);
  }
}
