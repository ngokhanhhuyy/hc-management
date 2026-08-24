import { createMiddleware } from "hono/factory";
import { registerRoute, type ControllerConstructor } from "./appBuilder";
import { BaseController } from "./baseController";
import { ValidationError, type ErrorDetails } from "@hc-management/shared/errors";
import * as v from "valibot";

type ValidationDecoratorReturnType = ((target: BaseController, propertyKey: string) => void);

export function fromBody<TSchema extends v.ObjectSchema<any, any>>(
  index: number,
  schema: TSchema): ValidationDecoratorReturnType
{
  return function(target: BaseController, propertyKey: string): void {
    const controllerRoute = registerRoute({
      controllerConstructor: target.constructor as ControllerConstructor,
      actionName: propertyKey,
    });

    const middleware = createMiddleware(async (context, next) => {
      const json = await context.req.json();
      const output = validate(schema, json);
      let routeActionArgs = context.get("routeActionArgs");
      if (!routeActionArgs) {
        routeActionArgs = Array.from({ length: index + 1 });
        context.set("routeActionArgs", routeActionArgs);
      }

      routeActionArgs[index] = output;
      await next();
    });

    controllerRoute.middlewares.push(middleware);
  };
}

type TransformersFactory<TTransfomer extends v.GenericPipeAction> = (valibot: typeof v) => TTransfomer;
export function fromRoute<TTransfomer extends v.GenericPipeAction>(
  index: number,
  paramName: string,
  transfomerFactory?: TransformersFactory<TTransfomer>): ValidationDecoratorReturnType
{
  return function(target: BaseController, propertyKey: string): void {
    const controllerRoute = registerRoute({
      controllerConstructor: target.constructor as ControllerConstructor,
      actionName: propertyKey,
    });

    const transformer = transfomerFactory?.(v);
    const schema = transformer ? v.pipe(v.string(), transformer) : v.string();

    const middleware = createMiddleware(async (context, next) => {
      const paramsData = context.req.param(paramName);
      if (paramsData === undefined) {
        throw new Error(`Route param with name "${paramName}" in action "${propertyKey}" doesn't exist.`);
      }

      const output = validate(schema, paramsData);
      
      let routeActionArgs = context.get("routeActionArgs");
      if (!routeActionArgs) {
        routeActionArgs = Array.from({ length: index + 1 });
        context.set("routeActionArgs", routeActionArgs);
      }

      routeActionArgs[index] = output;
      await next();
    });

    controllerRoute.middlewares.push(middleware);
  };
}

export function fromQuery<TSchema extends v.ObjectSchema<any, any>>(
  index: number,
  schema: TSchema): ValidationDecoratorReturnType
{
  return function(target: BaseController, propertyKey: string): void {
    const controllerRoute = registerRoute({
      controllerConstructor: target.constructor as ControllerConstructor,
      actionName: propertyKey,
    });

    const middleware = createMiddleware(async (context, next) => {
      const queries = context.req.queries();
      const output = validate(schema, queries);
      let routeActionArgs = context.get("routeActionArgs");
      if (!routeActionArgs) {
        routeActionArgs = Array.from({ length: index + 1 });
        context.set("routeActionArgs", routeActionArgs);
      }

      routeActionArgs[index] = output;
      await next();
    });

    controllerRoute.middlewares.push(middleware);
  };
}

function validate<TSchema extends v.GenericSchema>(schema: TSchema, data: any): v.InferOutput<TSchema> {
  const result = v.safeParse(schema, data);
  if (!result.success) {
    const errorDetails: ErrorDetails = { };
    for (const issue of result.issues) {
      let propertyPath: string = "";
      if (issue.path) {
        const pathElements = issue.path.map(path => path.key) as (number | string)[];
        for (const [index, pathElement] of pathElements.entries()) {
          if (typeof pathElement === "number") {
            propertyPath += `[${pathElement}]`;
            continue;
          }

          if (index > 0) {
            propertyPath += ".";
          }

          propertyPath += pathElement.toString();
        }
      }

      errorDetails[propertyPath] = issue.message;
    }

    throw new ValidationError(errorDetails);
  }

  return result.output;
}
