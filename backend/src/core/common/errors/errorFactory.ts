import { ConcurrencyError, NotFoundError, OperationError } from "@hc-management/shared/errors";
import { getDisplayNameByKey, type displayNames } from "@hc-management/shared/localization";

export interface IErrorFactory {
  createConcurrencyError(): ConcurrencyError;
  createNotFoundError(): NotFoundError;
  createOperationError(propertyPath: string, errorMessage: string): OperationError;
  createOperationErrorIndicatingNotFoundCase(
    resourceName: keyof typeof displayNames,
    propertyPath?: string): OperationError;
  createOperationErrorIndicatingDuplicatedCase(
    propertyPath: string,
    propertyName: keyof typeof displayNames): OperationError;
}

export class ErrorFactory implements IErrorFactory {
  public createConcurrencyError(): ConcurrencyError {
    return new ConcurrencyError();
  }

  public createNotFoundError(): NotFoundError {
    return new NotFoundError();
  }

  public createOperationError(propertyPath: string, errorMessage: string): OperationError {
    return new OperationError({ propertyPath, errorMessage });
  }
  
  public createOperationErrorIndicatingNotFoundCase(
    resourceName: keyof typeof displayNames,
    propertyPath?: string): OperationError
  {
    const message = `Không tìm thấy ${getDisplayNameByKey(resourceName)}`;
    return new OperationError([{ propertyPath: propertyPath ?? "", message }]);
  }

  public createOperationErrorIndicatingDuplicatedCase(
    propertyPath: string,
    propertyName: keyof typeof displayNames): OperationError
  {
    const message = `${getDisplayNameByKey(propertyName)} đã tồn tại.`;
    return new OperationError([{ propertyPath, message }]);
  }
}
