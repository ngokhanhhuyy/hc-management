import React, { useMemo, useContext } from "react";
import { compute, joinClassName } from "#/helpers";
import { getDisplayNameByKey } from "@hc-management/shared/localization";

// Parent components.
import { FormContext } from "./FormContext";
import { FormFieldContext, type FormFieldContextPayload } from "./FormFieldContext";

// Props.
type FormFieldProps = {
  path: string;
  displayName?: string;
  isRequired?: boolean;
  children: React.ReactNode | React.ReactNode[];
} & Omit<React.ComponentPropsWithoutRef<"div">, "name" | "path" | "children">;

// Components.
export default function FormField(props: FormFieldProps): React.ReactNode {
  // Props.
  const { className, path, displayName, isRequired, children, ...domProps } = props;

  // Dependencies.
  const formContext = useContext(FormContext);

  // Computed.
  const computedDisplayName = useMemo<string>(() => {
    if (displayName == null) {
      const pathElements = path.split(".");
      return getDisplayNameByKey(pathElements[pathElements.length - 1]);
    }

    return displayName;
  }, []);

  const errorMessage = compute<string | null>(() => {
    const entry = Object.entries(formContext.errorDetails)
      .find(([propertyPath]) => propertyPath === path);
    return entry?.[1] ?? null;
  });

  const contextPayload = compute<FormFieldContextPayload>(() => ({
    path,
    isValidated: formContext.isValidated,
    hasError: !!errorMessage,
    displayName: computedDisplayName
  }));

  // Template.
  return (
    <FormFieldContext.Provider value={contextPayload}>
      <div {...domProps} className={joinClassName("form-group", errorMessage && "form-group-invalid", className)}>
        <label htmlFor={props.path} className={joinClassName("form-label opacity-75", isRequired && "required")}>
          {computedDisplayName}
        </label>
        
        {children}
        {errorMessage && (
          <span className="text-danger small">{errorMessage}</span>
        )}
      </div>
    </FormFieldContext.Provider>
  );
}
