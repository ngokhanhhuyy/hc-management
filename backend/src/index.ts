import { Hono } from "hono";
import { dependencyInjectionMiddleware, errorFilterMiddleware, authenticationMiddleware } from "./middlewares";
import { authenticationApi, userApi } from "./controllers";

const app = new Hono()
  .use(dependencyInjectionMiddleware)
  .use(authenticationMiddleware)
  .onError(errorFilterMiddleware)
  .route("/api/authentication", authenticationApi)
  .route("/api/users", userApi)
  .get("/", (context) => {
    return context.text("Hello Hono!");
  })
  .all("/health-check", (context) => context.body(null, 200));

export default {
  port: 5000,
  fetch: app.fetch
};

export type AppType = typeof app;
