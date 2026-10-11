type Implements<T, U extends T> = U;

export type VerifyCredentialsRequestDto = Implements<IRequestDto, {
  userName: string;
  password: string;
}>;

export type UserDetailResponseDto = {
  id: number;
  userName: string;
  deletedDateTime: string | null;
};

export type ChangePasswordRequestDto = Implements<IRequestDto, {
  currentPassword: string;
  newPassword: string;
}>;

export type MenuCategoryBasicResponseDto = {
  readonly id: number;
  readonly name: string;
  readonly sortingIndex: number | null;
};

export type MenuCategoryUpsertRequestDto = Implements<IRequestDto, {
  name: string;
  sortingIndex: number | null;
}>;

export type MenuItemBasicResponseDto = Implements<IResponseDto, {
  readonly id: number;
  readonly name: string;
  readonly unit: string;
  readonly defaultAmountBeforeVatPerUnit: number;
  readonly defaultVatPercentagePerUnit: number;
  readonly category: MenuCategoryBasicResponseDto | null;
  readonly isDeleted: boolean;
}>;

export type MenuItemListRequestDto = Partial<Implements<IListRequestDto<MenuItemListSortingCriterion>, {
  sortByAscending: boolean;
  sortByCriterion: MenuItemListSortingCriterion;
  searchContent: string | null;
  categoryId: number | null;
  deletedIncluded: boolean;
}>>;

export type UserBasicResponseDto = Implements<IResponseDto, {
  id: number;
  userName: string;
  isDeleted: boolean;
}>;

export type MenuItemDetailResponseDto = Implements<IResponseDto, {
  readonly id: number;
  readonly name: string;
  readonly unit: string;
  readonly defaultAmountBeforeVatPerUnit: number;
  readonly defaultVatPercentagePerUnit: number;
  readonly category: MenuCategoryBasicResponseDto | null;
  readonly createdUser: UserBasicResponseDto;
  readonly createdDateTime: string;
  readonly lastUpdatedUser: UserBasicResponseDto | null;
  readonly lastUpdatedDateTime: string | null;
  readonly deletedUser: UserBasicResponseDto | null;
  readonly deletedDateTime: string | null;
}>;

export type MenuItemUpsertRequestDto = Implements<IRequestDto, {
  name: string;
  unit: string;
  defaultAmountBeforeVatPerUnit: number;
  defaultVatPercentagePerUnit: number;
  categoryId: number | null;
}>;

export type OrderBasicResponseDto = Implements<IResponseDto, {
  readonly id: number;
  readonly itemAmount: number;
  readonly isFinished: boolean;
}>;

export type OrderListResponseDto = Implements<IPaginatedListResponseDto<OrderBasicResponseDto>, {
  readonly items: OrderBasicResponseDto[];
  readonly pageCount: number;
  readonly itemCount: number;
}>;

export type OrderListRequestDto = Partial<Implements<IPaginatedListRequestDto<OrderListSortingCriterion>, {
  sortByAscending: boolean;
  sortByCriterion: OrderListSortingCriterion;
  page: number;
  resultsPerPage: number;
  deletedIncluded: boolean;
}>>;

export type OrderItemDetailResponseDto = Implements<IResponseDto, {
  readonly id: number;
  readonly amountBeforeVatPerUnit: number;
  readonly vatPercentagePerUnit: number;
  readonly quantity: number;
  readonly menuItem: MenuItemBasicResponseDto;
}>;

export type SeatingBasicResponseDto = Implements<IResponseDto, {
  readonly id: number;
  readonly name: string;
  readonly activeOrder: OrderBasicResponseDto | null;
  readonly isDeleted: boolean;
}>;

export type OrderDetailResponseDto = Implements<IResponseDto, {
  readonly id: number;
  readonly createdDateTime: string;
  readonly lastUpdatedDateTime: string | null;
  readonly finishedDateTime: string | null;
  readonly itemAmount: number;
  readonly items: OrderItemDetailResponseDto[];
  readonly createdUser: UserBasicResponseDto;
  readonly lastUpdatedUser: UserBasicResponseDto | null;
  readonly finishedUser: UserBasicResponseDto | null;
  readonly seating: SeatingBasicResponseDto;
}>;

export type OrderItemUpsertRequestDto = Implements<IRequestDto, {
  id: number | null;
  amountBeforeVatPerUnit: number;
  vatPercentagePerUnit: number;
  quantity: number;
  menuItemId: number;
}>;

export type OrderUpsertRequestDto = Implements<IRequestDto, {
  seatingId: number;
  items: OrderItemUpsertRequestDto[];
}>;

export type SeatingDetailResponseDto = Implements<IResponseDto, {
  readonly id: number;
  readonly name: string;
  readonly activeOrder: OrderBasicResponseDto | null;
}>;

export type SeatingUpsertRequestDto = Implements<IRequestDto, {
  name: string;
}>;

export type UserCreateRequestDto = Implements<IRequestDto, {
  userName: string;
  password: string;
}>;

export enum MenuItemListSortingCriterion {
  Name = "Name",
  Category = "Category",
  DefaultAmountBeforeVatPerUnit = "DefaultAmountBeforeVatPerUnit"
}

export enum OrderListSortingCriterion {
  CreatedDateTime = "CreatedDateTime",
  LastUpdatedDateTime = "LastUpdatedDateTime",
  FinishedDateTime = "FinishedDateTime",
  ItemAmount = "ItemAmount"
}

export interface IRequestDto {
}

export interface IResponseDto {
}

export interface IListRequestDto<TSortingCriterion> extends IRequestDto {
  sortByAscending: boolean;
  sortByCriterion: TSortingCriterion;
}

export interface IListResponseDto<TBasic> {
  readonly items: TBasic[];
  readonly itemCount: number;
}

export interface IPaginatedListResponseDto<TBasic> extends IListResponseDto<TBasic> {
  readonly pageCount: number;
}

export interface IPaginatedListRequestDto<TSortingCriterion> extends IListRequestDto<TSortingCriterion> {
  page: number;
  resultsPerPage: number;
}

export const defaultMenuItemListRequestDto = {
  sortByAscending: true,
  sortByCriterion: "Name",
  searchContent: null,
  categoryId: null,
  deletedIncluded: false
} as MenuItemListRequestDto;

export const defaultOrderListRequestDto = {
  sortByAscending: true,
  sortByCriterion: "CreatedDateTime",
  page: 1,
  resultsPerPage: 15,
  deletedIncluded: false
} as OrderListRequestDto;
