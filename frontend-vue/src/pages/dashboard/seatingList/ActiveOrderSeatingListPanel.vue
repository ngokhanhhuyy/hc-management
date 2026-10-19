<script setup lang="ts">
import { SeatingBasicModel } from '#/models';
import { LayoutGridIcon } from '@lucide/vue';

// Props.
const props = defineProps<{ model: SeatingBasicModel[] }>();
</script>

<template>
  <div class="panel h-fit">
    <div class="panel-header">
      <span class="panel-header-title">
        Bàn ăn đang có khách
      </span>
    </div>

    <div class="panel-body p-3">
      <div class="panel-body-area">
        <ul v-if="!model.length" class="list-group list-group-flush">
          <li v-for="seating in model" :key="seating.id" class="list-group-item item">
            <div class="img-thumbnail size-11 flex justify-center items-center rounded-md">
              <LayoutGridIcon class="opacity-35 size-4.5" :stroke-width="1" />
            </div>

            <div class="flex flex-col flex-1">
              <div class="flex justify-between items-center gap-3">
                <span>{{ seating.name }}</span>
                <span class="alert alert-emerald-outline alert-sm">Đang có khách</span>
              </div>

              <span class="text-sm opacity-50">{{ seating.activeOrder?.displayItemAmount }} vnđ</span>
            </div>
          </li>
        </ul>
        
        <div v-else class="flex justify-center items-center py-10">
          <span class="opacity-50 text-center">
            Tất cả các bàn đều đang trống
          </span>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "#/assets/css/style.css";

.item {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: --spacing(2);
  padding: --spacing(2);
}
</style>
