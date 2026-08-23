import { controllerPaths, registerRoute, registerController, type ControllerConstructor } from "./appBuilder";
import { authenticationMiddleware } from "#/middlewares";
import { BaseController } from "./baseController";

export function authorized(target: BaseController | ControllerConstructor, propertyKey?: string): void {
  if (typeof target === "function") {
    const controllerPath = registerController(target);
    if (controllerPath) {
      controllerPath.middlewares.unshift(authenticationMiddleware);
    }

    return;
  }

  const controllerRoute = registerRoute({
    controllerConstructor: target.constructor as ControllerConstructor,
    actionName: propertyKey!,
  });

  controllerRoute.middlewares.unshift(authenticationMiddleware);
};
