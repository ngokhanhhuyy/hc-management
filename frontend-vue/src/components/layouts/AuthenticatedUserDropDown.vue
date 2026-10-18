<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type ClassValue } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthenticationStore } from '#/stores';
import { UserIcon } from '@lucide/vue';

// Dependencies.
const router = useRouter();
const authenticationStore = useAuthenticationStore();

// States.
const isUserMenuVisible = ref<boolean>(false);
const elementRef = ref<HTMLDivElement>();
const dropDownContainerClassName = computed<ClassValue>(() => {
  return [
    'bg-white border border-black/25 rounded-lg shadow-lg w-60 h-fit absolute',
    'flex flex-col gap-3 p-3 items-center top-full right-0 mt-1 transition-all origin-top-right',
    !isUserMenuVisible.value && 'opacity-0 scale-90 pointer-events-none'
  ];
});

// Callbacks.
async function clearAccessCookieAsync(): Promise<void> {
  await authenticationStore.signOutAsync();
  router.push({ name: 'signIn' });
}

function handleUserMenuVisibility(event: MouseEvent): void {
  const userMenuContainsClickedElement = elementRef.value?.contains(event.target as Node);
  if (!userMenuContainsClickedElement) {
    isUserMenuVisible.value = false;
  }
};

// Life cycle hooks.
onMounted(() => document.addEventListener('click', handleUserMenuVisibility));
onUnmounted(() => document.removeEventListener('click', handleUserMenuVisibility));
</script>

<template>
  <div class="relative h-full flex justify-start" ref="elementRef">
    <button
      type="button"
      class="btn bg-black/5 hover:bg-black/10 border border-black/10 rounded-full h-full aspect-square"
      @click="() => isUserMenuVisible = !isUserMenuVisible"
    >
      <UserIcon class="opacity-50" />
    </button>

    <div :class="dropDownContainerClassName">
      <div class="avatar">
        <UserIcon class="opacity-25 size-full" :stroke-width="1" />
      </div>

      <span>{{ authenticationStore.authenticatedUser?.userName }}</span>

      <div class="flex justify-between w-full mt-5">
        <button type="button" class="btn btn-sm">
          Đổi mật khẩu
        </button>

        <button type="button" class="btn btn-sm" @click="clearAccessCookieAsync">
          Đăng xuất
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#/assets/css/style.css";

.avatar {
    @apply
      bg-black/5 border border-black/10 w-[50%] aspect-square
      rounded-full p-[15%] flex justify-center items-center;
}
</style>
