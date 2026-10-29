import type { JSX } from "solid-js";
import { joinClassName } from "#/helpers";
import { FormFieldContext } from "./FormField";

// Props.
export type TextInputProps = {
  type?: "text" | "password" | "tel" | "email"
  value: string;
  autoFocus?: boolean;
  onInput(newValue: string): any;
} & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "onInput">;

// Component.
export function TextInput(props: TextInputProps): JSX.Element {
  // Props.
  const defaultProps = $merge({ autocomplete: "off" }, props);
  const { value, onInput, placeholder, autoFocus, ...domProps } = $destructure(defaultProps);

  // Dependencies.
  const formFieldContext = $useContext(FormFieldContext);

  // States.
  let elementRef: HTMLInputElement;
  
  // Effect.
  $mount(() => {
    if (autoFocus && elementRef) {
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
      placeholder={placeholder ?? formFieldContext?.displayName ?? undefined}
      value={props.value}
      onInput={(event) => props.onInput(event.target.value)}
    />
  );
}
