<script setup lang="ts">
import { computed, type ClassValue } from 'vue';
import type { PaginationRanges } from './Paginator.vue';

// Props.
const { class: className, page, paginationRanges } = defineProps<{
  class?: ClassValue;
  page: number;
  paginationRanges: PaginationRanges;
}>();

const emit = defineEmits<{ clicked: [] }>();

// Computed.
const isPageExceedingXsScreenRange = computed<boolean>(() => {
  return page < paginationRanges.xsScreen.startingPage || page > paginationRanges.xsScreen.endingPage;
});

const computedClassName = computed<ClassValue>(() => [
  'min-w-8.5',
  isPageExceedingXsScreenRange.value && 'hidden sm:flex',
  className
]);
</script>

<template>
  <button type="button" :class="computedClassName" @click="emit('clicked')"">
    {{ page }}
  </button>
</template>
