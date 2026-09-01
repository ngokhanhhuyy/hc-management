import { authenticationApi } from "./authenticationApi";
import { menuCategoryApi } from "./menuCategoryApi";
import { menuItemApi } from "./menuItemApi";
import { seatingApi } from "./seatingApi";
import { orderApi } from "./orderApi";
import { userApi } from "./userApi";

export const api = {
  authentication: authenticationApi,
  menuCategory: menuCategoryApi,
  menuItem: menuItemApi,
  seating: seatingApi,
  order: orderApi,
  user: userApi
};
