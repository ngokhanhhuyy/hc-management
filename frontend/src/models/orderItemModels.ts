import { createMenuItemBasicModel, type MenuItemBasicModel } from "./sharedModels";
import type { OrderItemDetailResponseDto, OrderItemUpsertRequestDto } from "#/api";
import { isOrderItemDetailResponseDto } from "#/helpers";

export type OrderItemUpsertModel = {
  id: number | null,
  amountBeforeVatPerUnit: number,
  vatPercentagePerUnit: number;
  quantity: number;
  menuItem: MenuItemBasicModel;
  guid: string;
  toRequestDto(): OrderItemUpsertRequestDto;
};

export function createOrderItemUpsertModel(arg: OrderItemDetailResponseDto | MenuItemBasicModel): OrderItemUpsertModel {
  const model: OrderItemUpsertModel = {
    id: null,
    amountBeforeVatPerUnit: 0,
    vatPercentagePerUnit: 0,
    quantity: 1,
    menuItem: null!,
    guid: crypto.randomUUID(),
    toRequestDto(): OrderItemUpsertRequestDto {
      return {
        id: this.id,
        amountBeforeVatPerUnit: this.amountBeforeVatPerUnit,
        vatPercentagePerUnit: this.vatPercentagePerUnit,
        quantity: this.quantity,
        menuItemId: this.menuItem.id,
      };
    }
  };

  if (isOrderItemDetailResponseDto(arg)) {
    model.id = arg.id;
    model.amountBeforeVatPerUnit = arg.amountBeforeVatPerUnit;
    model.vatPercentagePerUnit = arg.vatPercentagePerUnit;
    model.quantity = arg.quantity;
    model.menuItem = createMenuItemBasicModel(arg.menuItem);

    return model;
  }
  
  model.amountBeforeVatPerUnit = arg.defaultAmountBeforeVatPerUnit;
  model.vatPercentagePerUnit = arg.defaultVatPercentagePerUnit;
  model.menuItem = arg;

  return model;
}
