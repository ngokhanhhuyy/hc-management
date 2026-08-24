import type { UserDetailResponseDto, UserCreateRequestDto } from "../dtos/index.js";

export interface IUserApi {
  getDetailAsync(id: number): Promise<UserDetailResponseDto>;
  createAsync(requestDto: UserCreateRequestDto): Promise<number>;
}
