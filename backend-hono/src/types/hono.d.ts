import type { IScopedServiceProvider } from "#/framework/dependencyInjection";
import type { ApiActionArgs } from "@hc-management/shared/api";

declare module "hono" {
  interface ContextVariableMap {
    provider: IScopedServiceProvider;
    validatedData: ApiActionArgs | undefined;
    routeActionArgs: any[] | undefined;
  }
}
