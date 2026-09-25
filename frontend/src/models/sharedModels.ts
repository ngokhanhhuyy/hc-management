import type {
  MenuCategoryBasicResponseDto,
  MenuItemBasicResponseDto,
  SeatingBasicResponseDto,
  OrderBasicResponseDto,
  UserBasicResponseDto,
} from "#/api";
import { getDisplayAmountText } from "#/helpers";

export type MenuCategoryBasicModel = {
  id: number;
  name: string;
};

export type MenuItemBasicModel = {
  id: number;
  name: string;
  unit: string | null;
  defaultAmountBeforeVatPerUnit: number;
  defaultVatPercentagePerUnit: number;
  category: MenuCategoryBasicModel | null;
  isDeleted: boolean;
  readonly displayDefaultAmountBeforeVatPerUnit: string;
};

export type SeatingBasicModel = {
  id: number;
  name: string;
  activeOrder: OrderBasicModel | null;
  isDeleted: boolean;
};

export type OrderBasicModel = {
  id: number;
  itemAmount: number;
  isFinished: boolean;
  readonly displayItemAmount: string;
};

export type UserBasicModel = {
  id: number;
  userName: string;
  isDeleted: boolean;
};

export function createMenuCategoryBasicModel(responseDto: MenuCategoryBasicResponseDto): MenuCategoryBasicModel {
  return {
    id: responseDto.id,
    name: responseDto.name
  };
}

export function createMenuItemBasicModel(responseDto: MenuItemBasicResponseDto): MenuItemBasicModel {
  return {
    id: responseDto.id,
    name: responseDto.name,
    unit: responseDto.unit,
    defaultAmountBeforeVatPerUnit: responseDto.defaultAmountBeforeVatPerUnit,
    defaultVatPercentagePerUnit: responseDto.defaultVatPercentagePerUnit,
    category: responseDto.category && createMenuCategoryBasicModel(responseDto.category),
    isDeleted: responseDto.isDeleted,
    displayDefaultAmountBeforeVatPerUnit: getDisplayAmountText(responseDto.defaultAmountBeforeVatPerUnit)
  };
}

export function createSeatingBasicModel(responseDto: SeatingBasicResponseDto): SeatingBasicModel {
  return {
    id: responseDto.id,
    name: responseDto.name ?? `Bàn không tên ${responseDto.id}`,
    activeOrder: responseDto.activeOrder && createOrderBasicModel(responseDto.activeOrder),
    isDeleted: responseDto.isDeleted
  };
}

export function createOrderBasicModel(responseDto: OrderBasicResponseDto): OrderBasicModel {
  return {
    id: responseDto.id,
    itemAmount: responseDto.itemAmount,
    isFinished: responseDto.isFinished,
    displayItemAmount: getDisplayAmountText(responseDto.itemAmount)
  };
}

export function createUserBasicModel(responseDto: UserBasicResponseDto): UserBasicModel {
  return {
    id: responseDto.id,
    userName: responseDto.userName,
    isDeleted: responseDto.isDeleted
  };
}
