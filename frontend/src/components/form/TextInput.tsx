import React, { useContext } from "react";
import { joinClassName } from "#/helpers";

// Parent components.
import { FormFieldContext } from "./FormFieldContext";

// Props.
export type TextInputProps = {
  type?: "text" | "password" | "tel" | "email"
  value: string;
  onInput?(newValue: string): any;
  onChange?(newValue: string): any;
} & Omit<React.ComponentPropsWithoutRef<"input">, "type" | "onInput" | "onChange">;

// Component.
export default function TextInput(props: TextInputProps): React.ReactNode {
  // Props.
  const { type = "text", value, onInput, onChange, ...domProps } = props;

  // Dependencies.
  const formFieldContext = useContext(FormFieldContext);

  // Template.
  return (
    <input
      {...domProps}
      type={type}
      placeholder={formFieldContext.displayName}
      className={joinClassName(
        "form-control",
        formFieldContext.isValidated && formFieldContext.hasError && "is-invalid",
        props.className
      )}
      value={value}
      onInput={(event) => onInput?.((event.target as HTMLInputElement).value)}
      onChange={(event) => onChange?.((event.target as HTMLInputElement).value)}
    />
  );
}
