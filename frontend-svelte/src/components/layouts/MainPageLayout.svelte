<script lang="ts">
  import type { Snippet } from "svelte"; 
  import { api } from "#/api";
  import { authenticationStore, routerStore } from "#/stores";
  import TopBar from "./TopBar.svelte";
  import NavigationMenu from "./NavigationMenu.svelte";

  // Props.
  let props: { children: Snippet } = $props();

  // Effects.
  $effect(() => {
    console.log(authenticationStore.isAuthenticated);
    if (!authenticationStore.isAuthenticated) {
      api.authentication.clearAccessCookieAsync().finally(() => routerStore.setRoute("SignIn"));
    }
  });
</script>

{#if authenticationStore.isAuthenticated}
  <TopBar />

  <div class="hidden lg:grid grid-cols-[200px_1fr] max-w-350 w-full mx-auto gap-3 p-3 mt-(--topbar-height) h-fit">
    <NavigationMenu />
    {@render props.children()}
  </div>

  <div class="flex flex-col lg:hidden justify-center items-center size-full opacity-30">
    <span class="text-2xl">
      Ứng dụng không hỗ trợ kích thước màn hình này
    </span>

    <span class="text-lg">
      Vui lòng sử dụng màn hình có kích thước lớn hơn
    </span>
  </div>
{/if}
