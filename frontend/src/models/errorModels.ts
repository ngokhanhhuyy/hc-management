import type { ValidationError, OperationError } from "#/api";

export type ErrorDetailModel = { propertyPath: string; message: string; };
export type ErrorCollectionModel = {
  isValidated: boolean;
  details: ErrorDetailModel[];
  mapFromApplicationError(error: ValidationError | OperationError): ErrorCollectionModel;
  clear(): ErrorCollectionModel;
};

export function createErrorCollectionModel(): ErrorCollectionModel {
  const model: ErrorCollectionModel = {
    isValidated: false,
    details: [],
    mapFromApplicationError(error) {
      return {
        ...model,
        isValidated: true,
        details: Object
          .entries(error.details)
          .map(([key, value]) => ({ propertyPath: key, message: value }))
          .filter((detail) => detail.message)
        };
    },
    clear: () => ({ ...model, details: [] }),
  };

  return model;
};
