import {
  createMenuCategoryBasicModel,
  createMenuItemBasicModel,
  type MenuCategoryBasicModel,
  type MenuItemBasicModel
} from "#/models";
import {
  type MenuItemListRequestDto,
  type MenuItemBasicResponseDto,
  type MenuItemDetailResponseDto,
  type MenuItemUpsertRequestDto,
  MenuItemListSortingCriterion
} from "#/api";

export type MenuItemListModel = {
  sortByAscending: boolean;
  sortByCriterion: MenuItemListSortingCriterion;
  category: MenuCategoryBasicModel | null;
  searchContent: string;
  items: MenuItemBasicModel[];
  mapFromRequestDto(requestDto: MenuItemListRequestDto): MenuItemListModel;
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
    sortByAscending: true,
    sortByCriterion: MenuItemListSortingCriterion.Name,
    category: null,
    searchContent: "",
    items: [],
    mapFromRequestDto(requestDto: MenuItemListRequestDto): MenuItemListModel {
      return {
        ...this,
        sortByAscending: requestDto?.sortByAscending ?? this.sortByAscending,
        sortByCriterion: requestDto?.sortByCriterion ?? this.sortByCriterion
      };
    },
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
