import type { SeatingBasicResponseDto, OrderBasicResponseDto } from "@hc-management/shared/dtos";

export type SeatingBasicModel = {
  id: number;
  name: string | null;
  activeOrder: OrderBasicModel | null;
  isDeleted: boolean;
};

export type OrderBasicModel = {
  id: number;
  itemAmount: number;
  isFinished: boolean;
};

export function createSeatingBasicModel(responseDto: SeatingBasicResponseDto): SeatingBasicModel {
  return {
    id: responseDto.id,
    name: responseDto.name,
    activeOrder: responseDto.activeOrder && createOrderBasicModel(responseDto.activeOrder),
    isDeleted: responseDto.isDeleted
  };
}

export function createOrderBasicModel(responseDto: OrderBasicResponseDto): OrderBasicModel {
  return {
    id: responseDto.id,
    itemAmount: responseDto.itemAmount,
    isFinished: responseDto.isFinished
  };
}
