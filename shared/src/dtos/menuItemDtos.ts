import * as v from "valibot";
import { Temporal } from "@js-temporal/polyfill";
import { ValidationContracts } from "../constants/index.js";
import { MenuCategoryBasicResponseDto, UserBasicResponseDto, MenuItemBasicResponseDto } from "./sharedDtos.js";
import {  } from "./userDtos.js";
import { ISODateToTemporalPlainDateTransformer, NullableISODateToTemporalPlainDateTransformer } from "./transformer.js";

export type MenuItemDetailResponseDto = v.InferOutput<typeof MenuItemDetailResponseDto>;
export const MenuItemDetailResponseDto = v.object({
  ...MenuItemBasicResponseDto.entries,
  createdDateTime: v.pipe(v.string(), v.isoDate(), ISODateToTemporalPlainDateTransformer),
  lastUpdatedDateTime: v.pipe(
    v.nullable(v.pipe(v.string(), v.isoDate())),
    NullableISODateToTemporalPlainDateTransformer),
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
  defaultPriceBeforeVatPerUnit: v.pipe(
    v.number(),
    v.minValue(ValidationContracts.MenuItem.DefaultPriceBeforeVatPerUnitMinValue)),
  defaultVatPercentagePerUnit: v.pipe(
    v.number(),
    v.minValue(ValidationContracts.MenuItem.DefaultVatPercentagePerUnitMinValue),
    v.maxValue(ValidationContracts.MenuItem.DefaultVatPercentagePerUnitMaxValue)),
  categoryId: v.nullable(v.number())
});
