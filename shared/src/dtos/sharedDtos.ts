import * as v from "valibot";

export type MenuItemBasicResponseDto = v.InferOutput<typeof MenuItemBasicResponseDto>;
export const MenuItemBasicResponseDto = v.object({
  id: v.number(),
  name: v.string(),
  unit: v.nullable(v.string()),
  defaultAmountBeforeVatPerUnit: v.number(),
  defaultVatPercentagePerUnit: v.number(),
  isDeleted: v.boolean()
});

export type MenuCategoryBasicResponseDto = v.InferOutput<typeof MenuCategoryBasicResponseDto>;
export const MenuCategoryBasicResponseDto = v.object({
  id: v.number(),
  name: v.string()
});

export type OrderBasicResponseDto = v.InferOutput<typeof OrderBasicResponseDto>;
export const OrderBasicResponseDto = v.object({
  id: v.number(),
  itemAmount: v.number(),
  isFinished: v.boolean(),
});

export type SeatingBasicResponseDto = v.InferOutput<typeof SeatingBasicResponseDto>;
export const SeatingBasicResponseDto = v.object({
  id: v.number(),
  name: v.nullable(v.string()),
  activeOrder: v.nullable(OrderBasicResponseDto),
  isDeleted: v.boolean()
});

export type UserBasicResponseDto = v.InferOutput<typeof UserBasicResponseDto>;
export const UserBasicResponseDto = v.object({
  id: v.number(),
  userName: v.string()
});
