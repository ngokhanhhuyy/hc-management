import { createUserBasicResponseDto, createUserDetailResponseDto } from "./userDtoFactories";
import { createMenuCategoryBasicResponseDto } from "./menuCategoryDtoFactories";

export const dtoFactories = {
  user: {
    basicResponseDto: createUserBasicResponseDto,
    detailResponseDto: createUserDetailResponseDto
  },
  menuCategory: {
    basicResponseDto: createMenuCategoryBasicResponseDto
  }
};
