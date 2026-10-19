<script setup lang="ts">
import { computed, onMounted, useTemplateRef, type ClassValue } from 'vue';
import { getFormFieldContextPayload } from './FormField.vue';

// Dependencies.
const formFieldContext = getFormFieldContextPayload();

// Props.
const props = defineProps<{
  class: ClassValue;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  autoFocus?: boolean;
}>();

// Model and states.
const model = defineModel<number>({ required: true });
const elementRef = useTemplateRef('elementRef');

// Computed.
const value = computed<string>(() => model.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
const name = computed<string | undefined>(() => formFieldContext?.path);
const className = computed<ClassValue>(() => ['form-control', props.class]);
const placeholder = computed<string | undefined>(() => props.placeholder ?? formFieldContext?.displayName.value);

// Callbacks.
function handleInput(event: InputEvent): void {
  const inputElement = event.target as HTMLInputElement;
  if (!inputElement.value.length) {
    model.value = 0;
    return;
  }

  if (!/[0-9\s]+/g.test(inputElement.value)) {
    return;
  }
  
  const parsedValue = parseInt(inputElement.value.replaceAll(' ', ''));
  if (props.min != null && parsedValue < props.min) {
    model.value = props.min;
    return;
  }

  if (props.max != null && parsedValue > props.max) {
    model.value = props.max;
    return;
  }

  model.value = parsedValue;
}

// Life cycle hooks.
onMounted(() => {
  if (props.autoFocus) {
    elementRef.value?.focus();
  }
});
</script>

<template>
  <input ref="elementRef" :name :class="className" :placeholder :value @input="handleInput" />
</template>
