<script module lang="ts">
import { createContext } from "svelte";
// Types.
export type FormFieldContextPayload = {
  path?: string;
  isValidated: boolean;
  hasError: boolean;
  displayName?: string;
};

// Context.
export const [getFormFieldContextPayload, setFormFieldContextPayload] = createContext<FormFieldContextPayload>();
</script>

<script lang="ts">
import type { SvelteHTMLElements } from "svelte/elements";
import { compute, getDisplayNameByKey } from "#/helpers";
import { getFormContextPayload } from "./Form.svelte";

// Props.
let props: {
  path?: string;
  displayName?: string;
  hideLabel?: boolean;
  hideValidationMessage?: boolean;
} & SvelteHTMLElements["div"] = $props();

// Dependencies.
const formContext = getFormContextPayload();

// Computed.
const displayName = compute(() => {
  if (props.displayName) {
    return props.displayName;
  }

  if (!props.path) {
    return;
  }
  
  const pathElements = props.path.split(".");
  if (pathElements.length === 0) {
    return;
  }

  const lastIndexerOmittedPathElement = pathElements[pathElements.length - 1].replace(/\[[0-9]]/g, "");
  return getDisplayNameByKey(lastIndexerOmittedPathElement);
});

const errorMessage = $derived.by(() => {
  if (!formContext || !formContext.errorCollection.isValidated || !props.path) {
    return;
  }

  const messages = formContext.errorCollection.details
    .filter(d => d.propertyPath === props.path)
    .map(d => d.message);

  if (messages.length === 0) {
    return;
  }

  return messages[0].replaceAll("{propertyDisplayName}", displayName ?? "{propertyDisplayName}");
});

const validationMessageClassName = $derived.by<string | undefined>(() => {
  if (formContext?.errorCollection.isValidated) {
    if (errorMessage) {
      return "text-red-600 text-sm";
    }

    return "text-emerald-600 text-sm";
  }
});

// Context.
setFormFieldContextPayload({
  get path(): string | undefined {
    return props.path;
  },
  get isValidated(): boolean {
    return !!formContext?.errorCollection.isValidated;
  },
  get hasError(): boolean {
    return !!errorMessage;
  },
  get displayName(): string | undefined {
    return displayName ?? undefined;
  }
});
</script>

<div class={[props.class, "form-field flex flex-col justify-stretched", errorMessage && "field-validation-error"]}>
  {#if !props.hideLabel && displayName}
    <label class={[(!props.hideValidationMessage && errorMessage) && "text-red-900"]} for={props.path}>
      {displayName}
    </label>
  {/if}

  {@render props.children?.()}

  {#if (!props.hideValidationMessage && errorMessage)}
    <span class={validationMessageClassName}>
      {errorMessage}
    </span>
  {/if}
</div>
