import type { SeatingDetailResponseDto, SeatingUpsertRequestDto } from '#/api';
import { OrderBasicModel } from './sharedModels';

export class SeatingDetailModel {
  public id: number;
  public name: string;
  public activeOrder: OrderBasicModel | null;

  public constructor(responseDto: SeatingDetailResponseDto) {
    this.id = responseDto.id;
    this.name = responseDto.name;
    this.activeOrder = responseDto.activeOrder && new OrderBasicModel(responseDto.activeOrder);
  }
}

export class SeatingUpsertModel {
  public name: string = '';

  public constructor(responseDto?: SeatingDetailResponseDto) {
    if (responseDto) {
      this.name = responseDto.name;
    }
  }

  toRequestDto(): SeatingUpsertRequestDto {
    return {
      name: this.name
    };
  }
}
