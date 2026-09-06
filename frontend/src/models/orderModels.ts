import { createOrderItemUpsertModel, type OrderItemUpsertModel } from "./orderItemModels";
import type { SeatingBasicModel } from "./sharedModels";
import type { OrderDetailResponseDto, OrderUpsertRequestDto } from "@hc-management/shared/dtos";
import * as v from "valibot";

export type OrderUpsertModel = {
  id: number | null;
  seating: SeatingBasicModel;
  items: OrderItemUpsertModel[];
  concurrencyVersion: string;
  mapFromResponseDto(responseDto: OrderDetailResponseDto): OrderUpsertModel;
  toRequestDto(): OrderUpsertRequestDto;
};

export function createOrderUpsertModel(seating: SeatingBasicModel): OrderUpsertModel {
  return {
    id: null,
    seating,
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
