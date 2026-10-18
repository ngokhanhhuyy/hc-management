import type { ValidationError, OperationError } from '#/api';

export type ErrorDetailModel = { propertyPath: string; message: string; };

export class ErrorCollectionModel {
  public isValidated: boolean = false;;
  public details: ErrorDetailModel[] = [];

  public mapFromApplicationError(error: ValidationError | OperationError): void {
    this.isValidated = true;
    this.details = Object
      .entries(error.details)
      .map(([key, value]) => ({ propertyPath: key, message: value }))
      .filter((detail) => detail.message);
  }

  public clear(): void {
    this.details = [];
  }
}
