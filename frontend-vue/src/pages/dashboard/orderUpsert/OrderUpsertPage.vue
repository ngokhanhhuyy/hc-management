<script setup lang="ts">
import { ref, reactive, computed, type ClassValue } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '#/api';
import { OrderItemUpsertModel, OrderUpsertModel } from '#/models';
import MenuItemPanel from './menuItemPanel/MenuItemPanel.vue';

// Dependencies.
const route = useRoute();

// Types.
export type LoadingState = 'syncing' | 'finishing' | 'finished' | null;

// States.
const loadingState = ref<LoadingState>(null);
const model = reactive<OrderUpsertModel>(await initialLoadAsync());

// Computed.
const className = computed<ClassValue>(() => [
  'grid grid-cols-[1fr_320px] gap-3 h-full transition-opacity',
  loadingState.value === 'syncing' && 'opacity-50 pe-none'
]);

// Callbacks.
async function initialLoadAsync(): Promise<OrderUpsertModel> {
  const seatingId = parseInt(route.params.id as string);
  const seatingDetailResponseDto = await api.seating.getDetailAsync(seatingId);

  const model = new OrderUpsertModel(seatingDetailResponseDto);
  if (seatingDetailResponseDto.activeOrder) {
    const orderDetailResponseDto = await api.order.getDetailAsync(seatingDetailResponseDto.activeOrder.id);
    model.mapFromResponseDto(orderDetailResponseDto);
  }

  return model;
}
</script>

<template>
  <div :class="className">
    <MenuItemPanel
      :picked-order-items="model.items"
      :disabled="loadingState === 'finished'"
      @picked="(pickedMenuItem) => model.items.push(new OrderItemUpsertModel(pickedMenuItem))"
    />
  </div>
</template>
