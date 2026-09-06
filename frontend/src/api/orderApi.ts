import { httpClient } from "./httpClient";
import type { IOrderApi } from "@hc-management/shared/api";
import type {
  OrderListRequestDto,
  OrderListResponseDto,
  OrderDetailResponseDto,
  OrderUpsertRequestDto
} from "@hc-management/shared/dtos";

const orderApiPath = "/orders";
export const orderApi: IOrderApi = {
  async getListAsync(requestDto: OrderListRequestDto): Promise<OrderListResponseDto> {
    return await httpClient.sendAndParseAsync(orderApiPath, {
      method: "query",
      body: requestDto
    });
  },
  async getDetailAsync(id: number): Promise<OrderDetailResponseDto> {
    return await httpClient.sendAndParseAsync(`${orderApiPath}/${id}`, {
      method: "get",
    });
  },
  async createAsync(requestDto: OrderUpsertRequestDto): Promise<OrderDetailResponseDto> {
    return await httpClient.sendAndParseAsync(orderApiPath, {
      method: "post",
      body: requestDto
    });
  },
  async updateAsync(id: number, requestDto: OrderUpsertRequestDto): Promise<OrderDetailResponseDto> {
    return await httpClient.sendAndParseAsync(`${orderApiPath}/${id}`, {
      method: "put",
      body: requestDto
    });
  },
  async finishAsync(id: number): Promise<void> {
    return await httpClient.sendAndIgnoreAsync(`${orderApiPath}/${id}/finish`, {
      method: "put",
    });
  },
};
