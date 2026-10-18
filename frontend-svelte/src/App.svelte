<script lang="ts">
  import type { Component } from "svelte";
  import { authenticationStore, routerStore, type RouteName } from "./stores";
  import MainPageLayout from "#/components/layouts/MainPageLayout.svelte";

  // Computed.=
  const pagesByRouteName: Record<RouteName, Promise<{ default: Component }>> = {
    "SignIn": import("#/pages/authentication/SignInPage.svelte"),
    "SeatingList": import("#/pages/dashboard/seatingList/SeatingListPage.svelte"),
    "OrderUpsert": import("#/pages/Blank.svelte"),
    "MenuItemEditor": import("#/pages/Blank.svelte"),
    "MenuCategoryEditor": import("#/pages/Blank.svelte"),
    "SeatingEditor": import("#/pages/Blank.svelte"),
    "Report": import("#/pages/Blank.svelte"),
  };

  const PagePromise = $derived(pagesByRouteName[routerStore.routeName]);
</script>

{#await PagePromise then { default: Page }}
  {#if routerStore.routeName === "SignIn" && !authenticationStore.isAuthenticated}
    <Page />
  {:else}
    <MainPageLayout PageComponent={Page} />
  {/if}
{/await}
