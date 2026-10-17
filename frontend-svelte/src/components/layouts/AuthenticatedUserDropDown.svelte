<script lang="ts">
  import { authenticationStore } from "#/stores";
  import { User as UserIcon } from "@lucide/svelte/icons";

  // States.
  let isUserMenuVisible = $state<boolean>(false);
  // let isChangePasswordForModalOpened = $state<boolean>(false);
  let userMenuContainerElementReference = $state<HTMLDivElement | null>(null);

  // Callbacks.
</script>

<div class="relative h-full flex justify-start" bind:this={userMenuContainerElementReference}>
  <button
    type="button"
    class="btn bg-black/5 hover:bg-black/10 border border-black/10 rounded-full h-full aspect-square"
    onclick={() => isUserMenuVisible = !isUserMenuVisible}
  >
    <UserIcon class="opacity-50" />
  </button>

  {#if isUserMenuVisible}
    <div class={[
      "bg-white border border-black/25 rounded-lg shadow-lg w-60 h-fit absolute",
      "flex flex-col gap-3 p-3 items-center top-full right-0 mt-1"
    ]}>
      <div class="bg-black/5 border border-black/10 w-[50%] aspect-square rounded-full p-[15%]">
        <UserIcon class="opacity-50" />
      </div>

      <span>{authenticationStore.authenticatedUser?.userName}</span>

      <div class="flex justify-between w-full mt-5">
        <button type="button" class="btn btn-sm">
          Đổi mật khẩu
        </button>

        <button
          type="button"
          class="btn btn-sm"
          onclick={() => authenticationStore.setAuthenticatedUser(null)}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  {/if}
</div>
