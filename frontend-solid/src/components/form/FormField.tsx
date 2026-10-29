import { joinClassName, getDisplayNameByKey } from "#/helpers";
import { FormContext } from "./Form";

// Types.
export type FormFieldContextPayload = {
  path?: string;
  displayName: string | undefined;
  isValidated: boolean;
  hasError: boolean;
};

// Context.
export const FormFieldContext = $createContext<FormFieldContextPayload>();

// Props.
export type FormFieldProps = {
  path?: string;
  displayName?: string;
  children: JSXElement;
  hideLabel?: boolean;
  hideValidationMessage?: boolean;
} & HTMLAttributes<HTMLDivElement>;

// Components.
export function FormField(props: FormFieldProps): JSXElement {
  // Dependencies.
  const formContext = $useContext(FormContext);

  // Computed.
  const displayName = $memo(() => {
    if (props.displayName) {
      return props.displayName;
    }

    if (!props.path) {
      return;
    }
    
    const pathElements = props.path.split(".");
    if (pathElements.length === 0) {
      return;
    }

    const lastIndexerOmittedPathElement = pathElements[pathElements.length - 1].replace(/\[[0-9]]/g, "");
    return getDisplayNameByKey(lastIndexerOmittedPathElement) ?? undefined;
  });

  const errorMessage = $memo(() => {
    if (!formContext || !formContext.errorCollection.isValidated || !props.path) {
      return;
    }

    const messages = formContext.errorCollection.details
      .filter(d => d.propertyPath === props.path)
      .map(d => d.message);

    if (messages.length === 0) {
      return;
    }

    return messages[0].replaceAll("{propertyDisplayName}", displayName ?? "{propertyDisplayName}");
  });

  const labelClassName = $memo<string | undefined>(() => {
    if (!props.hideValidationMessage && errorMessage) {
      return "text-red-900";
    }
  });

  const validationMessageClassName = $memo<string | undefined>(() => {
    if (formContext?.errorCollection.isValidated) {
      if (errorMessage) {
        return "text-red-600 text-sm";
      }

      return "text-emerald-600 text-sm";
    }
  });

  const contextPayload: FormFieldContextPayload = {
    path: props.path,
    displayName: displayName,
    get isValidated(): boolean {
      return this.isValidated;
    },
    get hasError(): boolean {
      return !!errorMessage;
    }
  };
  
  // Template.
  return (
    <div class={joinClassName(
      props.class,
      "form-field flex flex-col",
      errorMessage && "field-validation-error"
    )}>
      {/* Label */}
      <Show when={!props.hideLabel && displayName}>
        {(displayName) => (
          <label class={labelClassName} for={props.path}>
            {displayName}
          </label>
        )}
      </Show>

      {/* Input */}
      <FormFieldContext.Provider value={contextPayload}>
        {props.children}
      </FormFieldContext.Provider>

      {/* Message */}
      <Show when={!props.hideValidationMessage && errorMessage}>
        {(errorMessage) => (
          <span class={validationMessageClassName}>
            {errorMessage}
          </span>
        )}
      </Show>
    </div>
  );
}
