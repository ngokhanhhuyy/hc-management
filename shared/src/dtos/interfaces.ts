export interface IListRequestDto {
  sortByAscending: boolean;
  sortByFieldName: string;
  page: number;
  resultsPerPage: number;
}

export interface IListResponseDto<TItem extends object> {
  items: TItem[];
  pageCount: number;
  itemCount: number;
}
