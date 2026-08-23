import { asClass, asValue, type AwilixContainer } from "awilix";
import type { Context } from "hono";
import { rootServiceContainer, type ISingletonContainer as ISingletonServiceContainer } from "./container";
import {
  CallerDetailProvider,
  type ICallerDetailProvider } from "#/services/common/authentication/callerDetailProvider";
import { AuthenticationService, type IAuthenticationService } from "#/services/features/authenticationService.js";
import { MenuCategoryService, type IMenuCategoryService } from "#/services/features/menuCategoryService.js";
import { UserService, type IUserService } from "#/services/features/userService.js";

export interface IScopedServiceContainer {
  httpContext: Context;
  serviceProvider: IScopedServiceProvider;
  callerDetailProvider: ICallerDetailProvider;
  authenticationService: IAuthenticationService;
  menuCategoryService: IMenuCategoryService;
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
    callerDetailProvider: asClass(CallerDetailProvider),
    authenticationService: asClass(AuthenticationService),
    menuCategoryService: asClass(MenuCategoryService),
    userService: asClass(UserService)
  } satisfies DependecyRegistrations<IScopedServiceContainer>);

  return serviceProvider;
}
