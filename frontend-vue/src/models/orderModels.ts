import { OrderItemUpsertModel, OrderItemDetailModel } from './orderItemModels';
import { SeatingBasicModel, OrderBasicModel, UserBasicModel } from './sharedModels';
import {
  OrderListSortingCriterion,
  type SeatingDetailResponseDto,
  type OrderListRequestDto,
  type OrderListResponseDto,
  type OrderDetailResponseDto,
  type OrderUpsertRequestDto,
} from '#/api';
import { isSeatingDetailResponseDto, getDisplayDateTimeString } from '#/helpers';

export class OrderListModel {
  public sortByAscending: boolean;
  public sortByCriteria: OrderListSortingCriterion;
  public page: number;
  public resultsPerPage: number;
  public items: OrderBasicModel[];
  public itemCount: number;
  public pageCount: number;

  public constructor() {
    this.sortByAscending = false;
    this.sortByCriteria = OrderListSortingCriterion.CreatedDateTime;
    this.page = 1;
    this.resultsPerPage = 20;
    this.items = [];
    this.itemCount = 0;
    this.pageCount = 0;
  }

  public mapFromRequestDto(requestDto: OrderListRequestDto): void {
    this.sortByAscending = requestDto.sortByAscending ?? this.sortByAscending;
    this.sortByCriteria = requestDto.sortByCriterion ?? this.sortByCriteria;
    this.page = requestDto.page ?? this.page;
    this.resultsPerPage = requestDto.resultsPerPage ?? this.resultsPerPage;
  }

  public mapFromResponseDto(responseDto: OrderListResponseDto): void {
    this.items = responseDto.items.map(dto => new OrderBasicModel(dto));
    this.itemCount = responseDto.itemCount;
    this.pageCount = responseDto.pageCount;
  }

  toRequestDto(): OrderListRequestDto {
    return {
      sortByAscending: this.sortByAscending,
      sortByCriterion: this.sortByCriteria,
      page: this.page,
      resultsPerPage: this.resultsPerPage
    };
  }
}

export class OrderDetailModel {
  public id: number;
  public createdDateTime: string;
  public lastUpdatedDateTime: string | null;
  public finishedDateTime: string | null;
  public itemAmount: number;
  public items: OrderItemDetailModel[];
  public createdUser: UserBasicModel;
  public lastUpdatedUser: UserBasicModel | null;
  public finishedUser: UserBasicModel | null;
  public seating: SeatingBasicModel;

  public constructor(responseDto: OrderDetailResponseDto) {
    this.id = responseDto.id;
    this.createdDateTime = getDisplayDateTimeString(responseDto.createdDateTime);
    this.lastUpdatedDateTime = responseDto.lastUpdatedDateTime && getDisplayDateTimeString(responseDto.lastUpdatedDateTime);
    this.finishedDateTime = responseDto.finishedDateTime && getDisplayDateTimeString(responseDto.finishedDateTime);
    this.itemAmount = responseDto.itemAmount;
    this.items = responseDto.items.map(dto => new OrderItemDetailModel(dto));
    this.createdUser = new UserBasicModel(responseDto.createdUser);
    this.lastUpdatedUser = responseDto.lastUpdatedUser && new UserBasicModel(responseDto.lastUpdatedUser);
    this.finishedUser = responseDto.finishedUser && new UserBasicModel(responseDto.finishedUser);
    this.seating = new SeatingBasicModel(responseDto.seating);
  }
}

export class OrderUpsertModel {
  public id: number | null;
  public seating: SeatingBasicModel;
  public items: OrderItemUpsertModel[];

  public constructor(seating: SeatingBasicModel | SeatingDetailResponseDto) {
    let seatingModel;
    if (isSeatingDetailResponseDto(seating)) {
      seatingModel = new SeatingBasicModel({ ...seating, isDeleted: false });
    } else {
      seatingModel = seating;
    }

    this.id = seatingModel.activeOrder?.id ?? null;
    this.seating = seatingModel;
    this.items = [];
  }

  public mapFromResponseDto(responseDto: OrderDetailResponseDto): void {
    this.id = responseDto.id;
    this.items = responseDto.items.map(dto => new OrderItemUpsertModel(dto));
  }

  public mapIdsFromResponseDto(responseDto: OrderDetailResponseDto): void {
    this.id = responseDto.id;
    for (const item of this.items) {
      if (item.id != null) {
        continue;
      }

      const itemResponseDto = responseDto.items.find(i => i.guid == item.guid);
      if (!itemResponseDto) {
        continue;
      }

      item.id = itemResponseDto.id;
    }
  }

  public toRequestDto(): OrderUpsertRequestDto {
    return {
      seatingId: this.seating.id,
      items: this.items.map(item => item.toRequestDto()),
    };
  }
}
