import type { MenuCategoryBasicResponseDto, MenuCategoryUpsertRequestDto } from "@hc-management/shared/dtos";

export interface IMenuCategoryApi {
  getAllAsync(): Promise<MenuCategoryBasicResponseDto[]>;
  getSingleAsync(id: number): Promise<MenuCategoryBasicResponseDto>;
  createAsync(requestDto: MenuCategoryUpsertRequestDto): Promise<number>;
  updateAsync(id: number, requestDto: MenuCategoryUpsertRequestDto): Promise<void>;
  deleteAsync(id: number): Promise<void>;
}
