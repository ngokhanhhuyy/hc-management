<script lang="ts">
import { computed, type ClassValue } from 'vue';
import { getPaginationRange, joinClassName, type PaginationRange } from "#/helpers";

// Props and emits.
type PaginationRanges = {
  smScreen: PaginationRange,
  xsScreen: PaginationRange,
};

const { page: currentPage, pageCount, ...props } = defineProps<{
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

const isPageExceedingXsScreenRange = (page: number) => {
  return page < paginationRanges.value.xsScreen.startingPage || page > paginationRanges.value.xsScreen.endingPage;
};

const isPageExceedingSmScreenRange = (page: number) => {
  return page < paginationRanges.value.smScreen.startingPage || page > paginationRanges.value.smScreen.endingPage;
};

// Callbacks.
const handlePageButtonClick = (page: number): void => {
  emit('changed', page);
};


</script>
