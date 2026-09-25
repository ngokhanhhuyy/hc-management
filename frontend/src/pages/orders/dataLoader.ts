import { api, type OrderListResponseDto } from "#/api";
import { createOrderListModel, createOrderDetailModel, type OrderListModel, type OrderDetailModel } from "#/models";

export type OrderPageDataLoadedResult = {
  list: OrderListModel;
  detail: OrderDetailModel | null;
};

export async function loadDataAsync(id?: number): Promise<OrderPageDataLoadedResult> {
  const listPromise = loadOrderListAsync();
  if (id != null) {
    const [list, detail] = await Promise.all([
      listPromise,
      loadOrderDetailAsync(id)
    ]);

    return { list, detail };
  }

  return {
    list: await listPromise,
    detail: null
  };
}

export async function loadOrderListAsync(model?: OrderListModel): Promise<OrderListModel> {
  let responseDto: OrderListResponseDto;
  if (!model) {
    const defaultRequestDto = await api.order.getDefaultListParametersAsync();
    responseDto = await api.order.getListAsync(defaultRequestDto);

    return createOrderListModel().mapFromRequestDto(defaultRequestDto).mapFromResponseDto(responseDto);
  }

  responseDto = await api.order.getListAsync(model.toRequestDto());
  return model.mapFromResponseDto(responseDto);
}

export async function loadOrderDetailAsync(id: number): Promise<OrderDetailModel> {
  const responseDto = await api.order.getDetailAsync(id);
  return createOrderDetailModel(responseDto);
}
