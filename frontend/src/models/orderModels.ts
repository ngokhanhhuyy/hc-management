import { createOrderItemUpsertModel, type OrderItemUpsertModel } from "./orderItemModels";
import { createSeatingBasicModel, type SeatingBasicModel } from "./sharedModels";
import {
  type SeatingDetailResponseDto,
  type OrderDetailResponseDto,
  type OrderUpsertRequestDto
} from "#/api";
import { isSeatingDetailResponseDto } from "#/helpers";

export type OrderUpsertModel = {
  id: number | null;
  seating: SeatingBasicModel;
  items: OrderItemUpsertModel[];
  mapFromResponseDto(responseDto: OrderDetailResponseDto): OrderUpsertModel;
  toRequestDto(): OrderUpsertRequestDto;
};

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
