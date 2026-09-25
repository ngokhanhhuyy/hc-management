import type { SeatingDetailResponseDto, SeatingUpsertRequestDto } from "#/api";
import { createOrderBasicModel, type OrderBasicModel } from "./sharedModels";

export type SeatingDetailModel = {
  id: number;
  name: string;
  activeOrder: OrderBasicModel | null;
};

export type SeatingUpsertModel = {
  name: string;
  toRequestDto(): SeatingUpsertRequestDto;
};

export function createSeatingDetailModel(responseDto: SeatingDetailResponseDto): SeatingDetailModel {
  return {
    id: responseDto.id,
    name: responseDto.name,
    activeOrder: responseDto.activeOrder && createOrderBasicModel(responseDto.activeOrder)
  };
}

export function createSeatingUpsertModel(responseDto?: SeatingDetailResponseDto): SeatingUpsertModel {
  return {
    name: responseDto?.name ?? "",
    toRequestDto(): SeatingUpsertRequestDto {
      return {
        name: this.name
      };
    }
  };
}
