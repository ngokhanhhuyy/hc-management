import type { MenuCategoryBasicResponseDto, MenuCategoryUpsertRequestDto } from '#/api';

export class MenuCategoryUpsertModel {
  public name: string = '';
  public sortingIndex: number = -1;

  public constructor(responseDto?: MenuCategoryBasicResponseDto) {
    if (responseDto) {
      this.name = responseDto.name;
      this.sortingIndex = responseDto.sortingIndex ?? -1;
    }
  }

  public toRequestDto(): MenuCategoryUpsertRequestDto {
    return {
      name: this.name,
      sortingIndex: this.sortingIndex < 0 ? null : this.sortingIndex
    };
  }
}
