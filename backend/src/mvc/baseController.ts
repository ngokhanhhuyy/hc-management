import type { Context } from "hono";
import type { IScopedServiceProvider } from "#/dependencyInjection";
import type { ICallerDetailProvider } from "#/services/common/authentication/callerDetailProvider";
import type { JsonResponse, EmptyResponse, JsonValue } from "@hc-management/shared/api";

export abstract class BaseController {
  protected readonly httpContext: Context;
  protected readonly callerDetailProvider: ICallerDetailProvider;
  protected readonly serviceProvider: IScopedServiceProvider;

  protected constructor(httpContext: Context) {
    this.httpContext = httpContext;
    this.serviceProvider = httpContext.get("provider");
    this.callerDetailProvider = this.serviceProvider.getRequiredService("callerDetailProvider");
  }

  protected async isAuthenticated(): Promise<boolean> {
    try {
      this.callerDetailProvider.getCallerDetail();
      return true;
    } catch {
      return false;
    }
  }

  protected ok(): EmptyResponse;
  protected ok<TResponseDto extends JsonValue>(responseDto: TResponseDto): JsonResponse<TResponseDto>;
  protected ok<TResponseDto extends JsonValue>(responseDto?: TResponseDto): Response {
    if (responseDto === undefined) {
      return this.httpContext.body(null, 200);
    }

    return this.httpContext.json(responseDto, 200);
  }

  protected created(location: string): EmptyResponse;
  protected created<TResponseDto extends JsonValue>(location: string, responseDto: TResponseDto): JsonResponse<TResponseDto>;
  protected created<TResponseDto extends JsonValue>(location: string, responseDto?: TResponseDto): Response {
    this.httpContext.header("Location", location);
    if (responseDto === undefined) {
      return this.httpContext.body(null, 201);
    }
    
    return this.httpContext.json(responseDto, 201);
  }

  protected getValidJson<TRequestDto>(): TRequestDto {
    const validatedData = this.httpContext.get("validatedData");
    if (!validatedData || validatedData.json == null) {
      throw new Error("Request JSON hasn't been validated.");
    }

    return validatedData.json as TRequestDto;
  }

  protected getValidParam<TParam>(paramName: string): TParam {
    const validatedData = this.httpContext.get("validatedData");
    if (!validatedData || validatedData.params?.[paramName] == null) {
      throw new Error("Request params hasn't been validated.");
    }

    return validatedData.params[paramName] as TParam;
  }

  protected getValidQuery<TRequestDto>(): TRequestDto {
    const validatedData = this.httpContext.get("validatedData");
    if (!validatedData || validatedData.query == null) {
      throw new Error("Request query hasn't been validated.");
    }

    return validatedData.query as TRequestDto;
  }
}
