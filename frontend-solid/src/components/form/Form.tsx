import { createErrorCollectionModel, type ErrorCollectionModel } from "#/models";
import { ValidationError, OperationError } from "#/api";
import { joinClassName } from "#/helpers";

// Context.
export type SubmissionState = "notSubmitting" | "submitting" | "submissionSucceeded";
export type FormContextPayload = {
  errorCollection: Accessor<ErrorCollectionModel>;
  submissionState: Accessor<SubmissionState>;
  isModelDirty: Accessor<boolean>;
};

export const FormContext = createContext<FormContextPayload>({
  errorCollection: createErrorCollectionModel,
  submissionState: (): SubmissionState => "notSubmitting",
  isModelDirty: () => false
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
  const defaultProps = mergeProps({
    autocomplete: "off" as typeof props.autocomplete,
    submitOnEnterKeyPressed: true
  }, props);

  const [local, domProps] = splitProps(defaultProps, [
    "render", "action", "onSucceeded", "onFailed", "isModelDirty", "autocomplete", "submitOnEnterKeyPressed"
  ]);

  // States.
  const [errorCollectionModel, setErrorCollectionModel] = createSignal(createErrorCollectionModel());
  const [submissionState, setSubmissionState] = createSignal<SubmissionState>("notSubmitting");

  // Computed.
  const submittingClassName = createMemo(() => {
    if (submissionState() === "submitting") {
      return "opacity-50 pointer-events-none";
    }
  });
  
  const contextValue: FormContextPayload = {
    errorCollection: errorCollectionModel,
    submissionState,
    isModelDirty: () => props.isModelDirty ?? false
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
      if (local.submitOnEnterKeyPressed) {
        return;
      }

      event.preventDefault();
      if (document.activeElement && isInputElement(document.activeElement)) {
        document.activeElement.blur();
      }
    }
  }

  async function handleSubmissionAsync(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    setErrorCollectionModel(previous => previous.clear());
    setSubmissionState("submitting");

    try {
      const result = await local.action();
      local.onSucceeded?.(result);
      setSubmissionState("submissionSucceeded");

    } catch (error) {
      setSubmissionState("notSubmitting");
      if (error instanceof ValidationError || error instanceof OperationError) {
        setErrorCollectionModel(previous => previous.mapFromApplicationError(error));
        local.onFailed?.(error, true);
        return;
      }

      local.onFailed?.(error as Error, false);
      throw error;
    }
  }

  // Template.
  return (
    <FormContext.Provider value={contextValue}>
      <form
        {...domProps}
        autocomplete={local.autocomplete}
        class={joinClassName(
          domProps.class,
          submittingClassName(),
          "transition transition-500",
          submissionState() === "submitting" && "cursor-wait"
        )}
        noValidate
        onSubmit={handleSubmissionAsync}
        onKeyDown={handleKeyPressed}
      >
        {domProps.children}
        {local.render?.(errorCollectionModel())}
      </form>
    </FormContext.Provider>
  );
}
