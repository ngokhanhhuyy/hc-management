import { httpClient } from "./httpClient";
import type { ISeatingApi } from "@hc-management/shared/api";
import type {
  SeatingBasicResponseDto,
  SeatingDetailResponseDto,
  SeatingUpsertRequestDto
} from "@hc-management/shared/dtos";

const seatingApiPath = "/seatings";

export const seatingApi: ISeatingApi = {
  async getAllAsync(): Promise<SeatingBasicResponseDto[]> {
    return await httpClient.sendAndParseAsync(seatingApiPath, {
      method: "get"
    });
  },
  async getDetailAsync(id: number): Promise<SeatingDetailResponseDto> {
    return await httpClient.sendAndParseAsync(`${seatingApiPath}/${id}`, {
      method: "get",
    });
  },
  async createAsync(requestDto: SeatingUpsertRequestDto): Promise<number> {
    return await httpClient.sendAndParseAsync(seatingApiPath, {
      method: "post",
      body: requestDto
    });
  },
  async updateAsync(id: number, requestDto: SeatingUpsertRequestDto): Promise<void> {
    return await httpClient.sendAndIgnoreAsync(`${seatingApiPath}/${id}`, {
      method: "put",
      body: requestDto
    });
  },
  async deleteAsync(id: number): Promise<void> {
    return await httpClient.sendAndIgnoreAsync(`${seatingApiPath}/${id}`, {
      method: "delete",
    });
  },
};
