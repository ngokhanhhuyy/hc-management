import type { PrismaClient, User } from "#/prisma/client";
import type { IServiceContainer } from "#/dependencyInjection";
import { createUserDetailResponseDto } from "./common/dtoFactories";
import type { UserDetailResponseDto } from "@hc-management/shared/dtos";
import { NotFoundError } from "@hc-management/shared/errors";

export interface IUserService {
  getDetailByIdAsync(id: number): Promise<UserDetailResponseDto>;
  getDetailByUserNameAsync(userName: string): Promise<UserDetailResponseDto>;
}

export class UserService implements IUserService {
  private readonly prisma: PrismaClient;

  public constructor({ prisma }: IServiceContainer) {
    this.prisma = prisma;
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

  private async getDetailAsync(fetcher: () => Promise<User | null>): Promise<UserDetailResponseDto> {
    const user = await fetcher();
    if (!user) {
      throw new NotFoundError();
    }

    return createUserDetailResponseDto(user);
  }
}
