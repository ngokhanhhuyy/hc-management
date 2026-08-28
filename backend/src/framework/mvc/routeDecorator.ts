import type { BaseController } from "./baseController";
import {
  controllerMetadataMap,
  getOrCreateDefaultControllerActionMetadata,
  getOrCreateDefaultControllerMetadata,
  type ControllerConstructor,
  type ControllerAction,
  type HttpMethod,
  type ControllerActionDecorator,
} from "./appBuilder";

export function controller(target: ControllerConstructor, context: ClassDecoratorContext<ControllerConstructor>): void {
  const controllerMetadata = getOrCreateDefaultControllerMetadata(context);
  controllerMetadataMap.set(target, controllerMetadata);
}

export function route(path: string): (target: ControllerConstructor, _: ClassDecoratorContext) => void {
  return function(_: ControllerConstructor, context: ClassDecoratorContext): void {
   const controllerMetadata = getOrCreateDefaultControllerMetadata(context);
    controllerMetadata.path = path;
  };
}

function setControllerActionRoutePathAndMethod<TController extends BaseController>(
  path: string,
  method: HttpMethod,
  context: ClassMethodDecoratorContext<TController>): void
{
  const actionMetadata = getOrCreateDefaultControllerActionMetadata(context);
  actionMetadata.path = path;
  actionMetadata.method = method;
}

export function httpGet<
    TController extends BaseController,
    TArgs extends any[],
    TResponseDto>
  (path: string): ControllerActionDecorator<TController, TArgs, TResponseDto>
{
  return function(
    _: ControllerAction<TController, TArgs, TResponseDto>,
    context: ClassMethodDecoratorContext<TController>): void
  {
    setControllerActionRoutePathAndMethod(path, "get", context);
  };
}

export function httpQuery<
    TController extends BaseController,
    TArgs extends any[],
    TResponseDto>
  (path: string): ControllerActionDecorator<TController, TArgs, TResponseDto>
{
  return function(
    _: ControllerAction<TController, TArgs, TResponseDto>,
    context: ClassMethodDecoratorContext<TController>): void
  {
    setControllerActionRoutePathAndMethod(path, "query", context);
  };
}

export function httpPost<
    TController extends BaseController,
    TArgs extends any[],
    TResponseDto>
  (path: string): ControllerActionDecorator<TController, TArgs, TResponseDto>
{
  return function(
    _: ControllerAction<TController, TArgs, TResponseDto>,
    context: ClassMethodDecoratorContext<TController>): void
  {
    setControllerActionRoutePathAndMethod(path, "post", context);
  };
}

export function httpPut<
    TController extends BaseController,
    TArgs extends any[],
    TResponseDto>
  (path: string): ControllerActionDecorator<TController, TArgs, TResponseDto>
{
  return function(
    _: ControllerAction<TController, TArgs, TResponseDto>,
    context: ClassMethodDecoratorContext<TController>): void
  {
    setControllerActionRoutePathAndMethod(path, "put", context);
  };
}

export function httpDelete<
    TController extends BaseController,
    TArgs extends any[],
    TResponseDto>
  (path: string): ControllerActionDecorator<TController, TArgs, TResponseDto>
{
  return function(
    _: ControllerAction<TController, TArgs, TResponseDto>,
    context: ClassMethodDecoratorContext<TController>): void
  {
    
    setControllerActionRoutePathAndMethod(path, "delete", context);
  };
}

export function httpOption<
    TController extends BaseController,
    TArgs extends any[],
    TResponseDto>
  (path: string): ControllerActionDecorator<TController, TArgs, TResponseDto>
{
  return function(
    _: ControllerAction<TController, TArgs, TResponseDto>,
    context: ClassMethodDecoratorContext<TController>): void
  {
    
    setControllerActionRoutePathAndMethod(path, "option", context);
  };
}
