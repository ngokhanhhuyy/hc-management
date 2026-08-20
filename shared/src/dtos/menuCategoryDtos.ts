import * as v from "valibot";
import { ValidationContracts } from "../constants/index.js";

export type MenuCategoryuUpsertRequestDto = v.InferOutput<typeof MenuCategoryuUpsertRequestDto>;
export const MenuCategoryuUpsertRequestDto = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(ValidationContracts.MenuCategory.NameMinLength),
    v.maxLength(ValidationContracts.MenuCategory.NameMaxLength))
});
