import { httpClient } from "./httpClient";
import type { IMenuItemApi } from "@hc-management/shared/api";
import type {
  MenuItemListRequestDto,
  MenuItemListResponseDto,
  MenuItemDetailResponseDto,
  MenuItemUpsertRequestDto
} from "@hc-management/shared/dtos";

const menuItemApiPath = "/menu-items";
export const menuItemApi: IMenuItemApi = {
  async getListAsync(requestDto: MenuItemListRequestDto): Promise<MenuItemListResponseDto> {
    return await httpClient.sendAndParseAsync(menuItemApiPath, {
      method: "get",
      query: requestDto
    });
  },
  async getDetailAsync(id: number): Promise<MenuItemDetailResponseDto> {
    return await httpClient.sendAndParseAsync(`${menuItemApiPath}/${id}`, {
      method: "get",
    });
  },
  async createAsync(requestDto: MenuItemUpsertRequestDto): Promise<number> {
    return await httpClient.sendAndParseAsync(menuItemApiPath, {
      method: "post",
      body: requestDto
    });
  },
  async updateAsync(id: number, requestDto: MenuItemUpsertRequestDto): Promise<void> {
    return await httpClient.sendAndIgnoreAsync(`${menuItemApiPath}/${id}`, {
      method: "put",
      body: requestDto
    });
  },
  async deleteAsync(id: number): Promise<void> {
    return await httpClient.sendAndIgnoreAsync(`${menuItemApiPath}/${id}`, {
      method: "delete",
    });
  },
};
