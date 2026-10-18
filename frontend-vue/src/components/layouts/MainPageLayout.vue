<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuthenticationStore } from '#/stores/authenticationStore.ts';
import TopBar from './TopBar.vue';
import NavigationMenu from './NavigationMenu.vue';

// Dependencies.
const authenticationStore = useAuthenticationStore();
</script>

<template>
  <template v-if="authenticationStore.isAuthenticated">
    <TopBar />
    <div class="hidden lg:grid grid-cols-[200px_1fr] max-w-350 w-full mx-auto gap-3 p-3 mt-(--topbar-height) h-fit">
      <NavigationMenu />
      <RouterView />
    </div>

    <div class="flex flex-col lg:hidden justify-center items-center size-full opacity-30">
      <span class="text-2xl">
        Ứng dụng không hỗ trợ kích thước màn hình này
      </span>

      <span class="text-lg">
        Vui lòng sử dụng màn hình có kích thước lớn hơn
      </span>
    </div>
  </template>
</template>
