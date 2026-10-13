import {
  createMenuCategoryBasicModel,
  createMenuItemBasicModel,
  type MenuCategoryBasicModel,
  type MenuItemBasicModel
} from "#/models";
import {
  defaultMenuItemListRequestDto,
  MenuItemListSortingCriterion,
  type MenuItemListRequestDto,
  type MenuItemListResponseDto,
  type MenuItemDetailResponseDto,
  type MenuItemUpsertRequestDto,
} from "#/api";

export type MenuItemListModel = {
  sortByAscending: boolean;
  sortByCriterion: MenuItemListSortingCriterion;
  page: number;
  resultsPerPage: number;
  category: MenuCategoryBasicModel | null;
  searchContent: string;
  items: MenuItemBasicModel[];
  itemCount: number;
  pageCount: number;
  mapFromResponseDto(responseDto: MenuItemListResponseDto): MenuItemListModel;
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
    sortByAscending: defaultMenuItemListRequestDto.sortByAscending ?? true,
    sortByCriterion: defaultMenuItemListRequestDto.sortByCriterion ?? MenuItemListSortingCriterion.Name,
    page: defaultMenuItemListRequestDto.page ?? 1,
    resultsPerPage: defaultMenuItemListRequestDto.resultsPerPage ?? 15,
    itemCount: 0,
    pageCount: 0,
    category: null,
    searchContent: "",
    items: [],
    mapFromResponseDto(responseDto: MenuItemListResponseDto): MenuItemListModel {
      return {
        ...this,
        items: responseDto.items.map(dto => createMenuItemBasicModel(dto)),
        itemCount: responseDto.itemCount,
        pageCount: responseDto.pageCount
      };
    },
    toRequestDto(): MenuItemListRequestDto {
      return {
        page: this.page,
        resultsPerPage: this.resultsPerPage,
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
