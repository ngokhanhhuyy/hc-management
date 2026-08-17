import type { IAppContainer } from "../dependencyInjection";

declare module "hono" {
  interface ContextVariableMap {
    container: IAppContainer;
  }
}
