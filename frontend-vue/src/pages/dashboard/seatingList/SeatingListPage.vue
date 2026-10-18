<script setup lang="ts">
import { ref, computed } from 'vue';
import { api } from '#/api';
import { SeatingBasicModel } from '#/models';
import SeatingListPanel from './SeatingListPanel.vue';
import ActiveOrderSeatingListPanel from './ActiveOrderSeatingListPanel.vue';

// States.
const model = ref<SeatingBasicModel[]>(await loadAsync());

// Computed.
const activeOrderSeatings = computed<SeatingBasicModel[]>(() => {
  return model.value.filter(seating => seating.activeOrder);
});

// Callbacks.
async function loadAsync(): Promise<SeatingBasicModel[]> {
  const responseDtos = await api.seating.getAllAsync();
  return responseDtos.map(dto => new SeatingBasicModel(dto));
}
</script>

<template>
  <div class="grid grid-cols-[2.5fr_1fr] gap-3">
    <SeatingListPanel :model="model" />
    <ActiveOrderSeatingListPanel :model="activeOrderSeatings" />
  </div>
</template>
