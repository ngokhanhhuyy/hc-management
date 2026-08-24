import type { MenuCategory } from "../../database/client";
import type { MenuCategoryBasicResponseDto } from "@hc-management/shared/dtos";

export interface IMenuCategoryDtoFactory {
  createBasicResponseDto(menuCategory: MenuCategory): MenuCategoryBasicResponseDto;
}

export class MenuCategoryDtoFactory implements IMenuCategoryDtoFactory {
  public createBasicResponseDto(menuCategory: MenuCategory): MenuCategoryBasicResponseDto {
    return {
      id: menuCategory.id,
      name: menuCategory.name
    };
  }
}
