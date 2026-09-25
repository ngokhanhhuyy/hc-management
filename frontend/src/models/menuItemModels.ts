import {
  createMenuCategoryBasicModel,
  createMenuItemBasicModel,
  type MenuCategoryBasicModel,
  type MenuItemBasicModel
} from "#/models";
import type {
  MenuItemListRequestDto,
  MenuItemBasicResponseDto,
  MenuItemDetailResponseDto,
  MenuItemUpsertRequestDto
} from "#/api";

export type MenuItemListModel = {
  category: MenuCategoryBasicModel | null;
  searchContent: string;
  items: MenuItemBasicModel[];
  mapFromResponseDto(responseDtos: MenuItemBasicResponseDto[]): MenuItemListModel;
  toRequestDto(): MenuItemListRequestDto;
};

export type MenuItemUpsertModel = {
  name: string;
  unit: string;
  defaultAmountBeforeVatPerUnit: number;
  defaultVatPercentagePerUnit: number;
  category: MenuCategoryBasicModel | null;
  toRequestDto(): MenuItemUpsertRequestDto;
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

export function createMenuItemUpsertModel(responseDto?: MenuItemDetailResponseDto): MenuItemUpsertModel {
  return {
    name: responseDto?.name ?? "",
    unit: responseDto?.unit ?? "",
    defaultAmountBeforeVatPerUnit: responseDto?.defaultAmountBeforeVatPerUnit ?? 0,
    defaultVatPercentagePerUnit: responseDto?.defaultVatPercentagePerUnit ?? 0,
    category: responseDto?.category ? createMenuCategoryBasicModel(responseDto.category) : null,
    toRequestDto(): MenuItemUpsertRequestDto {
      return {
        name: this.name,
        unit: this.unit,
        defaultAmountBeforeVatPerUnit: this.defaultAmountBeforeVatPerUnit,
        defaultVatPercentagePerUnit: this.defaultVatPercentagePerUnit,
        categoryId: this.category?.id ?? null
      };
    }
  };
}
