import { joinClassName } from "#/helpers";
import { FormFieldContext } from "./FormField";

// Props.
export type TextInputProps = {
  type?: "text" | "password" | "tel" | "email";
  value: string;
  autoFocus?: boolean;
  onInput(newValue: string): any;
} & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "onInput">;

// Component.
export function TextInput(props: TextInputProps): JSX.Element {
  // Props.
  const defaultProps = mergeProps({ autocomplete: "off" }, props);
  const [local, domProps] = splitProps(defaultProps, ["value", "onInput", "placeholder", "autoFocus"]);

  // Dependencies.
  const formFieldContext = useContext(FormFieldContext);

  // States.
  let elementRef: HTMLInputElement;
  
  // Effect.
  onMount(() => {
    if (local.autoFocus && elementRef) {
      elementRef.focus();
    }
  });

  // Template.
  return (
    <input
      {...domProps}
      ref={(element) => elementRef = element}
      name={formFieldContext?.path()}
      class={joinClassName("form-control", domProps.class)}
      placeholder={local.placeholder ?? formFieldContext?.displayName() ?? undefined}
      value={props.value}
      onInput={(event) => props.onInput(event.target.value)}
    />
  );
}
