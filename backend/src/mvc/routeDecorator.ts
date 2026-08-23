import type { BaseController } from "./baseController";
import {
  registerRoute,
  registerController,
  type ControllerConstructor,
  type HttpMethod } from "./appBuilder";

export function route(path: string): (target: ControllerConstructor) => void {
  return function(target: ControllerConstructor): void {
    const controllerPath = registerController(target);
    controllerPath.controllerConstructor = target;
    controllerPath.path = path;
  };
}

function addControllerRoute(
  controllerConstructor: ControllerConstructor,
  propertyKey: string,
  path: string,
  method: HttpMethod): void
{
  registerRoute({
    controllerConstructor,
    path,
    method,
    actionName: propertyKey,
  });
}

export function httpGet(path: string): (target: BaseController, propertyKey: string) => void {
  return function(target: BaseController, propertyKey: string): void {
    addControllerRoute(target.constructor as ControllerConstructor, propertyKey, path, "get");
  };
}

export function httpQuery(path: string): (target: BaseController, propertyKey: string) => void {
  return function(target: BaseController, propertyKey: string): void {
    addControllerRoute(target.constructor as ControllerConstructor, propertyKey, path, "query");
  };
}

export function httpPost(path: string): (target: BaseController, propertyKey: string) => void {
  return function(target: BaseController, propertyKey: string): void {
    addControllerRoute(target.constructor as ControllerConstructor, propertyKey, path, "post");
  };
}

export function httpPut(path: string): (target: BaseController, propertyKey: string) => void {
  return function(target: BaseController, propertyKey: string): void {
    addControllerRoute(target.constructor as ControllerConstructor, propertyKey, path, "put");
  };
}

export function httpDelete(path: string): (target: BaseController, propertyKey: string) => void {
  return function(target: BaseController, propertyKey: string): void {
    addControllerRoute(target.constructor as ControllerConstructor, propertyKey, path, "delete");
  };
}

export function httpOption(path: string): (target: BaseController, propertyKey: string) => void {
  return function(target: BaseController, propertyKey: string): void {
    addControllerRoute(target.constructor as ControllerConstructor, propertyKey, path, "option");
  };
}
