<script setup lang="ts">
import { computed, type ClassValue } from 'vue';
import type { MenuCategoryBasicModel } from '#/models';

// Props and emits.
const props = defineProps<{
  model: MenuCategoryBasicModel | null;
  isSelected: boolean;
}>();

const emit = defineEmits<{
  selected: [];
}>();

// Computed.
const className = computed<ClassValue>(() => ['menu-category-button', props.isSelected && 'selected']);
</script>

<template>
  <button type="button" :class="className" @click="emit('selected')">
    {{props.model?.name ?? "Tất cả"}}
  </button>
</template>

<style scoped>
@import '#/assets/css/style.css';

.menu-category-button {
  @apply btn;
  flex: none;
  width: fit-content;
  border-radius: var(--radius-lg);
  padding: --spacing(3);
  cursor: pointer;
  white-space: nowrap;
  min-width: --spacing(20);
  transition-property: background-color, border-color, color, shadow;
  transition-duration: .2s;
}

.menu-category-button.selected {
  @apply btn-primary;
  box-shadow: var(--shadow-xs);
}

.menu-category-button:not(:is(.selected)) {
  @apply btn-primary-outline;
  box-shadow: none;
}
</style>
