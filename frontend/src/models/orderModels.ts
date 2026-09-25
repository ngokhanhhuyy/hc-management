import {
  createOrderItemUpsertModel,
  createOrderItemDetailModel,
  type OrderItemUpsertModel ,
  type OrderItemDetailModel
} from "./orderItemModels";
import {
  createSeatingBasicModel,
  createOrderBasicModel,
  createUserBasicModel,
  type SeatingBasicModel,
  type OrderBasicModel,
  type UserBasicModel
} from "./sharedModels";
import {
  OrderListSortingCriterion,
  type SeatingDetailResponseDto,
  type OrderListRequestDto,
  type OrderListResponseDto,
  type OrderDetailResponseDto,
  type OrderUpsertRequestDto,
} from "#/api";
import { isSeatingDetailResponseDto, getDisplayDateTimeString } from "#/helpers";

export type OrderListModel = {
  sortByAscending: boolean;
  sortByCriteria: OrderListSortingCriterion;
  page: number;
  resultsPerPage: number;
  items: OrderBasicModel[];
  itemCount: number;
  pageCount: number;
  mapFromRequestDto(requestDto: OrderListRequestDto): OrderListModel;
  mapFromResponseDto(responseDto: OrderListResponseDto): OrderListModel;
  toRequestDto(): OrderListRequestDto;
};

export type OrderDetailModel = {
  id: number;
  createdDateTime: string;
  lastUpdatedDateTime: string | null;
  finishedDateTime: string | null;
  itemAmount: number;
  items: OrderItemDetailModel[];
  createdUser: UserBasicModel;
  lastUpdatedUser: UserBasicModel | null;
  finishedUser: UserBasicModel | null;
  seating: SeatingBasicModel;
};

export type OrderUpsertModel = {
  id: number | null;
  seating: SeatingBasicModel;
  items: OrderItemUpsertModel[];
  mapFromResponseDto(responseDto: OrderDetailResponseDto): OrderUpsertModel;
  toRequestDto(): OrderUpsertRequestDto;
};

export function createOrderListModel(): OrderListModel {
  return {
    sortByAscending: false,
    sortByCriteria: OrderListSortingCriterion.CreatedDateTime,
    page: 1,
    resultsPerPage: 20,
    items: [],
    itemCount: 0,
    pageCount: 0,
    mapFromRequestDto(requestDto: OrderListRequestDto): OrderListModel {
      return {
        ...this,
        sortByAscending: requestDto.sortByAscending ?? this.sortByAscending,
        sortByCriteria: requestDto.sortByCriterion ?? this.sortByCriteria,
        page: requestDto.page ?? this.page,
        resultsPerPage: requestDto.resultsPerPage ?? this.resultsPerPage
      };
    },
    mapFromResponseDto(responseDto: OrderListResponseDto): OrderListModel {
      return {
        ...this,
        items: responseDto.items.map(createOrderBasicModel),
        itemCount: responseDto.itemCount,
        pageCount: responseDto.pageCount
      };
    },
    toRequestDto(): OrderListRequestDto {
      return {
        sortByAscending: this.sortByAscending,
        sortByCriterion: this.sortByCriteria,
        page: this.page,
        resultsPerPage: this.resultsPerPage
      };
    }
  };
}

export function createOrderDetailModel(responseDto: OrderDetailResponseDto): OrderDetailModel {
  return {
    id: responseDto.id,
    createdDateTime: getDisplayDateTimeString(responseDto.createdDateTime),
    lastUpdatedDateTime: responseDto.lastUpdatedDateTime && getDisplayDateTimeString(responseDto.lastUpdatedDateTime),
    finishedDateTime: responseDto.finishedDateTime && getDisplayDateTimeString(responseDto.finishedDateTime),
    itemAmount: responseDto.itemAmount,
    items: responseDto.items.map(createOrderItemDetailModel),
    createdUser: createUserBasicModel(responseDto.createdUser),
    lastUpdatedUser: responseDto.lastUpdatedUser && createUserBasicModel(responseDto.lastUpdatedUser),
    finishedUser: responseDto.finishedUser && createUserBasicModel(responseDto.finishedUser),
    seating: createSeatingBasicModel(responseDto.seating)
  };
}

export function createOrderUpsertModel(seating: SeatingBasicModel | SeatingDetailResponseDto): OrderUpsertModel {
  let seatingModel;
  if (isSeatingDetailResponseDto(seating)) {
    seatingModel = createSeatingBasicModel({ ...seating, isDeleted: false });
  } else {
    seatingModel = seating;
  }

  return {
    id: seatingModel.activeOrder?.id ?? null,
    seating: seatingModel,
    items: [],
    mapFromResponseDto(responseDto: OrderDetailResponseDto): OrderUpsertModel {
      return {
        ...this,
        id: responseDto.id,
        items: responseDto.items.map(createOrderItemUpsertModel),
      };
    },
    toRequestDto(): OrderUpsertRequestDto {
      return {
        seatingId: this.seating.id,
        items: this.items.map(item => item.toRequestDto()),
      };
    }
  };
}
