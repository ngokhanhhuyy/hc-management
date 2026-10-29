import type { JSX } from "solid-js";
import { joinClassName, compute } from "#/helpers";
import { FormFieldContext } from "./FormField";

// Props.
export type NumberInputProps = {
  value: number;
  onInput(newValue: number): any;
  min?: number;
  max?: number;
  autoFocus?: boolean;
} & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "autoFocus" | "min" | "max" | "onInput">;

// Component.
export default function NumberInput(props: NumberInputProps): JSXElement {
  // Props.
  const { value, onInput, autoFocus, ...domProps } = $destructure(props);

  // Dependencies.
  const formFieldContext = $useContext(FormFieldContext);

  // States.
  let elementRef: HTMLInputElement;

  // Computed.
  const computedValue = compute<string>(() => {
    return toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  });

  // Callbacks.
  function handleInput(event: InputEvent): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.value.length) {
      onInput(0);
      return;
    }

    if (!/[0-9\s]+/g.test(inputElement.value)) {
      return;
    }
    
    const parsedValue = parseInt(inputElement.value.replaceAll(" ", ""));
    if (props.min != null && parsedValue < props.min) {
      onInput(props.min);
      return;
    }

    if (props.max != null && parsedValue > props.max) {
      onInput(props.max);
      return;
    }

    onInput(parsedValue);
  }

  // Effect.
  $mount(() => {
    if (props.autoFocus && elementRef) {
      elementRef.focus();
    }
  });

  // Template.
  return (
    <input
    {...domProps}
    ref={(element) => elementRef = element}
    name={formFieldContext?.path}
    class={joinClassName("form-control", domProps.class)}
    placeholder={props.placeholder ?? formFieldContext?.displayName}
    value={computedValue}
    onInput={handleInput}
    />
  );
}
