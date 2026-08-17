import * as v from "valibot";
import { ValidationContracts } from "../constants/index.js";

export type OrderItemDetailResponseDto = v.InferOutput<typeof OrderItemDetailResponseDto>;
export const OrderItemDetailResponseDto = v.object({
  id: v.number(),
  quantity: v.number()
});

export type OrderItemUpsertRequestDto = v.InferOutput<typeof OrderItemUpsertRequestDto>;
export const OrderItemUpsertRequestDto = v.object({
  id: v.nullable(v.number()),
  quantity: v.pipe(v.number(), v.minValue(ValidationContracts.OrderItem.QuantityMinValue)),
  menuItemId: v.pipe(v.number())
});
