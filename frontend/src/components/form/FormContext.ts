import { createContext } from "react";
import { createErrorCollectionModel, type ErrorCollectionModel } from "#/models";

// Type.
export type SubmissionState = "notSubmitting" | "submitting" | "submissionSucceeded";

// Payload.
export type FormContextPayload = {
  errorCollection: ErrorCollectionModel;
  submissionState: SubmissionState;
  isModelDirty?: boolean;
};

// Context.
export const FormContext = createContext<FormContextPayload>({
  errorCollection: createErrorCollectionModel(),
  submissionState: "notSubmitting"
});
