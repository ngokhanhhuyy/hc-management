<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";
  import { getFormFieldContextPayload } from "./FormField.svelte";

  // Depenedencies.
  let formFieldPayload = getFormFieldContextPayload();

  // Props.
  let {
    autocomplete = "off",
    value = $bindable(""),
    ...props
  }: {
    type?: "text" | "password" | "tel" | "email";
    value?: string;
  } & Omit<SvelteHTMLElements["input"], "type" | "value"> = $props();
</script>

<input
  {...props}
  autocomplete={autocomplete}
  name={formFieldPayload.path}
  class={["form-control", props.class]}
  placeholder={props.placeholder ?? formFieldPayload.displayName}
  bind:value
/>
