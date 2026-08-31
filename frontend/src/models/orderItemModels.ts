import {
  OrderItemDetailResponseDto,
  type OrderItemUpsertRequestDto,
  type MenuItemBasicResponseDto } from "@hc-management/shared/dtos";
import * as v from "valibot";

export type OrderItemUpsertModel = {
  id: number | null,
  amountBeforeVatPerUnit: number,
  vatPercentagePerUnit: number;
  quantity: number;
  menuItem: number;
  concurrencyVersion: string | null;
  toRequestDto(): OrderItemUpsertRequestDto;
};

export function createOrderItemUpsertModel(
  arg: OrderItemDetailResponseDto | MenuItemBasicResponseDto): OrderItemUpsertModel
{
  const model: OrderItemUpsertModel = {
    id: null,
    amountBeforeVatPerUnit: 0,
    vatPercentagePerUnit: 0,
    quantity: 1,
    menuItemId: 0,
    concurrencyVersion: null,
    toRequestDto(): OrderItemUpsertRequestDto {
      return {
        id: this.id,
        amountBeforeVatPerUnit: this.amountBeforeVatPerUnit,
        vatPercentagePerUnit: this.vatPercentagePerUnit,
        quantity: this.quantity,
        menuItemId: this.menuItemId,
      };
    }
  };

  if (v.is(OrderItemDetailResponseDto, arg)) {
    model.id = arg.id;
    model.amountBeforeVatPerUnit = arg.menuItem.defaultAmountBeforeVatPerUnit;
    model.vatPercentagePerUnit = arg.menuItem.defaultVatPercentagePerUnit;
    model.menuItemId = arg.menuItem.id;
    model.concurrencyVersion = arg.concurrencyVersion;

    return model;
  }
  
  model.amountBeforeVatPerUnit = arg.defaultAmountBeforeVatPerUnit;
  model.vatPercentagePerUnit = arg.defaultVatPercentagePerUnit;
  model.menuItemId = arg.id;

  return model;
}
