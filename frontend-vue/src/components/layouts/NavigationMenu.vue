<script setup lang="ts">
import NavigationMenuItem from './NavigationMenuItem.vue';
import { LayoutGridIcon, ShoppingCartPlusIcon, Dice4Icon, SoupIcon, TagIcon } from '@lucide/vue';
</script>

<template>
  <nav class="flex flex-col gap-10 sticky top-[calc(var(--topbar-height)+(--spacing(3)))] h-fit">
    <div class="flex flex-col">
      <span class="text-sm font-bold opacity-50">Vận hành</span>
      <ul class="list-group list-group-flush">
        <NavigationMenuItem displayName="Danh sách bàn ăn" :route="{ name: 'seatingList' }">
          <template v-slot="props">
            <LayoutGridIcon v-bind="props" />
          </template>
        </NavigationMenuItem>
        
        <NavigationMenuItem displayName="Gọi món" :route="{ name: 'orderUpsert' }">
          <template v-slot="props">
            <ShoppingCartPlusIcon v-bind="props" />
          </template>
        </NavigationMenuItem>
      </ul>
    </div>

    <div class="flex flex-col">
      <span class="text-sm font-bold opacity-50">Vận hành</span>
      <ul class="list-group list-group-flush">
        <NavigationMenuItem displayName="Chỉnh sửa bàn ăn" :route="{ name: 'seatingEditor' }">
          <template v-slot="props">
            <Dice4Icon v-bind="props" />
          </template>
        </NavigationMenuItem>

        <NavigationMenuItem displayName="Chỉnh sửa món ăn" :route="{ name: 'menuItemEditor' }">
          <template v-slot="props">
            <SoupIcon v-bind="props" />
          </template>
        </NavigationMenuItem>

        <NavigationMenuItem displayName="Chỉnh sửa phân loại" :route="{ name: 'menuCategoryEditor' }">
          <template v-slot="props">
            <TagIcon v-bind="props" />
          </template>
        </NavigationMenuItem>
      </ul>
    </div>
  </nav>
</template>
