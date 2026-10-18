<script setup lang="ts">
import { SeatingBasicModel } from '#/models';
import { LayoutGridIcon } from '@lucide/vue';

// Props and emits.
const props = defineProps<{ model: SeatingBasicModel }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button type="button" class="seating-item-button" @click="emit('click')">
    <div class="seating-item-button-icon-container">
      <LayoutGridIcon
        class="size-6 opacity-25 in-[.seating-list-item:hover]:opacity-50 transition-all"
        :stroke-width="1.25"
      />
    </div>

    <div class="seating-item-button-name-container">
      <span>{{ props.model.name }}</span>
      <div v-if="model.activeOrder" class="alert alert-emerald-outline in-[.seating-list-item:hover]:alert-emerald">
        Có khách
      </div>
    </div>
  </button>
</template>

<style>
@import "#/assets/css/style.css";

.seating-item-button {
  border: 1px solid --alpha(var(--color-black) / 15%);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: .2s;
  height: 100%;
  overflow: hidden;
}

.seating-item-button:hover {
  border-color: --alpha(var(--color-blue-600) / 75%);
  box-shadow: var(--shadow-lg);
}

.seating-item-button-icon-container {
  background-color: --alpha(var(--color-black) / 5%);
  border-bottom: 1px solid --alpha(var(--color-black) / 15%);
  aspect-ratio: 2 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .2s;
}

.seating-item-button:hover .seating-item-button-icon-container {
  background-color: --alpha(var(--color-blue-600) / 25%);
  color: var(--color-blue-600);
  border-color: --alpha(var(--color-blue-600) / 25%);
}

.seating-item-button-name-container {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: --spacing(2);
  transition-property: background-color, color;
  transition-duration: .2s;
}

.seating-item-button:hover .seating-item-button-name-container {
  background-color: --alpha(var(--color-blue-600) / 10%);
  color: var(--color-blue-600);
}
</style>
