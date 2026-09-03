import { createMenuItemBasicModel, type MenuCategoryBasicModel, type MenuItemBasicModel } from "#/models";
import type { MenuItemListRequestDto, MenuItemListResponseDto } from "@hc-management/shared/dtos";

export type MenuItemListModel = {
  category: MenuCategoryBasicModel | null;
  searchContent: string;
  items: MenuItemBasicModel[];
  totalItemCount: number;
  mapFromResponseDto(responseDto: MenuItemListResponseDto): MenuItemListModel;
  toRequestDto(): MenuItemListRequestDto;
};

export function createMenuItemListModel(): MenuItemListModel {
  return {
    category: null,
    searchContent: "",
    items: [],
    totalItemCount: 0,
    mapFromResponseDto(responseDto: MenuItemListResponseDto): MenuItemListModel {
      return {
        ...this,
        items: responseDto.items.map(dto => createMenuItemBasicModel(dto)),
        totalItemCount: responseDto.totalItemCount
      };
    },
    toRequestDto(): MenuItemListRequestDto {
      return {
        categoryId: this.category?.id,
        searchContent: this.searchContent || undefined
      };
    }
  };
}
