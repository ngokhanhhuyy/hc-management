import type { PrismaClient, User } from "#/prisma/client";
import type { IServiceContainer } from "#/dependencyInjection";
import { IPasswordHasher, ICallerDetailProvider } from "../common/authentication";
import { errorFactories, type IDatabaseErrorHandler } from "../common/errors";
import type {
  AuthenticationVerifyUserNameAndPasswordRequestDto,
  AuthenticationChangePasswordRequestDto } from "@hc-management/shared/dtos";
import { OperationError } from "@hc-management/shared/errors";
import { errorMessages, getDisplayNameByKey } from "@hc-management/shared/localization";

type VerifyUserNameAndPasswordRequestDto = AuthenticationVerifyUserNameAndPasswordRequestDto;

export interface IAuthenticationService {
  verifyUserNameAndPasswordAsync(requestDto: VerifyUserNameAndPasswordRequestDto): Promise<void>;
  changePasswordAsync(requestDto: AuthenticationChangePasswordRequestDto): Promise<void>;
}

export class AuthenticationService implements IAuthenticationService {
  private readonly database: PrismaClient;
  private readonly passwordHasher: IPasswordHasher;
  private readonly callerDetailProvider: ICallerDetailProvider;
  private readonly databaseErrorHandler: IDatabaseErrorHandler;

  public constructor({ prisma, callerDetailProvider, passwordHasher, databaseErrorHandler }: IServiceContainer) {
    this.database = prisma;
    this.callerDetailProvider = callerDetailProvider;
    this.passwordHasher = passwordHasher;
    this.databaseErrorHandler = databaseErrorHandler;
  }

  public async verifyUserNameAndPasswordAsync(requestDto: VerifyUserNameAndPasswordRequestDto): Promise<void> {
    const user = await this.database.user.findUnique({
      where: { userName: requestDto.userName }
    });

    if (!user) {
      throw errorFactories.operationError.createNotFound("user");
    }

    if (!await this.passwordHasher.verifyPasswordAsync(requestDto.password, user.passwordHash)) {
      throw new OperationError({ "": errorMessages.incorrect(getDisplayNameByKey("password")) });
    }
  }

  public async changePasswordAsync(requestDto: AuthenticationChangePasswordRequestDto): Promise<void> {
    const caller = this.callerDetailProvider.getCallerDetail();
    const passwordHash = await this.passwordHasher.hashPasswordAsync(requestDto.newPassword);
    
    try {
      await this.database.user.update({
        data: { passwordHash },
        where: { id: caller.id }
      });
    } catch (error: any) {
      const handledResult = this.databaseErrorHandler.handle<User>(error);
      if (handledResult?.type === "RecordNotFound") {
        throw errorFactories.operationError.createNotFound("user");
      }

      throw error;
    }
  }
}
