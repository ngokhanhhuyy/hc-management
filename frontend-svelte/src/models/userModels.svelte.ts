import type { UserDetailResponseDto } from "#/api";

export class UserDetailModel {
  public id: number;
  public userName: string;
  public deletedDateTime: string | null;

  public constructor(responseDto: UserDetailResponseDto) {
    this.id = $state(responseDto.id);
    this.userName = $state(responseDto.userName);
    this.deletedDateTime = $state(responseDto.deletedDateTime);
  }
};
