import type { StatusCode } from "hono/utils/http-status";
import type { ControllerAction, ControllerActionDecorator } from "./appBuilder";
import type { BaseController } from "./baseController";
import type { JsonValue } from "@hc-management/shared/api";

export function producesResponseType<
    TResponseDto extends JsonValue | void,
    TController extends BaseController = BaseController,
    TArgs extends any[] = any[]>
  (statusCode: StatusCode): ControllerActionDecorator<TController, TArgs, TResponseDto>
{
  return function(
    _: ControllerAction<TController, TArgs, TResponseDto>,
    __: ClassMethodDecoratorContext<TController>): void
  {
  };
}
