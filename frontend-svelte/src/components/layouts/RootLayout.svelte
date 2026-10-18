<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
</script>

<main class="w-full h-full">
  {@render children()}
</main>
