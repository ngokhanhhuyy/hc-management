import { asClass, asFunction, asValue, type AwilixContainer } from "awilix";
import type { Context } from "hono";
import { rootServiceContainer, type ISingletonContainer as ISingletonServiceContainer } from "./container";
import { AuthenticationController, UserController } from "#/controllers";
import {
  CallerDetailProvider,
  type ICallerDetailProvider } from "#/services/common/authentication/callerDetailProvider";
import { AuthenticationService, type IAuthenticationService } from "#/services/authenticationService";
import { UserService, type IUserService } from "#/services/userService";

export interface IScopedServiceContainer {
  httpContext: Context;
  serviceProvider: IScopedServiceProvider;
  callerDetailProvider: ICallerDetailProvider;
  authenticationController: AuthenticationController;
  userController: UserController;
  authenticationService: IAuthenticationService;
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
    authenticationController: asClass(AuthenticationController),
    userController: asClass(UserController),
    authenticationService: asClass(AuthenticationService),
    userService: asClass(UserService)
  } satisfies DependecyRegistrations<IScopedServiceContainer>);

  return serviceProvider;
}
