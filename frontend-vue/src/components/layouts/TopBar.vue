<script setup lang="ts">
  import logoUrl from '#/assets/images/logo.png';
  import AuthenticatedUserDropDown from './AuthenticatedUserDropDown.vue';
</script>

<template>
  <div class="bg-white border-b border-black/15 fixed top-0 left-0 w-full h-(--topbar-height) z-10">
    <div class="flex justify-between gap-5 items-center p-2 max-w-350 mx-auto h-full">
      <div class="flex gap-3 items-center h-full">
        <img :src="logoUrl" class="h-full rounded-full m-0.5" alt="Quán nhậu sân vườ" />
        <div class="flex flex-col">
          <span class="uppercase">Quán nhậu sân vườn</span>
          <span class="text-sm opacity-50">04 Trịnh Tố Tâm, BMT</span>
        </div>
      </div>

      <AuthenticatedUserDropDown />
    </div>
  </div>
</template>
