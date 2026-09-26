import type { MenuCategoryBasicResponseDto, MenuCategoryUpsertRequestDto } from "#/api";

export type MenuCategoryUpsertModel = {
  name: string;
  sortingIndex: number;
  toRequestDto(): MenuCategoryUpsertRequestDto;
};

export function createMenuCategoryUpsertModel(responseDto?: MenuCategoryBasicResponseDto): MenuCategoryUpsertModel {
  return {
    name: responseDto?.name ?? "",
    sortingIndex: responseDto?.sortingIndex ?? -1,
    toRequestDto(): MenuCategoryUpsertRequestDto {
      return {
        name: this.name,
        sortingIndex: this.sortingIndex < 0 ? null : this.sortingIndex
      };
    }
  };
}
