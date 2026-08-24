import type { Context } from "hono";
import type { IScopedServiceProvider } from "#/dependencyInjection";
import type { ICallerDetailProvider } from "#/services/common/authentication/callerDetailProvider";
import type { JsonValue } from "@hc-management/shared/api";

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

  protected ok(): void;
  protected ok<TResponseDto extends JsonValue>(responseDto: TResponseDto): TResponseDto;
  protected ok<TResponseDto extends JsonValue>(responseDto?: TResponseDto): TResponseDto | void {
    this.httpContext.status(200);
    if (responseDto === undefined) {
      this.httpContext.res.headers.set("Content-Type", "application/json");
      return;
    }

    this.httpContext.res.headers.set("Content-Type", "application/text");
    return responseDto;
  }

  protected created(location: string): void;
  protected created<TResponseDto extends JsonValue>(location: string, responseDto: TResponseDto): TResponseDto;
  protected created<TResponseDto extends JsonValue>(location: string, responseDto?: TResponseDto): TResponseDto | void {
    this.httpContext.header("Location", location);
    this.httpContext.status(201);
    if (responseDto !== undefined) {
      this.httpContext.res.headers.set("Content-Type", "application/json");
      return;
    }

    this.httpContext.res.headers.set("Content-Type", "application/text");
    return responseDto;
  }
}
