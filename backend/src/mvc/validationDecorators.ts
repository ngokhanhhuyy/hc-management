import { createMiddleware } from "hono/factory";
import { controllerRoutes, registerRoute, type ControllerConstructor, type ControllerAction } from "./appBuilder";
import { ValidationError, type ErrorDetails } from "@hc-management/shared/errors";
import * as v from "valibot";
import { BaseController } from "./baseController";

export function fromJson<TSchema extends v.GenericSchema>(schema: TSchema): ((target: BaseController, propertyKey: string) => void) {
  return function(target: BaseController, propertyKey: string): void {
    const controllerRoute = registerRoute({
      controllerConstructor: target.constructor as ControllerConstructor,
      actionName: propertyKey,
    });

    const middleware = createMiddleware(async (context, next) => {
      const json = await context.req.json();
      const output = validate(schema, json);
      let validatedData = context.get("validatedData");
      if (!validatedData) {
        validatedData = { };
        context.set("validatedData", validatedData);
      }

      validatedData.json = output;

      await next();
    });

    controllerRoute.middlewares.push(middleware);
  };
}

type TransformersFactory<TTransfomer extends v.GenericPipeAction> = (valibot: typeof v) => TTransfomer;
export function fromParam<TTransfomer extends v.GenericPipeAction>(
  paramName: string,
  transfomerFactory?: TransformersFactory<TTransfomer>)
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
        throw new Error(`Param with name "${paramName}" in action "${propertyKey}" doesn't exist.`);
      }

      const output = validate(schema, paramsData);

      let validatedData = context.get("validatedData");
      if (!validatedData) {
        validatedData = { };
        context.set("validatedData", validatedData);
      }

      if (!validatedData.params) {
        validatedData.params = { [paramName]: output };
      }
      
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
      console.log(propertyPath);
    }

    throw new ValidationError(errorDetails);
  }

  return result.output;
}
