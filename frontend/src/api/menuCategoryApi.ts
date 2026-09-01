import { httpClient } from "./httpClient";
import type { IMenuCategoryApi } from "@hc-management/shared/api";
import type {
  MenuCategoryBasicResponseDto,
  MenuCategoryUpsertRequestDto
} from "@hc-management/shared/dtos";

const menuCategoryApiPath = "/menu-categories";
export const menuCategoryApi: IMenuCategoryApi = {
  async getAllAsync(): Promise<MenuCategoryBasicResponseDto[]> {
    return await httpClient.sendAndParseAsync(menuCategoryApiPath, {
      method: "get",
    });
  },
  async getSingleAsync(id: number): Promise<MenuCategoryBasicResponseDto> {
    return await httpClient.sendAndParseAsync(`${menuCategoryApiPath}/${id}`, {
      method: "get",
    });
  },
  async createAsync(requestDto: MenuCategoryUpsertRequestDto): Promise<number> {
    return await httpClient.sendAndParseAsync(menuCategoryApiPath, {
      method: "post",
      body: requestDto
    });
  },
  async updateAsync(id: number, requestDto: MenuCategoryUpsertRequestDto): Promise<void> {
    return await httpClient.sendAndParseAsync(`${menuCategoryApiPath}/${id}`, {
      method: "put",
      body: requestDto
    });
  },
  async deleteAsync(id: number): Promise<void> {
    return await httpClient.sendAndParseAsync(`${menuCategoryApiPath}/${id}`, {
      method: "delete",
    });
  },
};
