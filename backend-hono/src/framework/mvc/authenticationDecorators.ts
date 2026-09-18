import {
  getOrCreateDefaultControllerMetadata,
  getOrCreateDefaultControllerActionMetadata,
  type ControllerConstructor,
  type ControllerAction,
} from "./appBuilder";
import { authenticationMiddleware } from "#/middlewares";
import type { BaseController } from "./baseController";

export function authorize<TController extends BaseController>(
  _: ControllerAction<TController, any[], any> | ControllerConstructor,
  context: ClassDecoratorContext<ControllerConstructor> | ClassMethodDecoratorContext<TController>): void
{
  if (context.kind === "class") {
    const controllerMetadata = getOrCreateDefaultControllerMetadata(context);
    controllerMetadata.middlewares.unshift(authenticationMiddleware);
    return;
  }

  const actionMetadata = getOrCreateDefaultControllerActionMetadata(context);
  actionMetadata.middlewares.unshift(authenticationMiddleware);
};
