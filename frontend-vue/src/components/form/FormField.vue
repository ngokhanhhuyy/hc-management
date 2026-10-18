<script lang="ts">
import { inject, provide, type ComputedRef } from 'vue';

export type FormFieldContextPayload = {
  path?: string;
  isValidated: ComputedRef<boolean>;
  hasError: ComputedRef<boolean>;
  displayName: ComputedRef<string | undefined>;
};

const formFieldContextKey = Symbol('form-field-context');

export function getFormFieldContextPayload(): FormFieldContextPayload | undefined {
  return inject(formFieldContextKey);
}
</script>

<script setup lang="ts">
import { computed, type ClassValue } from 'vue';
import { getDisplayNameByKey } from '#/helpers';
import { formContextKey, type FormContextPayload } from './Form.vue';

// Dependencies.
const formContext = inject<FormContextPayload | undefined>(formContextKey, undefined);

// Props.
const props = defineProps<{
  class?: ClassValue;
  path?: string;
  displayName?: string;
  hideLabel?: boolean;
  hideValidationMessage?: boolean;
}>();

const displayName = computed<string | undefined>(() => {
  if (props.displayName) {
    return props.displayName;
  }

  if (!props.path) {
    return undefined;
  }
  
  const pathElements = props.path.split('.');
  if (pathElements.length === 0) {
    return undefined;
  }

  const lastIndexerOmittedPathElement = pathElements[pathElements.length - 1].replace(/\[[0-9]]/g, '');
  return getDisplayNameByKey(lastIndexerOmittedPathElement) ?? undefined;
});

const errorMessage = computed(() => {
  if (!formContext || !formContext.errorCollection.value.isValidated || !props.path) {
    return;
  }

  const messages = formContext.errorCollection.value.details
    .filter(d => d.propertyPath === props.path)
    .map(d => d.message);

  if (messages.length === 0) {
    return;
  }

  return messages[0].replaceAll('{propertyDisplayName}', displayName.value ?? '{propertyDisplayName}');
});

const containerClassName = computed<ClassValue>(() => {
  return [
    'form-field flex flex-col justify-stretched',
    props.class,
    errorMessage.value && 'field-validation-error'
  ];
});

const displayNameLabelClassName = computed<ClassValue>(() => {
  if (!props.hideValidationMessage && errorMessage.value) {
    return 'text-red-900';
  }

  return null;
});

const validationMessageClassName = computed<ClassValue>(() => {
  if (formContext?.errorCollection.value.isValidated) {
    if (errorMessage.value) {
      return 'text-red-600 text-sm';
    }

    return 'text-emerald-600 text-sm';
  }

  return null;
});

// Context.
provide(formFieldContextKey, {
  isValidated: computed(() => !!formContext?.errorCollection.value.isValidated),
  hasError: computed(() => !!errorMessage.value),
  path: props.path,
  displayName: displayName
});
</script>

<template>
  <div :class="containerClassName">
    <label v-if="!props.hideLabel && displayName" :class="displayNameLabelClassName" :for="props.path">
      {{ displayName }}
    </label>

    <slot></slot>

    <span :class="validationMessageClassName">
      {{ errorMessage }}
    </span>
  </div>
</template>
