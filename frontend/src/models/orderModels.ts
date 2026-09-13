import { createOrderItemUpsertModel, type OrderItemUpsertModel } from "./orderItemModels";
import { createSeatingBasicModel, type SeatingBasicModel } from "./sharedModels";
import {
  SeatingDetailResponseDto,
  type OrderDetailResponseDto,
  type OrderUpsertRequestDto } from "@hc-management/shared/dtos";
import * as v from "valibot";

export type OrderUpsertModel = {
  id: number | null;
  seating: SeatingBasicModel;
  items: OrderItemUpsertModel[];
  concurrencyVersion: string;
  mapFromResponseDto(responseDto: OrderDetailResponseDto): OrderUpsertModel;
  toRequestDto(): OrderUpsertRequestDto;
};

export function createOrderUpsertModel(seating: SeatingBasicModel | SeatingDetailResponseDto): OrderUpsertModel {
  let seatingModel;
  if (v.is(SeatingDetailResponseDto, seating)) {
    seatingModel = createSeatingBasicModel({ ...seating, isDeleted: false });
  } else {
    seatingModel = seating;
  }

  return {
    id: seatingModel.activeOrder?.id ?? null,
    seating: seatingModel,
    items: [],
    concurrencyVersion: "",
    mapFromResponseDto(responseDto: OrderDetailResponseDto): OrderUpsertModel {
      return {
        ...this,
        id: responseDto.id,
        items: responseDto.items.map(createOrderItemUpsertModel),
        concurrencyVersion: responseDto.concurrencyVersion
      };
    },
    toRequestDto(): OrderUpsertRequestDto {
      return {
        seatingId: this.seating.id,
        items: this.items.map(item => item.toRequestDto()),
        concurrencyVersion: this.concurrencyVersion
      };
    }
  };
}
