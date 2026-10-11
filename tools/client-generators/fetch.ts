export async function fetchOrThrowAsync(url: string, options?: RequestInit, query?: object): Promise<Response> {
  let builtUrl = url;
  if (query) {
    const urlSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const [index, item] of value.entries()) {
          urlSearchParams.append(`${key}[${index}]`, item.toString());
        }

        continue;
      }

      urlSearchParams.append(key, value.toString());
    }

    builtUrl = builtUrl + "?" + urlSearchParams.toString();
  }

  const response = await globalThis.fetch(builtUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials:"include",
    ...options,
  });

  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw await convertToErrorAsync(response);
};

async function convertToErrorAsync(response: Response): Promise<Error> {
  type ProblemDetails = { errors: ErrorDetails };
  const getDetails = async () => {
    const problemDetails = await response.json() as ProblemDetails;
    return problemDetails.errors;
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
