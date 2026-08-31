import type {
  SeatingBasicResponseDto,
  SeatingDetailResponseDto,
  SeatingUpsertRequestDto
} from "@hc-management/shared/dtos";

export interface ISeatingApi {
  getAllAsync(): Promise<SeatingBasicResponseDto[]>;
  getDetailAsync(id: number): Promise<SeatingDetailResponseDto>;
  createAsync(requestDto: SeatingUpsertRequestDto): Promise<number>;
  updateAsync(id: number, args: SeatingUpsertRequestDto): Promise<void>;
  deleteAsync(id: number): Promise<void>;
}
