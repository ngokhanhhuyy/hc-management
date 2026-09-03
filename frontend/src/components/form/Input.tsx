import React, { useContext } from "react";
import { FormFieldContext } from "./FormFieldContext";

// Props.
type InputProps = { render: (className?: string, path?: string, displayName?: string) => React.ReactNode };

// Component.
export default function Input(props: InputProps): React.ReactNode {
  // Dependencies.
  const context = useContext(FormFieldContext);

  // Template.
  return props.render("form-control", context?.path, context?.displayName);
}
