<script lang="ts">
  import type { Snippet } from "svelte";
  import { routerStore, type RouteName } from "#/stores";
  import { getDisplayNameByKey } from "#/helpers";
  
  // Props.
  const props: {
    displayName?: string;
    routeName: RouteName;
    children: Snippet<[string | undefined]>;
  } = $props();

  // Computed.
  const displayName = $derived(props.displayName ?? getDisplayNameByKey(props.routeName) ?? "");
  const isActive = $derived(routerStore.routeName === props.routeName);
  const isDisabled = $derived(props.routeName === "OrderUpsert");

  const className = $derived.by<string>(() => {
    const names = ["flex items-center gap-2 hover:no-underline px-2 py-1.5 border rounded-lg w-full"];
    if (isActive) {
      names.push("bg-white border-black/20 font-bold text-blue-700");
    } else {
      names.push("border-transparent text-black/75");
      if (!isDisabled) {
        names.push("hover:bg-black/5 cursor-pointer");
      } else {
        names.push("pointer-events-none opacity-50");
      }
    }

    if (!isDisabled) {
      names.push("hover:text-blue-700");
    }

    return names.join(" ");
  });

  // Callbacks.
  function handleClicked(): void {
    routerStore.setRoute(props.routeName);
  }
</script>

<button type="button" class={className} tabindex={isDisabled ? -1 : undefined} onclick={handleClicked}>
  {@render props.children("size-4")}
  <span>{displayName}</span>
</button>
