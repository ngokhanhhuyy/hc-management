import React, { useMemo, useContext } from "react";
import { compute, joinClassName } from "#/helpers";
import { getDisplayNameByKey } from "@hc-management/shared/localization";

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

    return messages[0];
  }, [formContext?.errorCollection.details]);

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

  const validationMessageClassName = compute<string | undefined>(() => {
    if (formContext?.errorCollection.isValidated) {
      if (errorMessage) {
        return "field-validation-error";
      }

      return "field-validation-valid";
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
    )}>
      {/* Label */}
      {(!props.hideLabel && displayName) && (
        <label htmlFor={props.path}>
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
