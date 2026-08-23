import type { User } from "../../database/client";
import type { UserBasicResponseDto, UserDetailResponseDto } from "@hc-management/shared/dtos";

export interface IUserDtoFactory {
  createBasicResponseDto(user: User): UserBasicResponseDto;
  createDetailResponseDto(user: User): UserDetailResponseDto;
}

export class UserDtoFactory implements IUserDtoFactory {
  public createBasicResponseDto(user: User): UserBasicResponseDto {
    return {
      id: user.id,
      userName: user.userName
    };
  }

  public createDetailResponseDto(user: User): UserDetailResponseDto {
    return {
      id: user.id,
      userName: user.userName
    };
  }
}
