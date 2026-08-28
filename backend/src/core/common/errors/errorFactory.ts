import { NotFoundError, OperationError } from "@hc-management/shared/errors";
import { getDisplayNameByKey, type displayNames } from "@hc-management/shared/localization";

export interface IErrorFactory {
  createNotFoundError(): NotFoundError;
  createOperationErrorIndicatingNotFoundCase(resourceName: keyof typeof displayNames): OperationError;
  createOperationErrorIndicatingDuplicatedCase(
    propertyPath: string,
    propertyName: keyof typeof displayNames): OperationError;
}

export class ErrorFactory implements IErrorFactory {
  public createNotFoundError(): NotFoundError {
    return new NotFoundError();
  }
  
  public createOperationErrorIndicatingNotFoundCase(resourceName: keyof typeof displayNames): OperationError {
    const message = `Không tìm thấy ${getDisplayNameByKey(resourceName)}`;
    return new OperationError([{ propertyPath: "", message }]);
  }

  public createOperationErrorIndicatingDuplicatedCase(
    propertyPath: string,
    propertyName: keyof typeof displayNames): OperationError
  {
    const message = `${getDisplayNameByKey(propertyName)} đã tồn tại.`;
    return new OperationError([{ propertyPath, message }]);
  }
}
