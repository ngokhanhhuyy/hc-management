<script lang="ts">
  import type { Component } from "svelte"; 
  import { api, AuthenticationError } from "#/api";
  import { authenticationStore, routerStore } from "#/stores";
  import TopBar from "./TopBar.svelte";
  import NavigationMenu from "./NavigationMenu.svelte";

  // Props.
  let { PageComponent }: { PageComponent: Component } = $props();
  console.log(authenticationStore.isAuthenticated);

  // Callbacks.
  async function clearAccessCookieAsync(): Promise<void> {
    try {
      await api.authentication.clearAccessCookieAsync();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return;
      }

      throw error;
    } finally {
      routerStore.setRoute("SignIn");
    }
  }

  // Effects.
  $effect(() => {
    if (!authenticationStore.isAuthenticated) {
      clearAccessCookieAsync();
    }
  });
</script>

{#if authenticationStore.isAuthenticated}
  <TopBar />
  <div class="hidden lg:grid grid-cols-[200px_1fr] max-w-350 w-full mx-auto gap-3 p-3 mt-(--topbar-height) h-fit">
    <NavigationMenu />
    <PageComponent />
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
