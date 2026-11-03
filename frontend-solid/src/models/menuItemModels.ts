import { MenuItemBasicModel, MenuCategoryBasicModel } from "./sharedModels";
import {
  defaultMenuItemListRequestDto,
  MenuItemListSortingCriterion,
  type MenuItemListRequestDto,
  type MenuItemListResponseDto,
  type MenuItemDetailResponseDto,
  type MenuItemUpsertRequestDto,
} from "#/api";

export class MenuItemListModel {
  public sortByAscending: boolean;
  public sortByCriterion: MenuItemListSortingCriterion;
  public page: number;
  public resultsPerPage: number;
  public category: MenuCategoryBasicModel | null;
  public searchContent: string;
  public items: MenuItemBasicModel[];
  public itemCount: number;
  public pageCount: number;

  public constructor() {
    this.sortByAscending = defaultMenuItemListRequestDto.sortByAscending ?? true;
    this.sortByCriterion = defaultMenuItemListRequestDto.sortByCriterion ?? MenuItemListSortingCriterion.Name;
    this.page = defaultMenuItemListRequestDto.page ?? 1;
    this.resultsPerPage = defaultMenuItemListRequestDto.resultsPerPage ?? 15;
    this.category = null;
    this.searchContent = "";
    this.items = [];
    this.itemCount = 0;
    this.pageCount = 0;
  }

  public mapFromResponseDto(responseDto: MenuItemListResponseDto): void {
    this.items = responseDto.items.map(dto => new MenuItemBasicModel(dto));
    this.itemCount = responseDto.itemCount;
    this.pageCount = responseDto.pageCount;
  };

  public toRequestDto(): MenuItemListRequestDto {
    return {
      sortByAscending: this.sortByAscending,
      sortByCriterion: this.sortByCriterion,
      page: this.page,
      resultsPerPage: this.resultsPerPage,
      categoryId: this.category?.id,
      searchContent: this.searchContent || undefined
    };
  }
}

export class MenuItemUpsertModel {
  public name: string = "";
  public unit: string = "";
  public defaultAmountBeforeVatPerUnit: number = 0;
  public defaultVatPercentagePerUnit: number = 0;
  public category: MenuCategoryBasicModel | null = null;

  public mapFromResponseDto(responseDto: MenuItemDetailResponseDto): void {
    this.name = "";
    this.unit = "";
    this.defaultAmountBeforeVatPerUnit = 0;
    this.defaultVatPercentagePerUnit = 0;

    if (responseDto.category) {
      this.category =new MenuCategoryBasicModel(responseDto.category);
    }
  }

  public toRequestDto(): MenuItemUpsertRequestDto {
    return {
      name: this.name,
      unit: this.unit,
      defaultAmountBeforeVatPerUnit: this.defaultAmountBeforeVatPerUnit,
      defaultVatPercentagePerUnit: this.defaultVatPercentagePerUnit,
      categoryId: this.category?.id ?? null
    };
  }
}
