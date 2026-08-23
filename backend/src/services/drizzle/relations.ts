import { sql, defineRelations } from "drizzle-orm";
import * as schemas from "./schemas";

export const relations = defineRelations(schemas, (relation) => ({
  users: {
    createdMenuItems: relation.many.menuItems({
      from: relation.menuItems.createdUserId,
      to: relation.users.id
    }),
    lastUpdatedMenuItems: relation.many.menuItems({
      from: relation.menuItems.lastUpdatedUserId,
      to: relation.users.id
    }),
    deletedMenuItems: relation.many.menuItems({
      from: relation.menuItems.deletedUserId,
      to: relation.users.id
    }),
    createdOrders: relation.many.orders({
      from: relation.orders.createdUserId,
      to: relation.users.id
    }),
    lastUpdatedOrders: relation.many.orders({
      from: relation.orders.lastUpdatedUserId,
      to: relation.users.id
    }),
    deletedOrders: relation.many.orders({
      from: relation.orders.deletedUserId,
      to: relation.users.id
    }),
    finishedOrders: relation.many.orders({
      from: relation.orders.finishedUserId,
      to: relation.users.id
    }),
  },
  menuItems: {
    category: relation.one.menuCategories({
      from: relation.menuItems.categoryId,
      to: relation.menuCategories.id
    }),
    orderItem: relation.many.orderItems(),
    createdUser: relation.one.users({
      from: relation.menuItems.createdUserId,
      to: relation.users.id
    }),
    lastUpdatedUser: relation.one.users({
      from: relation.menuItems.lastUpdatedUserId,
      to: relation.users.id
    }),
    deletedUser: relation.one.users({
      from: relation.menuItems.deletedUserId,
      to: relation.users.id
    }),
  },
  menuCategories: {
    menuItems: relation.many.menuItems({
      from: relation.menuItems.categoryId,
      to: relation.menuCategories.id
    })
  },
  seatings: {
    orders: relation.many.orders({
      from: relation.orders.seatingId,
      to: relation.seatings.id
    }),
  },
  orders: {
    createdUser: relation.one.users({
      from: relation.orders.createdUserId,
      to: relation.users.id
    }),
    lastUpdatedUser: relation.one.users({
      from: relation.orders.lastUpdatedUserId,
      to: relation.users.id
    }),
    deletedUser: relation.one.users({
      from: relation.orders.deletedUserId,
      to: relation.users.id
    }),
    finishedUser: relation.one.users({
      from: relation.orders.finishedUserId,
      to: relation.users.id
    }),
    seating: relation.one.seatings({
      from: relation.orders.seatingId,
      to: relation.seatings.id
    }),
    items: relation.many.orderItems({
      from: relation.orderItems.orderId,
      to: relation.orders.id
    })
  },
  orderItems: {
    order: relation.one.orders({
      from: relation.orderItems.orderId,
      to: relation.orders.id
    }),
    menuItem: relation.one.menuItems({
      from: relation.orderItems.menuItemId,
      to: relation.menuItems.id
    })
  }
}));
