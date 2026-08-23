import type { MenuItem, MenuCategory } from "#/prisma/client";
import type { IClock } from "../time";
import { createMenuCategoryBasicResponseDto } from "./menuCategoryDtoFactories";
import type { MenuItemBasicResponseDto, MenuItemDetailResponseDto } from "@hc-management/shared/dtos";

export function createMenuItemBasicResponseDto(menuItem: MenuItem): MenuItemBasicResponseDto {
  return {
    id: menuItem.id,
    name: menuItem.name,
    unit: menuItem.unit,
    defaultAmountBeforeVatPerUnit: menuItem.defaultAmountBeforeVatPerUnit,
    defaultVatPercentagePerUnit: menuItem.defaultVatPercentagePerUnit
  };
}

export function createMenuItemDetailResponseDto(
  menuItem: MenuItem,
  menuCategory: MenuCategory | null,
  clock: IClock): MenuItemDetailResponseDto
{
  return {
    ...createMenuItemBasicResponseDto(menuItem),
    createdDateTime: clock.convertJSDateToDateTimeISOString(menuItem.createdDateTime),
    lastUpdatedDateTime: menuItem.lastUpdatedDateTime &&
      clock.convertJSDateToDateTimeISOString(menuItem.lastUpdatedDateTime),
    category: menuCategory && createMenuCategoryBasicResponseDto(menuCategory),
    
  }
}
