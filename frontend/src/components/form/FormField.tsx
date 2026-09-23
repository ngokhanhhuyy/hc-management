import React, { useMemo, useContext } from "react";
import { compute, joinClassName, getDisplayNameByKey } from "#/helpers";

// Parent components.
import { FormContext } from "./FormContext";
import { FormFieldContext, type FormFieldContextPayload } from "./FormFieldContext";

// Props.
export type FormFieldProps = {
  path?: string;
  displayName?: string;
  children: React.ReactNode;
  hideLabel?: boolean;
  hideValidationMessage?: boolean;
} & React.ComponentPropsWithoutRef<"div">;

// Components.
export default function FormField(props: FormFieldProps) {
  // Dependencies.
  const formContext = useContext(FormContext);

  // Computed.
  const displayName = useMemo(() => {
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
    return getDisplayNameByKey(lastIndexerOmittedPathElement);
  }, []);

  const errorMessage = useMemo(() => {
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
  }, [formContext?.errorCollection.details]);

  const validationMessageClassName = compute<string | undefined>(() => {
    if (formContext?.errorCollection.isValidated) {
      if (errorMessage) {
        return "text-red-600";
      }

      return "text-emerald-600";
    }
  });

  const contextPayload = useMemo<FormFieldContextPayload>(() => {
    return {
      isValidated: !!formContext?.errorCollection.isValidated,
      hasError: !!errorMessage,
      path: props.path,
      displayName: displayName ?? undefined
    };
  }, [formContext?.errorCollection.details, displayName]);

  // Template.
  return (
    <div className={joinClassName(
      props.className,
      "form-field flex flex-col justify-stretched",
      errorMessage && "field-validation-error"
    )}>
      {/* Label */}
      {(!props.hideLabel && displayName) && (
        <label className={joinClassName((!props.hideValidationMessage && errorMessage) && "text-red-900")} htmlFor={props.path}>
          {displayName}
        </label>
      )}

      {/* Input */}
      <FormFieldContext.Provider value={contextPayload}>
        {props.children}
      </FormFieldContext.Provider>

      {/* Message */}
      {(!props.hideValidationMessage && errorMessage) && (
        <span className={validationMessageClassName}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
