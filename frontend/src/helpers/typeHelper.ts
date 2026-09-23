import type { OrderItemDetailResponseDto, SeatingDetailResponseDto } from "#/api";
import type { MenuItemBasicModel, SeatingBasicModel } from "#/models";

type OrderItemDetail = OrderItemDetailResponseDto;
export function isOrderItemDetailResponseDto(arg: OrderItemDetail | MenuItemBasicModel): arg is OrderItemDetail {
  return checkType(arg, {
    "id": "number",
    "amountBeforeVatPerUnit": "number",
    "vatPercentagePerUnit": "number",
    "quantity": "number",
    "menuItem": "object"
  });
};

type SeatingDetail = SeatingDetailResponseDto;
export function isSeatingDetailResponseDto(arg: SeatingDetail | SeatingBasicModel): arg is SeatingDetail {
  return checkType(arg, {
    "id": "number",
    "name": "string",
    "activeOrder": "object"
  });
}

function checkType<T extends object>(
  arg: object,
  expectedKeysWithTypes: { [key in keyof T]: "number" | "string" | "object" }): arg is T
{
  for (const [expectedKey, expectedType] of Object.entries(expectedKeysWithTypes)) {
    if (!Object.keys(arg).includes(expectedKey) || typeof arg[expectedKey as keyof typeof arg] !== expectedType) {
      return false;
    }
  }

  return true;
}
