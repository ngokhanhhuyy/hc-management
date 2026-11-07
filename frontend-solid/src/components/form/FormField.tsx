import { joinClassName, getDisplayNameByKey } from "#/helpers";
import { FormContext } from "./Form";

// Types.
export type FormFieldContextPayload = {
  path: Accessor<string | undefined>;
  displayName: Accessor<string | undefined>;
  isValidated: Accessor<boolean>;
  hasError: Accessor<boolean>;
};

// Context.
export const FormFieldContext = createContext<FormFieldContextPayload>();

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
  const formContext = useContext(FormContext);

  // Computed.
  const displayName = createMemo(() => {
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

  const errorMessage = createMemo(() => {
    if (!formContext || !formContext.errorCollection().isValidated || !props.path) {
      return;
    }

    const messages = formContext.errorCollection().details
      .filter(d => d.propertyPath === props.path)
      .map(d => d.message);

    if (messages.length === 0) {
      return;
    }

    return messages[0].replaceAll("{propertyDisplayName}", displayName() ?? "{propertyDisplayName}");
  });

  const labelClassName = createMemo<string | undefined>(() => {
    if (!props.hideValidationMessage && errorMessage()) {
      return "text-red-900";
    }
  });

  const validationMessageClassName = createMemo<string | undefined>(() => {
    if (formContext?.errorCollection().isValidated) {
      if (errorMessage()) {
        return "text-red-600 text-sm";
      }

      return "text-emerald-600 text-sm";
    }
  });

  const contextPayload: FormFieldContextPayload = {
    path: () => props.path,
    displayName,
    isValidated: () => formContext.errorCollection().isValidated,
    hasError: () => !!errorMessage()
  };
  
  // Template.
  return (
    <div class={joinClassName(
      props.class,
      "form-field flex flex-col",
      errorMessage() && "field-validation-error"
    )}>
      {/* Label */}
      <Show when={!props.hideLabel && displayName()}>
        {(displayName) => (
          <label class={labelClassName()} for={props.path}>
            {displayName()}
          </label>
        )}
      </Show>

      {/* Input */}
      <FormFieldContext.Provider value={contextPayload}>
        {props.children}
      </FormFieldContext.Provider>

      {/* Message */}
      <Show when={!props.hideValidationMessage && errorMessage()}>
        {(errorMessage) => (
          <span class={validationMessageClassName()}>
            {errorMessage()}
          </span>
        )}
      </Show>
    </div>
  );
}
