import type { User } from "#/prisma/client";
import type { UserBasicResponseDto, UserDetailResponseDto } from "@hc-management/shared/dtos";

export function createUserBasicResponseDto(user: User): UserBasicResponseDto {
  return {
    id: user.id,
    userName: user.userName
  };
}
export function createUserDetailResponseDto(user: User): UserDetailResponseDto {
  return {
    id: user.id,
    userName: user.userName
  };
}
