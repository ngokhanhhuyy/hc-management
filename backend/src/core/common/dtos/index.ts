import type { User, MenuItem, MenuCategory, Seating, Order, OrderItem } from "../../database/client";
import type {
  UserBasicResponseDto,
  UserDetailResponseDto,
  MenuItemBasicResponseDto,
  MenuItemDetailResponseDto,
  MenuCategoryBasicResponseDto,
  SeatingBasicResponseDto,
  SeatingDetailResponseDto,
  OrderBasicResponseDto,
  OrderListResponseDto,
  OrderDetailResponseDto,
  OrderItemDetailResponseDto
} from "@hc-management/shared/dtos";

export interface IDtoFactory {
  createUserBasic(user: User): UserBasicResponseDto;
  createUserDetail(user: User): UserDetailResponseDto;
  createMenuItemBasic(menuItem: MenuItem): MenuItemBasicResponseDto;
  createMenuItemDetail(menuItem: MenuItemDetailResponseDtoFactoryArgs): MenuItemDetailResponseDto;
  createMenuCategoryBasic(menuCategory: MenuCategory): MenuCategoryBasicResponseDto;
  createSeatingBasic(seating: SeatingBasicResponseDtoFactoryArgs): SeatingBasicResponseDto;
  createSeatingDetail(seating: Seating): SeatingDetailResponseDto;
  createOrderBasic(order: OrderBasicResponseDtoFactoryArgs): OrderBasicResponseDto;
  createOrderList(
    pageCount: number,
    itemCount: number,
    orders: OrderBasicResponseDtoFactoryArgs[]): OrderListResponseDto;
  createOrderDetail(order: OrderDetailResponseDtoFactoryArgs): OrderDetailResponseDto;
  createOrderItemDetail(orderItem: OrderItem, menuItem: MenuItem): OrderItemDetailResponseDto;
}

export class DtoFactory implements IDtoFactory {
  public createUserBasic(user: User): UserBasicResponseDto {
    return {
      id: user.id,
      userName: user.userName
    };
  }

  public createUserDetail(user: User): UserDetailResponseDto {
    return {
      id: user.id,
      userName: user.userName
    };
  }
  

  public createMenuItemBasic(menuItem: MenuItem): MenuItemBasicResponseDto {
    return {
      id: menuItem.id,
      name: menuItem.name,
      unit: menuItem.unit,
      defaultAmountBeforeVatPerUnit: menuItem.defaultAmountBeforeVatPerUnit,
      defaultVatPercentagePerUnit: menuItem.defaultVatPercentagePerUnit,
      isDeleted: menuItem.deletedDateTime != null
    };
  }
  
  public createMenuItemDetail(menuItem: MenuItemDetailResponseDtoFactoryArgs): MenuItemDetailResponseDto {
    return {
      ...this.createMenuItemBasic(menuItem),
      createdDateTime: menuItem.createdDateTime.toISOString(),
      lastUpdatedDateTime: menuItem.lastUpdatedDateTime?.toISOString() ?? null,
      category: menuItem.category && this.createMenuCategoryBasic(menuItem.category),
      createdUser: this.createUserBasic(menuItem.createdUser),
      lastUpdatedUser: menuItem.lastUpdatedUser && this.createUserBasic(menuItem.lastUpdatedUser),
    };
  }

  public createSeatingBasic(seating: SeatingBasicResponseDtoFactoryArgs): SeatingBasicResponseDto {
    return {
      id: seating.id,
      name: seating.name,
      activeOrder: (seating.activeOrder && this.createOrderBasic(seating.activeOrder)) ?? null,
      isDeleted: seating.isDeleted
    };
  }

  public createSeatingDetail(seating: SeatingDetailResponseDtoFactoryArgs): SeatingDetailResponseDto {
    return {
      ...this.createSeatingBasic(seating)
    };
  }
  
  public createMenuCategoryBasic(menuCategory: MenuCategory): MenuCategoryBasicResponseDto {
    return {
      id: menuCategory.id,
      name: menuCategory.name
    };
  }


  public createOrderBasic(order: Order): OrderBasicResponseDto {
    return {
      id: order.id,
      itemAmount: order.cachedItemAmount,
      isFinished: order.finishedDateTime != null
    };
  }

  public createOrderList(
    pageCount: number,
    itemCount: number,
    orders: OrderBasicResponseDtoFactoryArgs[]): OrderListResponseDto
  {
    return {
      pageCount,
      itemCount,
      items: orders.map(o => this.createOrderBasic(o))
    };
  }

  public createOrderDetail(order: OrderDetailResponseDtoFactoryArgs): OrderDetailResponseDto {
    return {
      id: order.id,
      createdDateTime: order.createdDateTime.toISOString(),
      lastUpdatedDateTime: order.lastUpdatedDateTime?.toISOString() ?? null,
      finishedDateTime: order.finishedDateTime?.toISOString() ?? null,
      itemAmount: order.cachedItemAmount,
      items: order.items.map(dto => this.createOrderItemDetail(dto)),
      createdUser: this.createUserBasic(order.createdUser),
      lastUpdatedUser: order.lastUpdatedUser && this.createUserBasic(order.lastUpdatedUser),
      finishedUser: order.finishedUser && this.createUserBasic(order.finishedUser),
      seating: this.createSeatingBasic(order.seating),
      concurrencyVersion: order.concurrencyVersion
    };
  }

  public createOrderItemDetail(orderItem: OrderItemDetailResponseDtoFactoryArgs): OrderItemDetailResponseDto {
    return {
      id: orderItem.id,
      quantity: orderItem.quantity,
      menuItem: this.createMenuItemBasic(orderItem.menuItem),
      concurrencyVersion: orderItem.concurrencyVersion
    };
  }
}

type MenuItemDetailResponseDtoFactoryArgs = MenuItem & {
  category: MenuCategory | null;
  createdUser: User;
  lastUpdatedUser: User | null;
};

type SeatingBasicResponseDtoFactoryArgs = Seating & {
  activeOrder?: Order | null;
};

type SeatingDetailResponseDtoFactoryArgs = SeatingBasicResponseDtoFactoryArgs & {
  createdUser: User;
  lastUpdatedUser: User | null;
};

type OrderBasicResponseDtoFactoryArgs = Order & {
  seating: Seating;
};

type OrderDetailResponseDtoFactoryArgs = OrderBasicResponseDtoFactoryArgs & {
  items: OrderItemDetailResponseDtoFactoryArgs[],
  createdUser: User;
  lastUpdatedUser: User | null;
  finishedUser: User | null;
};

type OrderItemDetailResponseDtoFactoryArgs = OrderItem & {
  menuItem: MenuItem;
};
