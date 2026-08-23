import * as v from "valibot";
import { ValidationContracts } from "../constants/index.js";

export type MenuCategoryUpsertRequestDto = v.InferOutput<typeof MenuCategoryUpsertRequestDto>;
export const MenuCategoryUpsertRequestDto = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(ValidationContracts.MenuCategory.NameMinLength),
    v.maxLength(ValidationContracts.MenuCategory.NameMaxLength))
});
