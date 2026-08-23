import type { BaseController } from "./baseController";
import { controllerRoutes } from "./appBuilder";

export function passArgs(target: BaseController, propertyKey: string): void {
  const controllerRoute = controllerRoutes.find(cr => {
    return cr.controllerConstructor === target.constructor && cr.actionName === propertyKey;
  });

  if (!controllerRoute) {
    return;
  }

  controllerRoute.useControllerActionArgsPasser = true;
}
