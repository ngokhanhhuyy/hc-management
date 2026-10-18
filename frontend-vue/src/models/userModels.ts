import type { UserDetailResponseDto } from '#/api';

export class UserDetailModel {
  public id: number;
  public userName: string;
  public deletedDateTime: string | null;

  public constructor(responseDto: UserDetailResponseDto) {
    this.id = responseDto.id;
    this.userName = responseDto.userName;
    this.deletedDateTime = responseDto.deletedDateTime;
  }
};
