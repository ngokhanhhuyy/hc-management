import { api } from "#/api";
import {
  createMenuCategoryBasicModel,
  createMenuCategoryUpsertModel,
  type MenuCategoryBasicModel,
  type MenuCategoryUpsertModel
} from "#/models";

export async function loadMenuCategoryListDataAsync(): Promise<MenuCategoryBasicModel[]> {
  const responseDtos = await api.menuCategory.getAllAsync();
  return responseDtos.map(createMenuCategoryBasicModel);
}

export async function loadMenuCategoryUpsertDataAsync(id?: number): Promise<MenuCategoryUpsertModel> {
  if (!id) {
    return createMenuCategoryUpsertModel();
  }

  const responseDto = await api.menuCategory.getSingleAsync(id);
  return createMenuCategoryUpsertModel(responseDto);
}
