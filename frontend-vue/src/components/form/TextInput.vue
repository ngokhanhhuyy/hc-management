<script setup lang="ts">
import { computed, type ClassValue } from 'vue';
import { getFormFieldContextPayload } from './FormField.vue';

// Dependencies.
const formFieldContext = getFormFieldContextPayload();

// Props.
type TextInputProps = {
  type?: 'text' | 'password' | 'tel' | 'email';
  class?: ClassValue;
  placeholder?: string;
};

const props = withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
  placeholder: undefined,
});

// Models.
const model = defineModel<string>({ required: true });

// Computed.
const placeholder = computed<string | undefined>(() => {
  return props.placeholder ?? formFieldContext?.displayName.value;
});
</script>

<template>
  <input v-model="model" v-bind="props" :name="formFieldContext?.path" :placeholder class="form-control" />
</template>
