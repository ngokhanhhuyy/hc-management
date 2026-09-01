import { createMenuItemBasicModel, type MenuItemBasicModel } from "./sharedModels";
import { OrderItemDetailResponseDto, type OrderItemUpsertRequestDto } from "@hc-management/shared/dtos";
import * as v from "valibot";

export type OrderItemUpsertModel = {
  id: number | null,
  amountBeforeVatPerUnit: number,
  vatPercentagePerUnit: number;
  quantity: number;
  menuItem: MenuItemBasicModel;
  concurrencyVersion: string | null;
  toRequestDto(): OrderItemUpsertRequestDto;
};

export function createOrderItemUpsertModel(
  arg: OrderItemDetailResponseDto | MenuItemBasicModel): OrderItemUpsertModel
{
  const model: OrderItemUpsertModel = {
    id: null,
    amountBeforeVatPerUnit: 0,
    vatPercentagePerUnit: 0,
    quantity: 1,
    menuItem: null!,
    concurrencyVersion: null,
    toRequestDto(): OrderItemUpsertRequestDto {
      return {
        id: this.id,
        amountBeforeVatPerUnit: this.amountBeforeVatPerUnit,
        vatPercentagePerUnit: this.vatPercentagePerUnit,
        quantity: this.quantity,
        menuItemId: this.menuItem.id,
        concurrencyVersion: this.concurrencyVersion
      };
    }
  };

  if (v.is(OrderItemDetailResponseDto, arg)) {
    model.id = arg.id;
    model.amountBeforeVatPerUnit = arg.menuItem.defaultAmountBeforeVatPerUnit;
    model.vatPercentagePerUnit = arg.menuItem.defaultVatPercentagePerUnit;
    model.menuItem = createMenuItemBasicModel(arg.menuItem);
    model.concurrencyVersion = arg.concurrencyVersion;

    return model;
  }
  
  model.amountBeforeVatPerUnit = arg.defaultAmountBeforeVatPerUnit;
  model.vatPercentagePerUnit = arg.defaultVatPercentagePerUnit;
  model.menuItem = arg;

  return model;
}
