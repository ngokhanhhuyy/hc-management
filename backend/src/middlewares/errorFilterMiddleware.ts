import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ProblemDetails } from "@hc-management/shared/dtos";
import {
  ValidationError,
  OperationError,
  NotFoundError,
  ConcurrencyError,
  AuthenticationError,
  AuthorizationError
} from "@hc-management/shared/errors";

export const errorFilterMiddleware = async (error: Error, context: Context) => {
  const url = new URL(context.req.url);
  const baseResponseDto: ProblemDetails = {
    type: `${url.hostname}/problems`,
    title: "",
    status: 0,
    detail: { },
    instance: context.req.url
  };

  if (error instanceof ValidationError) {
    return context.json({
      ...baseResponseDto,
      type: baseResponseDto.type + "/validation-error",
      title: "Bad request",
      status: 400,
      detail: error.details,
    }, 400);
  }

  if (error instanceof OperationError) {
    return context.json({
      ...baseResponseDto,
      type: baseResponseDto.type + "/operation-error",
      title: "Unprocessable entity",
      status: 422,
      detail: error.details,
    }, 422);
  }

  if (error instanceof NotFoundError) {
    return context.json({
      ...baseResponseDto,
      type: baseResponseDto.type + "/not-found-error",
      title: "Not found",
      status: 404,
      detail: error.details,
    }, 404);
  }

  if (error instanceof ConcurrencyError) {
    return context.json({
      ...baseResponseDto,
      type: baseResponseDto.type + "/concurrency-error",
      title: "Conflict",
      status: 409,
      detail: error.details,
    }, 409);
  }

  if (error instanceof AuthorizationError) {
    return context.json({
      ...baseResponseDto,
      type: baseResponseDto.type + "/authorization-error",
      title: "Forbidden",
      status: 403,
      detail: error.details,
    }, 403);
  }

  if (error instanceof AuthenticationError) {
    return context.json({
      ...baseResponseDto,
      type: baseResponseDto.type + "/authentication-error",
      title: "Unauthorized",
      status: 401,
      detail: error.details,
    }, 401);
  }

  throw error;
};
