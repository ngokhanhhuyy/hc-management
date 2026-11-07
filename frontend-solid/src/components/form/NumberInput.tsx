import { joinClassName } from "#/helpers";
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
export function NumberInput(props: NumberInputProps): JSXElement {
  // Props.
  const [local, domProps] = splitProps(props, ["value", "onInput", "autoFocus"]);

  // Dependencies.
  const formFieldContext = useContext(FormFieldContext);

  // States.
  let elementRef: HTMLInputElement;

  // Computed.
  const computedValue = createMemo<string>(() => {
    return props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  });

  // Callbacks.
  function handleInput(event: InputEvent): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.value.length) {
      local.onInput(0);
      return;
    }

    if (!/[0-9\s]+/g.test(inputElement.value)) {
      return;
    }
    
    const parsedValue = parseInt(inputElement.value.replaceAll(" ", ""));
    if (props.min != null && parsedValue < props.min) {
      local.onInput(props.min);
      return;
    }

    if (props.max != null && parsedValue > props.max) {
      local.onInput(props.max);
      return;
    }

    local.onInput(parsedValue);
  }

  // Effect.
  onMount(() => {
    if (props.autoFocus && elementRef) {
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
    placeholder={props.placeholder ?? formFieldContext?.displayName()}
    value={computedValue()}
    onInput={handleInput}
    />
  );
}
