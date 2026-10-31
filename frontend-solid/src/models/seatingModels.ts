import type { SeatingDetailResponseDto, SeatingUpsertRequestDto } from "#/api";
import { OrderBasicModel } from "./sharedModels";

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
  public name: string = "";

  public mapFromResponseDto(responseDto: SeatingDetailResponseDto) {
    this.name = responseDto.name;
  }

  public toRequestDto(): SeatingUpsertRequestDto {
    return {
      name: this.name
    };
  }
}
