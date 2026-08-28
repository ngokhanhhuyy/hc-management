import { createMiddleware } from "hono/factory";
import {
  getOrCreateDefaultControllerActionMetadata,
  type ControllerAction,
  type ControllerActionDecorator
} from "./appBuilder";
import type { BaseController } from "./baseController";
import { ValidationError, type ErrorDetails } from "@hc-management/shared/errors";
import * as v from "valibot";

export function fromBody<
    TIndex extends number,
    TSchema extends v.GenericSchema,
    TArgs extends any[] & { [K in TIndex]: v.InferOutput<TSchema> }>
  (index: TIndex, schema: TSchema): ControllerActionDecorator<BaseController, TArgs, any>
{
  return function(
    _: ControllerAction<BaseController, TArgs, any>,
    context: ClassMethodDecoratorContext<BaseController>): void
  {
    const actionMetadata = getOrCreateDefaultControllerActionMetadata(context);
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

    actionMetadata.middlewares.push(middleware);
  };
}

export function fromQuery<
    TIndex extends number,
    TSchema extends v.GenericSchema,
    TArgs extends any[] & { [K in TIndex]: v.InferOutput<TSchema> }>
  (index: TIndex, schema: TSchema): ControllerActionDecorator<BaseController, TArgs, any>
{
  return function(
    _: ControllerAction<BaseController, TArgs, any>,
    context: ClassMethodDecoratorContext<BaseController>): void
  {
    const actionMetadata = getOrCreateDefaultControllerActionMetadata(context);
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

    actionMetadata.middlewares.push(middleware);
  };
}

export function fromRoute<
    TIndex extends number,
    TArgs extends any[] & { [K in TIndex]: string }>(
  index: TIndex,
  paramName: string): ControllerActionDecorator<BaseController, TArgs, any>;
export function fromRoute<
    TIndex extends number,
    TArgs extends any[] & { [K in TIndex]: number }>(
  index: TIndex,
  paramName: string,
  argType: "number"): ControllerActionDecorator<BaseController, TArgs, any>;
export function fromRoute<
    TIndex extends number,
    TArgs extends any[] & { [K in TIndex]: boolean }>(
  index: TIndex,
  paramName: string,
  argType: "boolean"): ControllerActionDecorator<BaseController, TArgs, any>;
export function fromRoute<
    TIndex extends number,
    TArgs extends any[] & { [K in TIndex]: number | boolean }>(
  index: TIndex,
  paramName: string,
  argType?: "number" | "boolean"): ControllerActionDecorator<BaseController, TArgs, any>
{
  return function(
    _: ControllerAction<BaseController, TArgs, any>,
    decoratorContext: ClassMethodDecoratorContext<BaseController>): void
  {
    const actionMetadata = getOrCreateDefaultControllerActionMetadata(decoratorContext);
    const transfomers = {
      "number": v.toNumber<string>(),
      "boolean": v.toBoolean<string>()
    };

    const schema = argType ? v.pipe(v.string(), transfomers[argType]) : v.string();

    const middleware = createMiddleware(async (context, next) => {
      const paramsData = context.req.param(paramName);
      if (paramsData === undefined) {
        const actionName = decoratorContext.name as string;
        throw new Error(`Route param with name "${paramName}" in action "${actionName}" doesn't exist.`);
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

    actionMetadata.middlewares.push(middleware);
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
