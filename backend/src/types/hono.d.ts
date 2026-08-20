import type { IScopedServiceProvider } from "../dependencyInjection";

declare module "hono" {
  interface ContextVariableMap {
    provider: IScopedServiceProvider;
  }
}
