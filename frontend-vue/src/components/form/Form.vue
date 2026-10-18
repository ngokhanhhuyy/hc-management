<script lang="ts">
import { provide, inject, type Ref, type ComputedRef } from 'vue';

// Type.
export type SubmissionState = 'notSubmitting' | 'submitting' | 'submissionSucceeded';
export type FormContextPayload = {
  errorCollection: Ref<ErrorCollectionModel>;
  submissionState: Ref<SubmissionState>;
  isModelDirty: ComputedRef<boolean | null>;
};

// Context.
export const formContextKey = Symbol('form-context');

export function getFormContextPayload(): Readonly<FormContextPayload> | undefined {
  return inject<FormContextPayload>(formContextKey);
}

function setFormContextPayload(payload: FormContextPayload): void {
  provide(formContextKey, payload);
}
</script>

<script setup lang="ts" generic="TUpsertResult">
import { ref, computed, type ClassValue } from 'vue';
import { ValidationError, OperationError } from '#/api';
import { ErrorCollectionModel } from '#/models';

// Props and emits.
const props = withDefaults(defineProps<{
  class?: ClassValue;
  action: () => Promise<TUpsertResult>;
  isModelDirty?: boolean;
  submitOnEnterKeyPressed?: boolean;
}>(), {
  autocompletion: 'off',
  submitOnEnterKeyPressed: false
});

const emit = defineEmits<{
  succeeded: [result: TUpsertResult],
  failed: [error: Error, errorHandled: boolean]
}>();

// States.
const errorCollection = ref(new ErrorCollectionModel());
const submissionState = ref<SubmissionState>('notSubmitting');

// Computed.
const className = computed<(ClassValue | undefined)[]>(() => {
  const names = [props.class, 'transition transition-500'];
  
  if (submissionState.value === 'submitting') {
    names.push('opacity-50 pointer-events-none cursor-wait');
  }

  return names;
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

  if (event.key === 'Enter') {
    if (props.submitOnEnterKeyPressed) {
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
  errorCollection.value.clear();
  submissionState.value = 'submitting';

  try {
    const result = await props.action();
    emit('succeeded', result);
    submissionState.value = 'submissionSucceeded';
  } catch (error) {
    submissionState.value = 'notSubmitting';
    if (error instanceof ValidationError || error instanceof OperationError) {
      errorCollection.value.mapFromApplicationError(error);
      emit('failed', error, true);
      return;
    }

      emit('failed', error as Error, false);
    throw error;
  }
}

// Context.
setFormContextPayload({
  errorCollection: errorCollection,
  submissionState: submissionState,
  isModelDirty: computed(() => props.isModelDirty ?? null),
});
</script>

<template>
  <form
    :class="className"
    @submit="handleUpsertingAsync"
    @keydown="handleKeyPressed"
    autocomplete="off"
    novalidate
  >
    <slot :error-collection="errorCollection"></slot>
  </form>
</template>>
