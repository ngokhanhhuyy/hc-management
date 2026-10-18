<script setup lang="ts">
import { SeatingBasicModel } from '#/models';
import { LayoutGridIcon } from '@lucide/vue';

// Props.
const props = defineProps<{ model: SeatingBasicModel[] }>();
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <span class="panel-header-title">
        Bàn ăn đang có khách
      </span>
    </div>

    <div class="panel-body p-3">
      <div class="panel-body-area p-3">
        <ul class="list-group list-group-flush">
          <li v-for="seating in model" :key="seating.id" class="list-group-item flex justify-start items-start gap-3">
            <div class="img-thumbnail size-11 flex justify-center items-center rounded-md">
              <LayoutGridIcon class="opacity-50 size-4" :stroke-width="1" />
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
      </div>
    </div>
  </div>
</template>
