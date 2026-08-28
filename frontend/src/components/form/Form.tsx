import React, { useState } from "react";
import { FormContext, type FormContextPayload } from "./FormContext";
import { compute } from "#/helpers";
import { ValidationError, OperationError, type ErrorDetails } from "@hc-management/shared/errors";

// Props.
type FormProps<TResult> = {
  submitAction(): Promise<TResult>;
  onSubmissionSucceeded?(result: TResult): any;
  onSubmissionFailed?(error: unknown, isKnownError: boolean): any;
} & Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit">;

// Components.
export default function Form<TResult>(props: FormProps<TResult>): React.ReactNode {
  // Props.
  const { submitAction, onSubmissionSucceeded, onSubmissionFailed, ...domProps } = props;

  // States.
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails>({ });

  // Computed.
  const formContextPayload = compute<FormContextPayload>(() => ({ isValidated, errorDetails }));

  // Callbacks.
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsValidated(true);
    setErrorDetails({ });
    
    try {
      const result = await submitAction();
      onSubmissionSucceeded?.(result);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof OperationError) {
        setErrorDetails(error.details);
        onSubmissionFailed?.(error, true);
        return;
      }

      onSubmissionFailed?.(error, false);
    }
  };

  // Templates.
  return (
    <FormContext.Provider value={formContextPayload}>
      <form {...domProps} noValidate onSubmit={handleSubmit} />
    </FormContext.Provider>
  );
}
