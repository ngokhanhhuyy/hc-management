import { createMiddleware } from "hono/factory";
import { createScopedServiceProvider } from "#/framework/dependencyInjection";

export const dependencyInjectionMiddleware = createMiddleware(async (context, next) => {
  const scopedServiceProvider = createScopedServiceProvider(context);
  context.set("provider", scopedServiceProvider);

  await next();
});
