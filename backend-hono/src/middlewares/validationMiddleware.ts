import { createMiddleware } from "hono/factory";
import { sValidator } from "@hono/standard-validator";
import { ValidationError, type ErrorDetails } from "@hc-management/shared/errors";
import * as v from "valibot";

type ValidatorDataSource = "json" | "param";

export const validator = <TSchema extends v.GenericSchema>(dataSource: ValidatorDataSource, schema: TSchema) => {
  return createMiddleware(async (context, next) => {
    const data = dataSource === "json" ? (await context.req.json()) : context.req.param();
    const result = v.safeParse(schema, data);
    if (!result.success) {
      const errorDetails: ErrorDetails = { };
      for (const issue of result.issues) {
        let propertyPath: string = "";
        if (issue.path) {
          for (const [index, pathElement] of (issue.path ?? []).entries()) {
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

    context.set("validated", result.output);
    await next();
  });
};
