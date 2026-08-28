import { httpClient } from "./httpClient";
import type { IUserApi } from "@hc-management/shared/api";
import type { UserDetailResponseDto, UserCreateRequestDto } from "@hc-management/shared/dtos";

const userApiPath = "/users";

export const userApi: IUserApi = {
  async getDetailAsync(id: number): Promise<UserDetailResponseDto> {
    return await httpClient.sendAndParseAsync(`${userApiPath}/${id}`, {
      method: "get"
    });
  },

  async createAsync(requestDto: UserCreateRequestDto): Promise<number> {
    return await httpClient.sendAndParseAsync(userApiPath, {
      method: "post",
      body: requestDto
    });
  }
};
