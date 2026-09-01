import { createOrderItemUpsertModel, type OrderItemUpsertModel } from "./orderItemModels";
import { createSeatingBasicModel, type SeatingBasicModel } from "./sharedModels";
import { OrderDetailResponseDto, type OrderUpsertRequestDto } from "@hc-management/shared/dtos";
import * as v from "valibot";

export type OrderUpsertModel = {
  id: number | null;
  seating: SeatingBasicModel;
  items: OrderItemUpsertModel[];
  concurrencyVersion: string | null;
  toRequestDto(): OrderUpsertRequestDto;
};

export function createOrderUpsertModel(arg: OrderDetailResponseDto | SeatingBasicModel): OrderUpsertModel {
  function toRequestDto(this: OrderUpsertModel): OrderUpsertRequestDto {
    return {
      seatingId: this.seating.id,
      items: this.items.map(item => item.toRequestDto()),
      concurrencyVersion: this.concurrencyVersion
    };
  };

  if (v.is(OrderDetailResponseDto, arg)) {
    const responseDto = arg;
    return {
      id: responseDto.id,
      seating: createSeatingBasicModel(responseDto.seating),
      items: responseDto.items.map(createOrderItemUpsertModel),
      concurrencyVersion: responseDto.concurrencyVersion,
      toRequestDto
    };
  }

  const seating = arg;
  return {
    id: null,
    seating,
    items: [],
    concurrencyVersion: null,
    toRequestDto
  };
}
