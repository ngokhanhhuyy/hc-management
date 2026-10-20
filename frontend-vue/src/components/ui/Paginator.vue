<script setup lang="ts">
import { computed, type ClassValue } from 'vue';
import { getPaginationRange, type PaginationRange } from '#/helpers';
import PaginatorButton from './PaginatorButton.vue';

// Props and emits.
export type PaginationRanges = {
  smScreen: PaginationRange,
  xsScreen: PaginationRange,
};

const { page: currentPage, pageCount, ...props } = defineProps<{
  class?: ClassValue;
  page: number;
  pageCount: number;
  pageButtonClassName?: (page: number, isActive: boolean) => ClassValue;
}>();

const emit = defineEmits<{
  changed: [page: number];
}>();

// Computed.
const paginationRanges = computed<PaginationRanges>(() => ({
  smScreen: getPaginationRange({
    currentPage,
    pageCount,
    visibleButtons: 5
  }),
  xsScreen: getPaginationRange({
    currentPage,
    pageCount,
    visibleButtons: 3
  }),
}));

const pageSeries = computed<number[]>(() => {
  const startingPage = paginationRanges.value.smScreen.startingPage;
  const endingPage = paginationRanges.value.smScreen.endingPage;
  const arrayLength = endingPage - (startingPage - 1);

  return Array.from({ length: arrayLength }, (_, index) => index + startingPage);
});

const isPageExceedingXsScreenRange = (page: number): boolean => {
  return page < paginationRanges.value.xsScreen.startingPage || page > paginationRanges.value.xsScreen.endingPage;
};

const isPageExceedingSmScreenRange = (page: number): boolean => {
  return page < paginationRanges.value.smScreen.startingPage || page > paginationRanges.value.smScreen.endingPage;
};

const computeEdgeButtonContainerClassName = (page: number): ClassValue => ([
  'flex gap-2',
  !isPageExceedingXsScreenRange(page) && 'hidden'
]);

const computeEdgeButtonClassName = (page: number): ClassValue => {
  return props.pageButtonClassName?.(page, currentPage === page);
};
</script>

<template>
  <div :class="[props.class, 'flex flex-row justify-center gap-2']">
    <div v-if="isPageExceedingSmScreenRange(1)" :class="computeEdgeButtonContainerClassName(1)">
      <button type="button" :class="computeEdgeButtonClassName(1)" @clicked="emit('changed', page)">
        1
      </button>
      <span>...</span>
    </div>

    <PaginatorButton v-for="page in pageSeries" :key="page" :page :pagination-ranges="paginationRanges" />

    <div v-if="isPageExceedingSmScreenRange(pageCount)" :class="computeEdgeButtonContainerClassName(pageCount)">
      <button type="button" :class="computeEdgeButtonClassName(pageCount)" @clicked="emit('changed', page)">
        {{ pageCount }}
      </button>
      <span>...</span>
    </div>
  </div>
</template>
