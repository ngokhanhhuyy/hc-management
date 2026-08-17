import * as v from "valibot";
import { ValidationContracts } from "../constants/index.js";

export type MenuCategoryBasicResponseDto = v.InferOutput<typeof MenuCategoryBasicResponseDto>;
export const MenuCategoryBasicResponseDto = v.object({
  id: v.number(),
  name: v.string()
});

export type MenuCategoryuUpsertRequestDto = v.InferOutput<typeof MenuCategoryuUpsertRequestDto>;
export const MenuCategoryuUpsertRequestDto = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(ValidationContracts.MenuCategory.NameMinLength),
    v.maxLength(ValidationContracts.MenuCategory.NameMaxLength))
});
