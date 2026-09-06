import type {
  OrderListRequestDto,
  OrderListResponseDto,
  OrderDetailResponseDto,
  OrderUpsertRequestDto
} from "@hc-management/shared/dtos";

export interface IOrderApi {
  getListAsync(requestDto: OrderListRequestDto): Promise<OrderListResponseDto>;
  getDetailAsync(id: number): Promise<OrderDetailResponseDto>;
  createAsync(requestDto: OrderUpsertRequestDto): Promise<OrderDetailResponseDto>;
  updateAsync(id: number, args: OrderUpsertRequestDto): Promise<OrderDetailResponseDto>;
  finishAsync(id: number): Promise<void>;
  // deleteAsync(id: number): Promise<void>;
}
