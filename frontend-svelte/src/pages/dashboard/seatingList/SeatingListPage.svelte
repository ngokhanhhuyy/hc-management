<script lang="ts">
  import { onMount } from "svelte";
  import { api } from "#/api";
  import { SeatingBasicModel } from "#/models";
  import SeatingListPanel from "./SeatingListPanel.svelte";

  // States.
  let model = $state<SeatingBasicModel[]>([]);

  // Callbacks.
  async function loadAsync(): Promise<void> {
    const responseDtos = await api.seating.getAllAsync();
    model = responseDtos.map(dto => new SeatingBasicModel(dto));
  }

  // Life cycle hooks.
  onMount(() => {
    loadAsync();
  });
</script>

<div class="grid grid-cols-[3fr_1fr]">
  <SeatingListPanel model={model} />
</div>
