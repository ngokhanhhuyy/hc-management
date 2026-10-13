import { api, defaultOrderListRequestDto, type OrderListResponseDto } from "#/api";
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
    responseDto = await api.order.getListAsync(defaultOrderListRequestDto);

    return createOrderListModel().mapFromRequestDto(defaultOrderListRequestDto).mapFromResponseDto(responseDto);
  }

  responseDto = await api.order.getListAsync(model.toRequestDto());
  return model.mapFromResponseDto(responseDto);
}

export async function loadOrderDetailAsync(id: number): Promise<OrderDetailModel> {
  const responseDto = await api.order.getDetailAsync(id);
  return createOrderDetailModel(responseDto);
}
