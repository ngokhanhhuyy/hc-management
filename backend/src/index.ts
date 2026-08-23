import { Hono } from "hono";
import {
  dependencyInjectionMiddleware,
  errorFilterMiddleware,
  requestLogglerMiddleware
} from "./middlewares";
import { buildApp } from "./mvc";

const app = buildApp(app => app
  .use(dependencyInjectionMiddleware)
  .use(requestLogglerMiddleware)
  .onError(errorFilterMiddleware))
  .get("/", (context) => {
    return context.text("Hello Hono!");
  })
  .all("/health-check", (context) => context.body(null, 200));

export default {
  port: 5000,
  fetch: app.fetch,
};

export type AppType = typeof app;
