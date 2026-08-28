import { serveStatic } from "hono/bun";
import { dependencyInjectionMiddleware, errorFilterMiddleware, requestLogglerMiddleware } from "./middlewares";
import { buildApp } from "./framework/mvc";
import "dotenv";

const app = buildApp(app => app
  .use(dependencyInjectionMiddleware)
  .use(requestLogglerMiddleware)
  .use("/static/*", serveStatic({ root: "./" }))
  .onError(errorFilterMiddleware))
  .all("/health-check", (context) => context.body(null, 200));

export default {
  fetch: app.fetch,
  port: process.env.PORT ?? 5000
};

export type AppType = typeof app;
