import type { IScopedServiceProvider } from "../dependencyInjection";
import type { ApiActionArgs } from "@hc-management/shared/api";

declare module "hono" {
  interface ContextVariableMap {
    provider: IScopedServiceProvider;
    validatedData: ApiActionArgs | undefined;
  }
}
