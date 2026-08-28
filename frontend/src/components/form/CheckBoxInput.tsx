import React, { useContext } from "react";
import { joinClassName } from "#/helpers";

// Parent components.
import { FormFieldContext } from "./FormFieldContext";

// Props.
export type CheckBoxInputProps = {
  checked: boolean;
  onChange(newValue: boolean): any;
} & Omit<React.ComponentPropsWithoutRef<"input">, "type" | "value" | "checked" | "onInput" | "onChange">;

// Component.
export default function CheckBoxInput(props: CheckBoxInputProps) {
  // Props.
  const { checked, onChange, ...domProps } = props;
  
  // Dependencies.
  const formFieldContext = useContext(FormFieldContext);

  // Template.
  return (
    <input
      {...domProps}
      type="checkbox"
      name={formFieldContext.path}
      className={joinClassName(
        "form-check-input",
        formFieldContext.isValidated && formFieldContext.hasError && "is-invalid",
        props.className
      )}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  );
}
