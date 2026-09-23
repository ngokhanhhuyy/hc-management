import { createMenuItemBasicModel, type MenuCategoryBasicModel, type MenuItemBasicModel } from "#/models";
import type { MenuItemListRequestDto, MenuItemBasicResponseDto } from "#/api";

export type MenuItemListModel = {
  category: MenuCategoryBasicModel | null;
  searchContent: string;
  items: MenuItemBasicModel[];
  mapFromResponseDto(responseDtos: MenuItemBasicResponseDto[]): MenuItemListModel;
  toRequestDto(): MenuItemListRequestDto;
};

export function createMenuItemListModel(): MenuItemListModel {
  return {
    category: null,
    searchContent: "",
    items: [],
    mapFromResponseDto(responseDtos: MenuItemBasicResponseDto[]): MenuItemListModel {
      return {
        ...this,
        items: responseDtos.map(dto => createMenuItemBasicModel(dto)),
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
