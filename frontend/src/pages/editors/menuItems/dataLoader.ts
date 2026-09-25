import { api } from "#/api";
import {
  createMenuItemListModel,
  createMenuItemUpsertModel,
  createMenuCategoryBasicModel,
  type MenuItemUpsertModel,
  type MenuItemListModel,
  type MenuCategoryBasicModel
} from "#/models";

export async function loadMenuItemListDataAsync(model?: MenuItemListModel): Promise<MenuItemListModel> {
  const requestDto = model?.toRequestDto();
  const responseDto = await api.menuItem.getListAsync(requestDto);
  
  return createMenuItemListModel().mapFromResponseDto(responseDto);
}

export type MenuItemUpsertLoadedData = {
  upsert: MenuItemUpsertModel;
  categories: MenuCategoryBasicModel[];
};

export async function loadMenuItemUpsertDataAsync(id?: number): Promise<MenuItemUpsertLoadedData> {
  const categoriesPromise = api.menuCategory.getAllAsync().then(dtos => dtos.map(createMenuCategoryBasicModel));
  if (id != null) {
    const [detailResponseDto, categories] = await Promise.all([
      api.menuItem.getDetailAsync(id),
      categoriesPromise
    ]);

    return {
      upsert: createMenuItemUpsertModel(detailResponseDto),
      categories
    };
  }

  const categories = await categoriesPromise;
  return {
    upsert: createMenuItemUpsertModel(),
    categories
  };
}
