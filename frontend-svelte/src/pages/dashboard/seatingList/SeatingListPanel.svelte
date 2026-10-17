<script lang="ts">
  import { routerStore } from "#/stores";
  import type { SeatingBasicModel } from "#/models";
  import { Form, FormField, TextInput } from "#/components/form";
  import SeatingListItem from "./SeatingListItem.svelte";
  import { SearchIcon, XIcon } from "@lucide/svelte";

  // Props.
  let props: { model: SeatingBasicModel[] } = $props();

  // States.
  let searchContent = $state<string>("");

</script>


<div class="panel">
  <div class="panel-header">
    <span class="panel-header-title">
      Danh sách bàn ăn
    </span>
  </div>

  <div class="panel-body flex flex-col">
    <div class="p-3 border-b border-black/10">
      <div class="panel-body-area flex flex-col gap-3 p-3">
        <FormField path="searchContent">
          <div class="form-input-group group">
            <span class="form-input-group-text px-2">
              <SearchIcon class="size-4.5 opacity-50" />
            </span>

            <TextInput
              class={["z-0", searchContent && "not-focus:border-e-transparent"]}
              bind:value={searchContent}
            />

            {#if searchContent}
              <button
                type="button"
                class="btn btn-danger-outline group-has-[input:focus]:border-s-transparent"
                onclick={() => searchContent = ""}
              >
                <XIcon />
              </button>
            {/if}
          </div>
        </FormField>
      </div>
    </div>

    <div class="grid xl:grid-cols-5 lg:grid-cols-4 items-start gap-3 p-3">
      {#each props.model as seating (seating.id)}
        <SeatingListItem
          model={seating}
          onClick={() => routerStore.setRoute("OrderUpsert", { id: seating.id })}
        />
      {/each}
    </div>
  </div>
</div>
