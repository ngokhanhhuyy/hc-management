import { createContext } from "react";

// Types.
export type FormFieldContextPayload = {
  path?: string;
  isValidated: boolean;
  hasError: boolean;
  displayName?: string;
};

// Context.
export const FormFieldContext = createContext<FormFieldContextPayload>({
  path: "",
  isValidated: false,
  hasError: false
});
