import { createMiddleware } from "hono/factory";
import { createScopedServiceProvider } from "#/dependencyInjection";

export const dependencyInjectionMiddleware = createMiddleware(async (context, next) => {
  const scopedServiceProvider = createScopedServiceProvider(context);
  context.set("provider", scopedServiceProvider);

  await next();
});
