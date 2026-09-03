import React from "react";
import { joinClassName } from "#/helpers";

// Child components.
import Input from "./Input";

// Props.
export type TextInputProps = {
  type?: "text" | "password" | "tel" | "email"
  value: string;
  onInput(newValue: string): any;
} & Omit<React.ComponentPropsWithoutRef<"input">, "type" | "onInput">;

// Component.
export default function TextInput(props: TextInputProps): React.ReactNode {
  // Props.
  const { value, onInput, autoComplete = "off", ...domProps } = props;

  // Template.
  function renderInput(className?: string, path?: string, displayName?: string) {
    return (
      <input
        {...domProps}
        autoComplete={autoComplete}
        name={path}
        className={joinClassName(className, props.className)}
        placeholder={props.placeholder ?? displayName}
        value={value}
        onInput={(event) => onInput((event.target as HTMLInputElement).value)}
      />
    );
  }

  return <Input render={renderInput} />;
}
