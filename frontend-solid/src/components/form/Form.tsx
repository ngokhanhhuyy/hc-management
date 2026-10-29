import type { JSX } from "solid-js";
import { ErrorCollectionModel } from "#/models";
import { ValidationError, OperationError } from "#/api";
import { joinClassName } from "#/helpers";

// Context.
export type SubmissionState = "notSubmitting" | "submitting" | "submissionSucceeded";
export type FormContextPayload = {
  errorCollection: ErrorCollectionModel;
  submissionState: SubmissionState;
  isModelDirty: boolean;
};

export const FormContext = $createContext<FormContextPayload>({
  errorCollection: new ErrorCollectionModel(),
  submissionState: "notSubmitting",
  isModelDirty: false
});

// Props.
type FormProps<TUpsertResult> = {
  action: () => Promise<TUpsertResult>;
  onSucceeded?: (result: TUpsertResult) => any;
  onFailed?: (error: Error, errorHandled: boolean) => any;
  isModelDirty?: boolean;
  submitOnEnterKeyPressed?: boolean;
  render?(errorCollection: ErrorCollectionModel): JSX.Element;
} & Omit<JSX.FormHTMLAttributes<HTMLFormElement>, "action">;

// Components.
export function Form<TUpsertResult>(props: FormProps<TUpsertResult>) {
  // Props.
  const defaultProps = $merge({
    autocomplete: "off" as typeof props.autocomplete,
    submitOnEnterKeyPressed: true
  }, props);

  const {
    render,
    action,
    onSucceeded,
    onFailed,
    isModelDirty,
    autocomplete,
    submitOnEnterKeyPressed,
    ...domProps
  } = $destructure(defaultProps);

  // States.
  const errorCollectionModel = $mutable(new ErrorCollectionModel());
  let submissionState = $signal<SubmissionState>("notSubmitting");

  // Computed.
  const submittingClassName = $memo(() => {
    if (submissionState === "submitting") {
      return "opacity-50 pointer-events-none";
    }
  });
  
  const contextValue: FormContextPayload = {
    get errorCollection() {
      return errorCollectionModel;
    },
    get submissionState() {
      return submissionState;
    },
    get isModelDirty() {
      return props.isModelDirty ?? false;
    }
  };

  // Callbacks.
  function handleKeyPressed(event: KeyboardEvent): void {
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

  async function handleSubmissionAsync(event: SubmitEvent): Promise<void> {
    console.log("upsert");
    event.preventDefault();
    errorCollectionModel.clear();
    submissionState = "submitting";

    try {
      const result = await action();
      onSucceeded?.(result);
      submissionState = "submissionSucceeded";

    } catch (error) {
      submissionState = "notSubmitting";
      console.log(error instanceof ValidationError || error instanceof OperationError);
      if (error instanceof ValidationError || error instanceof OperationError) {
        errorCollectionModel.mapFromApplicationError(error);
        onFailed?.(error, true);
        return;
      }

      onFailed?.(error as Error, false);
      throw error;
    }
  }

  // Template.
  return (
    <FormContext.Provider value={contextValue}>
      <form
        {...domProps}
        autocomplete={autocomplete}
        class={joinClassName(
          domProps.class,
          submittingClassName,
          "transition transition-500",
          submissionState === "submitting" && "cursor-wait"
        )}
        noValidate
        onSubmit={handleSubmissionAsync}
        onKeyDown={handleKeyPressed}
      >
        {domProps.children}
        {render?.(errorCollectionModel)}
      </form>
    </FormContext.Provider>
  );
}
