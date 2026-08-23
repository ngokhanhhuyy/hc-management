import type { MenuCategory } from "#/prisma/client";
import type { MenuCategoryBasicResponseDto } from "@hc-management/shared/dtos";

export function createMenuCategoryBasicResponseDto(menuCategory: MenuCategory): MenuCategoryBasicResponseDto {
  return {
    id: menuCategory.id,
    name: menuCategory.name
  };
}
