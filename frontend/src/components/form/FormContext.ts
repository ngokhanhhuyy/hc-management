import { createContext } from "react";
import type { ErrorDetails } from "@hc-management/shared/errors";

// Types.
export type FormContextPayload = {
  isValidated: boolean;
  errorDetails: ErrorDetails;
};

// Context.
export const FormContext = createContext<FormContextPayload>({
  isValidated: false,
  errorDetails: { }
});
