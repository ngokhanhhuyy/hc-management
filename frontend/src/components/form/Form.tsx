import React, { useState, useMemo, useRef } from "react";
import { FormContext, type FormContextPayload, type SubmissionState } from "./FormContext";
import { createErrorCollectionModel, type ErrorCollectionModel } from "#/models";
import { ValidationError, OperationError } from "@hc-management/shared/errors";
import { compute, joinClassName } from "#/helpers";

// Props.
type FormProps<TUpsertResult> = {
  submitAction: () => Promise<TUpsertResult>;
  onSubmissionSucceeded?: (result: TUpsertResult) => any;
  onSubmissionFailed?: (error: Error, errorHandled: boolean) => any;
  isModelDirty?: boolean;
  submitOnEnterKeyPressed?: boolean;
  render?(errorCollection: ErrorCollectionModel): React.ReactNode;
} & React.ComponentPropsWithoutRef<"form">;

// Component.
export default function Form<TUpsertResult>(props: FormProps<TUpsertResult>) {
  // Props.
  const {
    render,
    submitAction,
    onSubmissionSucceeded,
    onSubmissionFailed,
    isModelDirty,
    autoComplete = "off",
    submitOnEnterKeyPressed = false,
    ...domProps
  } = props;

  // States.
  const [errorCollection, setErrorCollection] = useState(createErrorCollectionModel);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("notSubmitting");
  const elementRef = useRef<HTMLFormElement | null>(null);

  // Computed.
  const submittingClassName = compute(() => {
    if (submissionState === "submitting") {
      return "opacity-50 pointer-events-none";
    }
  });
  
  const contextValue = useMemo<FormContextPayload>(() => {
    return {
      errorCollection,
      submissionState,
      isModelDirty
    };
  }, [errorCollection, submissionState, isModelDirty]);

  // Callbacks.
  function handleKeyPressed(event: React.KeyboardEvent): void {
    type InputElement = HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement;
    const isInputElement = (element: Element): element is InputElement => {
      const typesToCheck = [HTMLInputElement, HTMLButtonElement, HTMLSelectElement, HTMLTextAreaElement] as const;
      for (const typeToCheck of typesToCheck) {
        if (document.activeElement?.contains(element) && document.activeElement instanceof typeToCheck) {
          return true;
        }
      }

      return false;
    };

    if (event.key === "Enter") {
      if (submitOnEnterKeyPressed) {
        return;
      }

      event.preventDefault();
      if (document.activeElement && isInputElement(document.activeElement)) {
        document.activeElement.blur();
      }
    }
  }

  async function handleUpsertingAsync(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setErrorCollection(errorCollection => errorCollection.clear());
    setSubmissionState("submitting");

    try {
      const result = await submitAction();
      onSubmissionSucceeded?.(result);
      setSubmissionState("submissionSucceeded");
    } catch (error) {
      setSubmissionState("notSubmitting");
      if (error instanceof ValidationError || error instanceof OperationError) {
        setErrorCollection(errorCollection => errorCollection.mapFromApplicationError(error));
        onSubmissionFailed?.(error, true);
        return;
      }

      onSubmissionFailed?.(error as Error, false);
      throw error;
    }
  }

  // Template.
  return (
    <FormContext.Provider value={contextValue}>
      <form
        {...domProps}
        autoComplete={autoComplete}
        ref={elementRef}
        className={joinClassName(
          domProps.className,
          submittingClassName,
          "transition transition-500",
          submissionState === "submitting" && "cursor-wait"
        )}
        noValidate
        onSubmit={handleUpsertingAsync}
        onKeyDown={handleKeyPressed}
      >
        {domProps.children}
        {render?.(errorCollection)}
      </form>
    </FormContext.Provider>
  );
}
