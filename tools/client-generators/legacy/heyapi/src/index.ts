import { createClient } from "./client/client";
import { client } from "./client/client.gen";
import * as sdk from "./client/sdk.gen";
import type { ProblemDetails } from "./client/types.gen";
import "./fetch";

const api = {
  authentication: sdk.Authentication.
}

client.interceptors.response.use(async (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw await convertToErrorAsync(response);
});

const api = wrapSdk(sdk);
try {
  await sdk.({
    body: {
      userName: "ngokhanhhuyy",
      password: "huy123"
    }
  });
  
  const responseDto = await api.menuItemGetList({
    body: {

    }
  });
  console.dir(responseDto, { depth: null });
} catch (error) {
  console.error("Error occurred");
  console.dir(error, { depth: null });
}

type Sdk = typeof sdk;
type UnwrapResult<T> =
  T extends Promise<infer R>
    ? R extends { data: infer D }
      ? Promise<D>
      : T
    : T;

type WrappedSdk<T> = {
  [K in keyof T]:
    T[K] extends (...args: infer A) => infer R
      ? (...args: A) => UnwrapResult<R>
      : T[K];
};

function wrapSdk<T extends object>(sdk: T): WrappedSdk<T> {
  return new Proxy(sdk, {
    get(target, property, receiver) {
      const value = Reflect.get(
        target,
        property,
        receiver,
      );

      if (typeof value !== "function") {
        return value;
      }

      return async (...args: unknown[]) => {
        const result = await value.apply(
          target,
          args,
        );

        return result.data;
      };
    },
  }) as WrappedSdk<T>;
}

async function convertToErrorAsync(response: Response): Promise<Error> {
  const getDetails = async () => {
    const problemDetails = await response.json() as ProblemDetails;
    return problemDetails as unknown as ErrorDetails;
  };
  
  switch (response.status) {
    case 400: {
      return new ValidationError(await getDetails());
    }

    case 401:
      return new AuthenticationError();

    case 403:
      return new AuthorizationError();

    case 409:
      return new ConcurrencyError();

    case 422: {
      const problemDetails = await response.json() as ProblemDetails;
      return new OperationError(await getDetails());
    }

    default:
      throw new Error(`Undefined error occurred with payload.`);
  }
}


export type ErrorDetails = { [propertyPath: string]: string };
export type IndividualErrorDetail = { propertyPath: string; message: string; };

export abstract class ApplicationError<TErrorType extends string> extends Error {
  public readonly errorType: TErrorType;
  public details: ErrorDetails;

  protected constructor(errorType: TErrorType, args: ErrorDetails | IndividualErrorDetail[]) {
    super(`A ${errorType} has occurred.`);
    this.errorType = errorType;
    
    if (Array.isArray(args)) {
      this.details = { };
      for (const individualErrorDetail of args) {
        this.details[individualErrorDetail.propertyPath] = individualErrorDetail.message;
      }

      return;
    }
    
    this.details = args;
  }
}

export class ValidationError extends ApplicationError<"ValidationError"> {
  public constructor(args: ErrorDetails | IndividualErrorDetail[]) {
    super("ValidationError", args);
  }
}

export class OperationError extends ApplicationError<"OperationError"> {
  public constructor(args: ErrorDetails | IndividualErrorDetail[]) {
    super("OperationError", args);
  }
}

export class ConcurrencyError extends ApplicationError<"ConcurrencyError"> {
  public constructor() {
    super("ConcurrencyError", []);
  }
}

export class NotFoundError extends ApplicationError<"NotFoundError"> {
  public constructor() {
    super("NotFoundError", []);
  }
}

export class AuthenticationError extends ApplicationError<"AuthenticationError"> {
  public constructor() {
    super("AuthenticationError", []);
  }
}

export class AuthorizationError extends ApplicationError<"AuthorizationError"> {
  public constructor() {
    super("AuthorizationError", []);
  }
}
