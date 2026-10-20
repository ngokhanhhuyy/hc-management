<script setup lang="ts">
import { computed, type ClassValue } from 'vue';
import type { MenuItemBasicModel, OrderItemUpsertModel } from '#/models';
import { getDisplayAmountText } from '#/helpers';

// Props and emits.
const props = defineProps<{
  model: MenuItemBasicModel;
  pickedOrderItems: OrderItemUpsertModel[];
  class?: ClassValue;
}>();

const emit = defineEmits<{ click: [] }>();

// Computed.
const pickedQuantity = computed(() => {
  return props.pickedOrderItems
    .filter(pi => pi.menuItem.id == props.model.id)
    .reduce((total, item) => total + item.quantity, 0);
});
</script>

<template>
  <button class="menu-item-button" :class="props.class" @click="emit('click')">
    <div class="icon-container">
      <FoodIcon class="icon" />
    </div>

    <div class="info-container">
      <span class="fw-bold">
        {{ props.model.name }}
      </span>

      <div class="flex justify-between gap-2 w-full">
        <span class="amount-alert">
          {{ getDisplayAmountText(props.model.defaultAmountBeforeVatPerUnit, { suffix: " vnđ" }) }}
        </span>

        <span v-if="props.model.defaultVatPercentagePerUnit" class="vat-alert">
          {{ props.model.defaultVatPercentagePerUnit }}%
        </span>
      </div>
    </div>
    
    <div v-if="pickedQuantity > 0" class="picked-quantity-alert">
      {{pickedQuantity}}
    </div>
  </button>
</template>

<style scoped>
@import '#/assets/css/style.css';

.menu-item-button {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  height: 100%;
  cursor: pointer;
  transition: shadow .15s;
  border: 1px solid --alpha(var(--color-black) / 10%);
  border-radius: var(--radius-lg);
  position: relative;
}

.icon-container {
  background-color: --alpha(var(--color-black) / 5%);
  border-bottom: 1px solid --alpha(var(--color-black) / 10%);
  display: flex;
  justify-content: center;
  align-items: center;
  transition-property: background-color, border-color;
  transition-duration: .15s;
  aspect-ratio: 2 / 1;
}

.menu-item-button:hover .icon-container {
  background-color: --alpha(var(--color-blue-600) / 25%);
  border-color: --alpha(var(--color-blue-600) / 20%);
}

.icon {
  width: --spacing(6);
  height: --spacing(6);
  opacity: 25%;
  transition-property: fill, opacity;
  transition-duration: .15s;
}

.menu-item-button:hover .icon {
  fill: var(--color-blue-600);
  opacity: 50%;
}

.info-container {
  background-color: white;
  padding: --spacing(2);
  padding-top: --spacing(1);
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: start;
  transition: background-color .15s;
  text-align: start;
}

.menu-item-button:hover .info-container {
  background-color: --alpha(var(--color-blue-600) / 10%);
}

.amount-alert {
  transition-property: background-color, border-color, color;
  transition-duration: .15s;
  @apply alert alert-blue-outline alert-sm;
}

.menu-item-button:hover .amount-alert {
  @apply alert-blue;
}

.vat-alert {
  @apply alert alert-emerald-outline alert-sm;
}

.menu-item-button:hover .vat-alert {
  @apply alert-emerald;
}

.picked-quantity-alert {
  @apply alert alert-red-outline alert-sm;
  position: absolute;
  top: --spacing(1.5);
  right: --spacing(1.5);
  min-width: --spacing(5);
}

.menu-item-button:hover .picked-quantity-alert {
  @apply alert-red;
}

.amount-alert, .vat-alert, .picked-quantity-alert {
  transition-property: background-color, border-color, color;
  transition-duration: .15s;
}
</style>
