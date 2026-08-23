import { OperationError } from "@hc-management/shared/errors";
import { getDisplayNameByKey, type displayNames } from "@hc-management/shared/localization";

export const errorFactories = {
  operationError: {
    createNotFound(resourceName: keyof typeof displayNames): OperationError {
      const message = `Không tìm thấy ${getDisplayNameByKey(resourceName)}`;
      return new OperationError([{ propertyPath: "", message }]);
    },
    createDuplicated(propertyPath: string, propertyName: keyof typeof displayNames): OperationError {
      const message = `${getDisplayNameByKey(propertyName)} đã tồn tại.`;
      return new OperationError([{ propertyPath, message }]);
    }
  }
};
