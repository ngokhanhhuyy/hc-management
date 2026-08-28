import type { PrismaClient, User } from "#/core/database/client";
import type { IServiceContainer } from "#/framework/dependencyInjection";
import type { IPasswordHasher, ICallerDetailProvider } from "../common/authentication";
import type { IDatabaseErrorHandler, IErrorFactory } from "../common/errors";
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
  private readonly errorFactory: IErrorFactory;

  public constructor(dependencies: IServiceContainer) {
    this.database = dependencies.prisma;
    this.callerDetailProvider = dependencies.callerDetailProvider;
    this.passwordHasher = dependencies.passwordHasher;
    this.databaseErrorHandler = dependencies.databaseErrorHandler;
    this.errorFactory = dependencies.errorFactory;
  }

  public async verifyUserNameAndPasswordAsync(requestDto: VerifyUserNameAndPasswordRequestDto): Promise<void> {
    const user = await this.database.user.findUnique({
      where: { userName: requestDto.userName }
    });

    if (!user) {
      throw this.errorFactory.createOperationErrorIndicatingNotFoundCase("user");
    }

    if (!await this.passwordHasher.verifyPasswordAsync(requestDto.password, user.passwordHash)) {
      throw new OperationError({ "password": errorMessages.incorrect(getDisplayNameByKey("password")) });
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
        throw this.errorFactory.createOperationErrorIndicatingNotFoundCase("user");
      }

      throw error;
    }
  }
}
