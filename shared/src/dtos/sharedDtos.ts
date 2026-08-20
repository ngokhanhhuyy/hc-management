import * as v from "valibot";

export type MenuItemBasicResponseDto = v.InferOutput<typeof MenuItemBasicResponseDto>;
export const MenuItemBasicResponseDto = v.object({
  id: v.number(),
  name: v.string(),
  unit: v.nullable(v.string()),
  defaultPriceBeforeVatPerUnit: v.number(),
  defaultVatPercentagePerUnit: v.number(),
});

export type MenuCategoryBasicResponseDto = v.InferOutput<typeof MenuCategoryBasicResponseDto>;
export const MenuCategoryBasicResponseDto = v.object({
  id: v.number(),
  name: v.string()
});
export type SeatingBasicResponseDto = v.InferOutput<typeof SeatingBasicResponseDto>;
export const SeatingBasicResponseDto = v.object({
  id: v.number(),
  name: v.string(),
  isActive: v.boolean()
});

export type OrderBasicResponseDto = v.InferOutput<typeof OrderBasicResponseDto>;
export const OrderBasicResponseDto = v.object({
  id: v.number(),
  itemAmount: v.number(),
  isFinished: v.boolean(),
  seating: SeatingBasicResponseDto
});

export type UserBasicResponseDto = v.InferOutput<typeof UserBasicResponseDto>;
export const UserBasicResponseDto = v.object({
  id: v.number(),
  userName: v.string()
});
