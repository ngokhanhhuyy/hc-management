<script>
  import { routerStore } from "#/stores";
</script>

<div>
  <button type="button" class="btn" onclick={() => routerStore.setRoute("SignIn")}>
    Sign out
  </button>
</div>
