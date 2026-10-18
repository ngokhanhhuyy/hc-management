<script setup lang="ts">
import { Suspense } from 'vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <main class="w-full h-full">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </RouterView>
  </main>
</template>
