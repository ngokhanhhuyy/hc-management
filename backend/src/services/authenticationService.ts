import type { PrismaClient } from "../../prisma/generated/client";
import { IPasswordHasher } from "./common/authentication/passwordHasher";
import type {
  AuthenticationVerifyUserNameAndPasswordRequestDto,
  AuthenticationChangePasswordRequestDto } from "@hc-management/shared/dtos";

type VerifyUserNameAndPasswordRequestDto = AuthenticationVerifyUserNameAndPasswordRequestDto;

export class AuthenticationService {
  private readonly prisma: PrismaClient;
  private readonly passwordHasher: IPasswordHasher;

  public constructor(prisma: PrismaClient, passwordHasher: IPasswordHasher) {
    this.prisma = prisma;
    this.passwordHasher = passwordHasher;
  }

  public async  verifyUserNameAndPasswordAsync(requestDto: VerifyUserNameAndPasswordRequestDto): Promise<void> {
    const userRecord = await this.prisma.user.findUnique({
      where: { userName: requestDto.userName },
      select: { passwordHash: true }
    });

    if (userRecord == null) {
      
    }
  }
}
