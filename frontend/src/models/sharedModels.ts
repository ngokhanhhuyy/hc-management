import type {
  MenuCategoryBasicResponseDto,
  MenuItemBasicResponseDto,
  SeatingBasicResponseDto,
  OrderBasicResponseDto
} from "@hc-management/shared/dtos";

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
  isDeleted: boolean;
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
    isDeleted: responseDto.isDeleted
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
    isFinished: responseDto.isFinished
  };
}
