import { Hono, type Context, type MiddlewareHandler } from "hono";
import type { BaseController } from "./baseController";

export type ControllerConstructor = new (context: Context) => BaseController;
export type ControllerAction = (...args: any[]) => Promise<any>;

export type HttpMethod = "get" | "query" | "post" | "put" | "delete" | "option";
type ControllerPath = {
  controllerConstructor: ControllerConstructor;
  path: string;
  middlewares: MiddlewareHandler[];
};

type ControllerRoute = {
  readonly controllerConstructor: ControllerConstructor;
  path: string;
  method: HttpMethod;
  readonly actionName: string;
  readonly middlewares: MiddlewareHandler[];
  useControllerActionArgsPasser: boolean;
};

export const controllerPaths: ControllerPath[] = [];
export const controllerRoutes: ControllerRoute[] = [];

export function buildApp(builderOptions?: (app: Hono) => void): Hono {
  const rootApp = new Hono();
  builderOptions?.(rootApp);

  for (const { controllerConstructor, path: controllerPath, middlewares: controllerMiddlewares } of controllerPaths) {
    const controllerApp = new Hono();
    for (const controllerMiddleware of controllerMiddlewares) {
      controllerApp.use(controllerMiddleware);
    }

    const mappers = {
      "get": controllerApp.get,
      "query": controllerApp.query,
      "post": controllerApp.post,
      "put": controllerApp.put,
      "delete": controllerApp.delete,
      "option": controllerApp.options,
    } as const;

    for (const route of controllerRoutes.filter(cr => cr.controllerConstructor === controllerConstructor)) {
      if (route.middlewares.length) {
        for (const middleware of route.middlewares) {
          controllerApp.use(route.path, middleware);
        }
      }

      const mapper = mappers[route.method].bind(controllerApp);
      const handler = async (context: Context): Promise<Response> => {
        const controller = new route.controllerConstructor(context);
        const action: ControllerAction = controller[route.actionName as keyof typeof controller];
        const controllerAction = action.bind(controller);

        const response = await controllerAction(...context.get("routeActionArgs") ?? []);
        if (response === undefined) {
          return context.body(null);
        }

        return context.json(response);
      } ;

      mapper(route.path, handler);
    }

    rootApp.route(controllerPath, controllerApp);
  }

  return rootApp;
}

type RouteRegistrationData = PartialExcept<ControllerRoute, "controllerConstructor" | "actionName">;
export function registerRoute(route: RouteRegistrationData): ControllerRoute {
  let controllerRoute = controllerRoutes
    .find(cr => cr.controllerConstructor === route.controllerConstructor && cr.actionName === route.actionName);

  if (!controllerRoute) {
    controllerRoute = {
      controllerConstructor: route.controllerConstructor,
      path: "/",
      method: "get",
      actionName: route.actionName,
      middlewares: [],
      useControllerActionArgsPasser: false
    };

    controllerRoutes.push(controllerRoute);
  };

  if (route.path) {
    controllerRoute.path = route.path;
  }

  if (route.method) {
    controllerRoute.method = route.method;
  }

  if (route.middlewares?.length) {
    controllerRoute.middlewares.push(...route.middlewares);
  }

  return controllerRoute;
}

export function registerController(controllerConstructor: ControllerConstructor): ControllerPath {
  let controllerPath = controllerPaths.find(cp => cp.controllerConstructor === controllerConstructor);
  if (!controllerPath) {
    controllerPath = {
      controllerConstructor,
      path: "/",
      middlewares: []
    };

    controllerPaths.push(controllerPath);
  }

  return controllerPath;
}
