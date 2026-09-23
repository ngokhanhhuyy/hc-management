import * as authenticationApi from "./generated/client/authentication";
import * as menuCategoryApi from "./generated/client/menu-category";
import * as menuItemApi from "./generated/client/menu-item";
import * as seatingApi from "./generated/client/seating";
import * as orderApi from "./generated/client/order";
import * as userApi from "./generated/client/user";

export const api = {
  authentication: authenticationApi,
  menuCategory: menuCategoryApi,
  menuItem: menuItemApi,
  seating: seatingApi,
  order: orderApi,
  user: userApi
};

export type * from "./generated/mutators/errors";
