import type { SeatingBasicResponseDto } from "@hc-management/shared/dtos";

export type SeatingMapItemModel = {
  id: number;
  name: string;
  isActive: boolean;
};

export function createSeatingMapModel(responseDtos?: SeatingBasicResponseDto[]): SeatingMapModel {
  return {
    items: responseDtos?.map(createSeatingMapItemModel) ?? [],
    mapFromResponseDtos(responseDtos: SeatingBasicResponseDto[]): SeatingMapModel {
      return {
        ...this,
        items: responseDtos.map(createSeatingMapItemModel)
      };
    }
  };
}

export function createSeatingMapItemModel(responseDto: SeatingBasicResponseDto): SeatingMapItemModel {
  return {
    id: responseDto.id,
    name: responseDto.name ?? `Bàn không tên #${responseDto.id}`,
    isActive: !!responseDto.activeOrder
  };
}
