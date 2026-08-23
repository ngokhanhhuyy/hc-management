import type { StatusCode } from "hono/utils/http-status";
import type { GenericSchema } from "valibot";
import { BaseController } from "./baseController";

export function producesResponseType<TResponseDto = undefined>(
  statusCode: StatusCode): (target: BaseController, propertyKey: string) => void
{
  return function(_: BaseController, __: string): void { };
}
