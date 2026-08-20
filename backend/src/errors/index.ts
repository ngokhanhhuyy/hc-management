import { OperationError } from "@hc-management/shared/errors";
import { getDisplayNameByKey } from "@hc-management/shared/localization";

export const errorFactory = {
  operationError: {
    createNotFound(resourceName: string): OperationError {
      const message = `Không tìm thấy ${getDisplayNameByKey(resourceName)}`;
      return new OperationError([{ propertyPath: "", message }]);
    }
  }
};
