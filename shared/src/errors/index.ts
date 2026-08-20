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
