import { Hono, type Context, type MiddlewareHandler } from "hono";
import type { BaseController } from "./baseController";

export type ControllerConstructor = new (context: Context) => BaseController;
export type ControllerAction<TController extends BaseController, TArgs extends any[], TResponseDto> =
  (this: TController, ...args: TArgs) => Promise<TResponseDto>;

export type HttpMethod = "get" | "query" | "post" | "put" | "delete" | "option";
export type ControllerMetadata = {
  path: string;
  middlewares: MiddlewareHandler[];
  actions: { [key: string]: ControllerActionMetadata };
};

export type ControllerActionMetadata = {
  path: string;
  method: HttpMethod;
  readonly middlewares: MiddlewareHandler[];
};

export type ControllerActionDecorator<TController extends BaseController, TArgs extends any[], TResponseDto> =
  ((_: ControllerAction<TController, TArgs, TResponseDto>, context: ClassMethodDecoratorContext<TController>) => void);

export const controllerMetadataMap = new Map<ControllerConstructor, ControllerMetadata>();

export function buildApp(builderOptions?: (app: Hono) => void): Hono {
  const rootApp = new Hono();
  builderOptions?.(rootApp);

  for (const [controllerConstructor, controllerMetadata] of controllerMetadataMap) {
    const controllerApp = new Hono();
    for (const controllerMiddleware of controllerMetadata.middlewares) {
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

    for (const [actionName, actionMetadata] of Object.entries(controllerMetadata.actions)) {
      if (actionMetadata.middlewares.length) {
        for (const middleware of actionMetadata.middlewares) {
          controllerApp.use(actionMetadata.path, middleware);
        }
      }

      const mapper = mappers[actionMetadata.method].bind(controllerApp);
      const handler = async (context: Context): Promise<Response> => {
        const controller = new controllerConstructor(context);
        type GenericControllerAction = ControllerAction<BaseController, any[], any>;
        const action: GenericControllerAction = controller[actionName as keyof typeof controller];
        const controllerAction = action.bind(controller);

        const response = await controllerAction(...context.get("routeActionArgs") ?? []);
        if (response === undefined) {
          return context.body(null);
        }

        return context.json(response);
      } ;

      mapper(actionMetadata.path, handler);
    }

    rootApp.route(controllerMetadata.path, controllerApp);
  }

  return rootApp;
}

export function getOrCreateDefaultControllerActionMetadata<TController extends BaseController>(
  context: ClassMethodDecoratorContext<TController>): ControllerActionMetadata
{
  const controllerMetadata = getOrCreateDefaultControllerMetadata(context);

  let actionMetadata = controllerMetadata.actions[context.name as string];
  if (!actionMetadata) {
    actionMetadata = {
      path: "/",
      method: "get",
      middlewares: []
    };
    
    controllerMetadata.actions[context.name as string] = actionMetadata;
  }

  return actionMetadata;
}

export function getOrCreateDefaultControllerMetadata<TController extends BaseController>(
  context: ClassDecoratorContext<ControllerConstructor> | ClassMethodDecoratorContext<TController>): ControllerMetadata
{
  let controllerMetadata = context.metadata["controllerMetadata"] as ControllerMetadata | undefined;
  if (!controllerMetadata) {
    controllerMetadata = {
      path: "/",
      middlewares: [],
      actions: { }
    };

    context.metadata["controllerMetadata"] = controllerMetadata;
  }

  return controllerMetadata;
}

(Symbol as { metadata?: symbol }).metadata ??= Symbol("Symbol.metadata");
