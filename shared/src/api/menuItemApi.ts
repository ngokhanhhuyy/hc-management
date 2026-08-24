import type {
  MenuItemListRequestDto,
  MenuItemBasicResponseDto,
  MenuItemUpsertRequestDto
} from "@hc-management/shared/dtos";

export interface IMenuItemApi {
  getListAsync(requestDto: MenuItemListRequestDto): Promise<MenuItemBasicResponseDto[]>;
  getDetailAsync(id: number): Promise<MenuItemBasicResponseDto>;
  createAsync(requestDto: MenuItemUpsertRequestDto): Promise<number>;
  updateAsync(id: number, args: MenuItemUpsertRequestDto): Promise<void>;
  deleteAsync(id: number): Promise<void>;
}
