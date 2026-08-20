import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { PrismaClient } from "#/prisma/client";
import type { IServiceContainer } from "#/dependencyInjection";
import { errorFactory } from "#/errors";
import { IPasswordHasher } from "./common/authentication/passwordHasher";
import { ICallerDetailProvider } from "./common/authentication/callerDetailProvider";
import type {
  AuthenticationVerifyUserNameAndPasswordRequestDto,
  AuthenticationChangePasswordRequestDto } from "@hc-management/shared/dtos";
import { OperationError, NotFoundError } from "@hc-management/shared/errors";
import { errorMessages, getDisplayNameByKey } from "@hc-management/shared/localization";

type VerifyUserNameAndPasswordRequestDto = AuthenticationVerifyUserNameAndPasswordRequestDto;

export interface IAuthenticationService {
  verifyUserNameAndPasswordAsync(requestDto: VerifyUserNameAndPasswordRequestDto): Promise<void>;
  changePasswordAsync(requestDto: AuthenticationChangePasswordRequestDto): Promise<void>;
}

export class AuthenticationService implements IAuthenticationService {
  private readonly prisma: PrismaClient;
  private readonly passwordHasher: IPasswordHasher;
  private readonly callerDetailProvider: ICallerDetailProvider;

  public constructor({ prisma, callerDetailProvider, passwordHasher }: IServiceContainer)
  {
    this.prisma = prisma;
    this.callerDetailProvider = callerDetailProvider;
    this.passwordHasher = passwordHasher;
  }

  public async verifyUserNameAndPasswordAsync(requestDto: VerifyUserNameAndPasswordRequestDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { userName: requestDto.userName },
      select: { passwordHash: true }
    });

    if (user == null) {
      throw errorFactory.operationError.createNotFound("user");
    }

    if (!await this.passwordHasher.verifyPasswordAsync(requestDto.password, user.passwordHash)) {
      throw new OperationError([{
        propertyPath: "",
        message: errorMessages.incorrect(getDisplayNameByKey("password"))
      }]);
    }
  }

  public async changePasswordAsync(requestDto: AuthenticationChangePasswordRequestDto): Promise<void> {
    const caller = this.callerDetailProvider.getCallerDetail();
    const passwordHash = await this.passwordHasher.hashPasswordAsync(requestDto.newPassword);
    
    try {
      await this.prisma.user.update({
        data: { passwordHash },
        where: { id: caller.id }
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundError();
      }

      throw error;
    }
  }
}
