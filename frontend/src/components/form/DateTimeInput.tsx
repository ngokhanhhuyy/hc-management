import React, { useContext } from "react";
import { joinClassName } from "#/helpers";

// Parent components.
import { FormFieldContext } from "./FormFieldContext";

// Props.
type DateTimeInputProps = {
  value: string;
  onInput(newValue: string): any;
  maxByteLength?: number;
} & Omit<React.ComponentPropsWithoutRef<"input">, "value" | "onInput" | "onChange" | "type">;

// Components.
export default function DateTimeInput(props: DateTimeInputProps): React.ReactNode {
  // Props.
  const { value, onInput, ...domProps } = props;
    
  // Dependencies.
  const formFieldContext = useContext(FormFieldContext);

  // Callbacks.
  const handleInput = (event: React.InputEvent<HTMLInputElement>): void => {
    props.onInput((event.target as HTMLInputElement).value);
  };

  // Template.
  return (
    <input
      {...domProps}
      type="datetime-local"
      name={formFieldContext.path}
      className={joinClassName(
        "form-control",
        formFieldContext.isValidated && formFieldContext.hasError && "is-invalid",
        props.className
      )}
      value={props.value}
      onInput={handleInput}
    />
  );
}
