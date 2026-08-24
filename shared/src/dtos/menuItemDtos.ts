import * as v from "valibot";
import { ValidationContracts } from "../constants/index.js";
import { MenuCategoryBasicResponseDto, UserBasicResponseDto, MenuItemBasicResponseDto } from "./sharedDtos.js";

export type MenuItemListRequestDto = v.InferOutput<typeof MenuItemListRequestDto>;
export const MenuItemListRequestDto = v.object({
  categoryId: v.optional(v.number())
});

export type MenuItemDetailResponseDto = v.InferOutput<typeof MenuItemDetailResponseDto>;
export const MenuItemDetailResponseDto = v.object({
  ...MenuItemBasicResponseDto.entries,
  createdDateTime: v.pipe(v.string(), v.isoDate()),
  lastUpdatedDateTime: v.nullable(v.pipe(v.string(), v.isoDate())),
  category: v.nullable(MenuCategoryBasicResponseDto),
  createdUser: UserBasicResponseDto,
  lastUpdatedUser: v.nullable(UserBasicResponseDto)
});

export type MenuItemUpsertRequestDto = v.InferOutput<typeof MenuItemUpsertRequestDto>;
export const MenuItemUpsertRequestDto = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(ValidationContracts.MenuItem.NameMinLength),
    v.maxLength(ValidationContracts.MenuItem.NameMaxLength)),
  unit: v.nullable(v.pipe(
    v.string(),
    v.maxLength(ValidationContracts.MenuItem.UnitMaxLength))),
  defaultAmountBeforeVatPerUnit: v.pipe(
    v.number(),
    v.minValue(ValidationContracts.MenuItem.DefaultPriceBeforeVatPerUnitMinValue)),
  defaultVatPercentagePerUnit: v.pipe(
    v.number(),
    v.minValue(ValidationContracts.MenuItem.DefaultVatPercentagePerUnitMinValue),
    v.maxValue(ValidationContracts.MenuItem.DefaultVatPercentagePerUnitMaxValue)),
  categoryId: v.nullable(v.number())
});
