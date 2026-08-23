import type { IClock } from "../time";
import type { IUserDtoFactory } from "./userDtoFactory";
import { createMenuCategoryBasicResponseDto } from "./menuCategoryDtoFactories";
import type { IServiceContainer } from "#/dependencyInjection";
import type { MenuItem, MenuCategory, User } from "#/services/database/client";
import type { MenuItemBasicResponseDto, MenuItemDetailResponseDto } from "@hc-management/shared/dtos";

type MenuItemDetailResponseDtoFactoryArgs = MenuItem & {
  category: MenuCategory;
  createdUser: User;
  lastUpdatedUser: User | null;
};

export interface IMenuItemDtoFactory {
  createBasicResponseDto(menuItem: MenuItem): MenuItemBasicResponseDto;
  createDetailResponseDto(menuItem: MenuItem): MenuItemDetailResponseDto;
}

export class MenuItemDtoFactory implements IMenuItemDtoFactory {
  private readonly userDtoFactory: IUserDtoFactory;
  private readonly clock: IClock;

  public constructor({ userDtoFactory, clock }: IServiceContainer) {
    this.userDtoFactory = userDtoFactory;
    this.clock = clock;
  }

  public createBasicResponseDto(menuItem: MenuItem): MenuItemBasicResponseDto {
    return {
      id: menuItem.id,
      name: menuItem.name,
      unit: menuItem.unit,
      defaultAmountBeforeVatPerUnit: menuItem.defaultAmountBeforeVatPerUnit,
      defaultVatPercentagePerUnit: menuItem.defaultVatPercentagePerUnit
    };
  }
  
  public createDetailResponseDto(menuItem: MenuItemDetailResponseDtoFactoryArgs): MenuItemDetailResponseDto {
    return {
      ...this.createBasicResponseDto(menuItem),
      createdDateTime: this.clock.convertJSDateToDateTimeISOString(menuItem.createdDateTime),
      lastUpdatedDateTime: menuItem.lastUpdatedDateTime &&
        this.clock.convertJSDateToDateTimeISOString(menuItem.lastUpdatedDateTime),
      category: menuItem.category && createMenuCategoryBasicResponseDto(menuItem.category),
      createdUser: this.userDtoFactory.createBasicResponseDto(menuItem.createdUser),
      lastUpdatedUser: menuItem.lastUpdatedUser && this.userDtoFactory.createBasicResponseDto(menuItem.lastUpdatedUser),
    };
  }
}
