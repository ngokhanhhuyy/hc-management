<script setup lang="ts">
import {  computed } from 'vue';
import { useRouter, useRoute, type RouteLocationNamedRaw } from 'vue-router';

// Dependencies.
const router = useRouter();
const route = useRoute();

// Props.
const props = defineProps<{
  displayName: string;
  route: RouteLocationNamedRaw;
}>();

// Computed.
const isActive = computed(() => route.name === props.route.name);
const isDisabled = computed(() => route.matched.some(({ name }) => name === props.route.name));
const tabIndex = computed(() => isDisabled.value ? -1 : undefined);

const className = computed<string>(() => {
  const names = ['flex items-center gap-2 hover:no-underline px-2 py-1.5 border rounded-lg w-full'];
  if (isActive.value) {
    names.push('bg-white border-black/20 font-bold text-blue-700');
  } else {
    names.push('border-transparent text-black/75');
    if (!isDisabled.value) {
      names.push('hover:bg-black/5 cursor-pointer');
    } else {
      names.push('pointer-events-none opacity-50');
    }
  }

  if (!isDisabled.value) {
    names.push('hover:text-blue-700');
  }

  return names.join(' ');
});

// Callbacks.
function handleClicked(): void {
  router.push(props.route);
}
</script>

<template>
  <button type="button" :class="className" :tabindex="tabIndex" @click="handleClicked">
    <slot class="size-4"></slot>
    <span>{{ displayName }}</span>
  </button>
</template>
