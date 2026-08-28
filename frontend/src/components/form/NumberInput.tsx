import React, { useRef, useContext } from "react";
import { joinClassName } from "#/helpers";

// Parent components.
import { FormFieldContext } from "./FormFieldContext";

// Props.
export type NumberInputProps = {
  value: number;
  onInput?(newValue: number): any;
  onChange?(newValue: number): any;
  min?: number;
  max?: number;
} & Omit<React.ComponentPropsWithoutRef<"input">, "type" | "value" | "onInput" | "onChange" | "min" | "max">;

// Component.
export default function NumberInput(props: NumberInputProps) {
  // Props.
  const { value, onInput, onChange, min, max, ...domProps } = props;

  // Dependencies.
  const formFieldContext = useContext(FormFieldContext);

  // States.
  const elementRef = useRef<HTMLInputElement>(null!);

  // Callbacks.
  function handleInput(): void {
    if (!elementRef.current.value.length) {
      props.onInput?.(0);
      elementRef.current.value = "0";
      return;
    }

    if (/\d+/.test(elementRef.current.value)) {
      const parsedValue = parseInt(elementRef.current.value);
      const minMaxEnforcedValue = enforceMinMax(parsedValue);
      props.onInput?.(minMaxEnforcedValue);
      elementRef.current.value = minMaxEnforcedValue.toString();
    }
  }

  function enforceMinMax(value: number): number {
    let enforcedValue = value;
    if (min != null) {
      enforcedValue = Math.max(min);
    }

    if (max != null) {
      enforcedValue = Math.min(max);
    }

    return enforcedValue;
  }

  // Template.
  return (
    <input
      {...domProps}
      ref={elementRef}
      type="number"
      name={formFieldContext.path}
      className={joinClassName(
        "form-control",
        formFieldContext.isValidated && formFieldContext.hasError && "is-invalid",
        props.className)}
      value={value}
      onInput={handleInput}
    />
  );
}
