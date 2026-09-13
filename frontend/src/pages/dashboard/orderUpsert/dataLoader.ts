import { api } from "#/api";
import {
  createMenuCategoryBasicModel,
  createMenuItemListModel,
  createOrderUpsertModel,
  type MenuCategoryBasicModel,
  type MenuItemListModel,
  type OrderUpsertModel
} from "#/models";

export type DataLoadedResult = {
  menuCategoryListModel: MenuCategoryBasicModel[];
  menuItemListModel: MenuItemListModel;
  orderUpsertModel: OrderUpsertModel;
};

export async function loadDataAsync(seatingId: number): Promise<DataLoadedResult> {
  let menuItemListModel = createMenuItemListModel();
  const [seatingDetailResponseDto, menuCategoryListResponseDtos, menuItemListResponseDto] = await Promise.all([
    api.seating.getDetailAsync(seatingId),
    api.menuCategory.getAllAsync(),
    api.menuItem.getListAsync(menuItemListModel.toRequestDto())
  ]);

  menuItemListModel = menuItemListModel.mapFromResponseDto(menuItemListResponseDto);

  let orderUpsertModel = createOrderUpsertModel(seatingDetailResponseDto);
  if (seatingDetailResponseDto.activeOrder) {
    const orderDetailResponseDto = await api.order.getDetailAsync(seatingDetailResponseDto.activeOrder.id);
    orderUpsertModel = orderUpsertModel.mapFromResponseDto(orderDetailResponseDto);
  }

  return {
    menuCategoryListModel: menuCategoryListResponseDtos.map(createMenuCategoryBasicModel),
    menuItemListModel,
    orderUpsertModel
  };
}
