import type { UserDetailResponseDto } from "#/api";

export type UserDetailModel = {
  id: number;
  userName: string;
  deletedDateTime: string | null;
};

export function createUserDetailModel(responseDto: UserDetailResponseDto): UserDetailModel {
  return {
    ...responseDto
  };
}
