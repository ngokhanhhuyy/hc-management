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
  async createAsync(requestDto: OrderUpsertRequestDto): Promise<number> {
    return await httpClient.sendAndParseAsync(orderApiPath, {
      method: "post",
      body: requestDto
    });
  },
};
