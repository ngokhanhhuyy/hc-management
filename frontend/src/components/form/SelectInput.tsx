import React, { useContext } from "react";
import { joinClassName } from "#/helpers";
import styles from "./SelectInput.module.css";

// Parent components.
import { FormFieldContext } from "./FormFieldContext";

// Props.
export type SelectInputOption<TValue extends string> = {
  value: TValue;
  displayName?: string;
};

export type SelectInputProps<TValue extends string> = {
  options: SelectInputOption<TValue>[];
  value: TValue;
  onInput(newValue: TValue): any;
  disabled?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"select">, "children" | "onInput">;

// Component.
export default function SelectInput<TValue extends string>(props: SelectInputProps<TValue>): React.ReactNode {
  // Dependencies.
  const formFieldContext = useContext(FormFieldContext);

  // Template.
  return (
    <div className="dropdown">
      <button
        name={formFieldContext.path}
        className={joinClassName(
          "form-select text-start",
          formFieldContext.isValidated && formFieldContext.hasError && "is-invalid",
        )}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={props.disabled}
      >
        {props.options.filter(o => o.value === props.value).map(o => o.displayName)}
      </button>
      
      <ul className={joinClassName("dropdown-menu w-100 p-1 rounded-lg shadow", styles.selectInputMenu)}>
        {props.options.map((option, index) => (
          <li className="w-100" key={index}>
            <div
              className={joinClassName(
                "rounded small",
                styles.selectInputMenuItem,
                props.value === option.value && styles.selected,
              )}
              onClick={() => props.onInput(option.value)}
            >
              {option.displayName ?? option.value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
