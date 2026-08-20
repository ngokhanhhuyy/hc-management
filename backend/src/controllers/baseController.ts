import type { Context, TypedResponse } from "hono";
import { sValidator } from "@hono/standard-validator";
import type { StatusCode } from "hono/utils/http-status";
import type { IServiceContainer } from "#/dependencyInjection";
import type { ICallerDetailProvider } from "#/services/common/authentication/callerDetailProvider";
import type { GenericSchema } from "valibot";

export type EmptyResult<TStatusCode extends StatusCode = 200> = TypedResponse<null, TStatusCode, "body">;
export type JsonResult<TResponseDto, TStatusCode extends StatusCode = 200> =
  TypedResponse<TResponseDto, TStatusCode, "json">;

export abstract class BaseController {
  protected readonly httpContext: Context;
  protected readonly callerDetailProvider: ICallerDetailProvider;

  protected constructor(context: Context) {
    this.httpContext = context;
    this.callerDetailProvider = context.get("provider").getRequiredService("callerDetailProvider");
  }

  protected async isAuthenticated(): Promise<boolean> {
    try {
      this.callerDetailProvider.getCallerDetail();
      return true;
    } catch {
      return false;
    }
  }

  protected ok(): EmptyResult<200>;
  protected ok<TResponseDto>(responseDto: TResponseDto): JsonResult<TResponseDto, 200>;
  protected ok<TResponseDto>(responseDto?: TResponseDto):  EmptyResult<200> | JsonResult<TResponseDto, 200> {
    if (responseDto === undefined) {
      return this.httpContext.body(null, 200);
    }

    return this.httpContext.json(responseDto, 200) as JsonResult<TResponseDto, 200>;
  }

  protected createdAt(location: string): EmptyResult<201>;
  protected createdAt<TResponseDto>(location: string, responseDto: TResponseDto): JsonResult<TResponseDto, 201>;
  protected createdAt<TResponseDto>(
    location: string, responseDto?:
    TResponseDto): EmptyResult<201> | JsonResult<TResponseDto, 201>
  {
    this.httpContext.header("Location", location);
    if (responseDto === undefined) {
      return this.httpContext.body(null, 201);
    }
    
    return this.httpContext.json(responseDto, 201) as JsonResult<TResponseDto, 201>;
  }

  public static validateJson<TRequestDto, TSchema extends GenericSchema<TRequestDto>>(schema: TSchema) {
    return sValidator("json", schema);
  }

  public static validateQueryString<TRequestDto, TSchema extends GenericSchema<TRequestDto>>(schema: TSchema) {
    return sValidator("param", schema);
  }

  protected getRequiredService<TServiceKey extends keyof IServiceContainer>(
    key: TServiceKey): IServiceContainer[TServiceKey]
  {
    return this.httpContext.get("provider").getRequiredService(key);
  }
}
