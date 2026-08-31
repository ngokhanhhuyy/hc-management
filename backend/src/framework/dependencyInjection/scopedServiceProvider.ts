import { asClass, asValue, type AwilixContainer } from "awilix";
import type { Context } from "hono";
import { rootServiceContainer, type ISingletonContainer as ISingletonServiceContainer } from "./container";
import {
  CallerDetailProvider,
  type ICallerDetailProvider } from "#/core/common/authentication/callerDetailProvider";
import { AuthenticationService, type IAuthenticationService } from "#/core/services/authenticationService";
import { MenuCategoryService, type IMenuCategoryService } from "#/core/services/menuCategoryService";
import { MenuItemService, type IMenuItemService } from "#/core/services/menuItemService";
import { SeatingService, type ISeatingService } from "#/core/services/seatingService";
import { UserService, type IUserService } from "#/core/services/userService";

export interface IScopedServiceContainer {
  httpContext: Context;
  serviceProvider: IScopedServiceProvider;
  callerDetailProvider: ICallerDetailProvider;
  authenticationService: IAuthenticationService;
  menuCategoryService: IMenuCategoryService;
  menuItemService: IMenuItemService;
  seatingService: ISeatingService;
  userService: IUserService;
}

export interface IServiceContainer extends IScopedServiceContainer, ISingletonServiceContainer { };

export interface IScopedServiceProvider {
  getRequiredService<TKey extends keyof IServiceContainer>(key: TKey): IServiceContainer[TKey];
}

export class ScopedServiceProvider implements IScopedServiceProvider {
  private readonly scope: AwilixContainer<IScopedServiceContainer>;

  public constructor(scope: AwilixContainer<IScopedServiceContainer>) {
    this.scope = scope;
  }

  public getRequiredService<TKey extends keyof IServiceContainer>(key: TKey): IServiceContainer[TKey] {
    return this.scope.resolve(key);
  }
}

export function createScopedServiceProvider(context: Context): IScopedServiceProvider {
  const scopedServiceContainer = rootServiceContainer.createScope<IScopedServiceContainer>();
  const serviceProvider = new ScopedServiceProvider(scopedServiceContainer);
  scopedServiceContainer.register({
    httpContext: asValue(context),
    serviceProvider: asValue(serviceProvider),
    callerDetailProvider: asClass(CallerDetailProvider).scoped(),
    authenticationService: asClass(AuthenticationService).scoped(),
    menuCategoryService: asClass(MenuCategoryService).scoped(),
    menuItemService: asClass(MenuItemService).scoped(),
    seatingService: asClass(SeatingService).scoped(),
    userService: asClass(UserService).scoped()
  } satisfies DependecyRegistrations<IScopedServiceContainer>);

  return serviceProvider;
}
