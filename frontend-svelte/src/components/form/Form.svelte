<script module lang="ts">
import { hasContext, getContext, setContext } from "svelte";

// Type.
export type SubmissionState = "notSubmitting" | "submitting" | "submissionSucceeded";
export type FormContextPayload = {
  errorCollection: ErrorCollectionModel;
  submissionState: SubmissionState;
  isModelDirty?: boolean;
};

// Context.
const contextKey = Symbol("form-context");

export function getFormContextPayload(): Readonly<FormContextPayload> | undefined {
  return hasContext(contextKey) ? getContext(contextKey) : undefined;
}

export function setFormContextPayload(payload: FormContextPayload): void {
  setContext(contextKey, payload);
}


</script>

<script lang="ts" generics="TUpsertResult">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import { ValidationError, OperationError } from "#/api";
import { ErrorCollectionModel } from "#/models";

// Props.
let {
  children,
  submitAction,
  onSubmissionSucceeded,
  onSubmissionFailed,
  isModelDirty,
  autocomplete = "off",
  submitOnEnterKeyPressed = false,
  ...domProps
}: {
  submitAction: () => Promise<TUpsertResult>;
  onSubmissionSucceeded?: (result: TUpsertResult) => any;
  onSubmissionFailed?: (error: Error, errorHandled: boolean) => any;
  isModelDirty?: boolean;
  submitOnEnterKeyPressed?: boolean;
  children?: Snippet<[Readonly<ErrorCollectionModel>]>;
} & SvelteHTMLElements["form"] = $props();

// States.
const errorCollection = $state(new ErrorCollectionModel());
let submissionState = $state<SubmissionState>("notSubmitting");
let elementReference = $state<HTMLFormElement>();

// Computed.
const submittingClassName = $derived.by(() => {
  if (submissionState === "submitting") {
    return "opacity-50 pointer-events-none";
  }
});

// Callbacks.
function handleKeyPressed(event: KeyboardEvent): void {
  type InputElement = HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement;
  const isInputElement = (element: Element): element is InputElement => {
    const typesToCheck = [HTMLInputElement, HTMLButtonElement, HTMLSelectElement, HTMLTextAreaElement] as const;
    for (const typeToCheck of typesToCheck) {
      if (document.activeElement?.contains(element) && document.activeElement instanceof typeToCheck) {
        return true;
      }
    }

    return false;
  };

  if (event.key === "Enter") {
    if (submitOnEnterKeyPressed) {
      return;
    }

    event.preventDefault();
    if (document.activeElement && isInputElement(document.activeElement)) {
      document.activeElement.blur();
    }
  }
}

async function handleUpsertingAsync(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  errorCollection.clear();
  submissionState = "submitting";

  try {
    const result = await submitAction();
    onSubmissionSucceeded?.(result);
    submissionState = "submissionSucceeded";
  } catch (error) {
    submissionState = "notSubmitting";
    if (error instanceof ValidationError || error instanceof OperationError) {
      errorCollection.mapFromApplicationError(error);
      onSubmissionFailed?.(error, true);
      return;
    }

    onSubmissionFailed?.(error as Error, false);
    throw error;
  }
}

// Context.
setFormContextPayload({
  get errorCollection(): ErrorCollectionModel {
    return errorCollection;
  },
  get submissionState(): SubmissionState {
    return submissionState;
  },
  get isModelDirty(): boolean | undefined {
    return isModelDirty;
  }
});
</script>

<form
  {...domProps}
  autocomplete={autocomplete}
  bind:this={elementReference}
  class={[
    domProps.class,
    submittingClassName,
    "transition transition-500",
    submissionState === "submitting" && "cursor-wait"
  ]}
  novalidate
  onsubmit={handleUpsertingAsync}
  onkeydown={handleKeyPressed}
>
  {@render children?.(errorCollection)}
</form>
