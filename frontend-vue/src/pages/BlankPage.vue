<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <RouterLink class="btn" :to="{ name: 'signIn' }">
    Đăng xuất
  </RouterLink>
</template>
