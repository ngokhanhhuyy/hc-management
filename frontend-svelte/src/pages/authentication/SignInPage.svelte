<script lang="ts">
  import { api } from "#/api";
  import { SignInModel } from "#/models";
  import { authenticationStore, routerStore } from "#/stores";
  import { Form, FormField, TextInput } from "#/components/form";
  import logoUrl from "#/assets/images/logo.png";

  // States.
  const model = new SignInModel();
  let isAuthenticated = $state(false);

  // Callbacks.
  async function submitAsync(): Promise<void> {
    await api.authentication.getAccessCookieAsync(model.toRequestDto());
    model.password = "";
  }

  async function handleSubmissionSucceededAsync(): Promise<void> {
    const detailResponseDto = await api.authentication.getCallerDetailAsync();
    authenticationStore.setAuthenticatedUser(detailResponseDto);
    isAuthenticated = true;
    routerStore.setRoute("SeatingList");
  }
</script>

<div class="flex justify-center items-cente w-full h-fit self-center">
  <Form
    id="sign-in-form"
    class="panel"
    submitAction={submitAsync}
    onSubmissionSucceeded={handleSubmissionSucceededAsync}
    submitOnEnterKeyPressed
  >
    {#if !isAuthenticated}
      <div class="panel-body flex flex-col p-3 gap-3 min-w-75">
        <img src={logoUrl} class="img-thumbnail aspect-square shadow-xs" alt="HCManagement" />

        <FormField path="userName">
          <TextInput bind:value={model.userName} />
        </FormField>

        <FormField path="password">
          <TextInput type="password" bind:value={model.password} />
        </FormField>

        <button type="submit" class="btn bg-black text-white mt-3">
          Đăng nhập
        </button>
      </div>
    {:else}
      <div class="bg-emerald-600/5 border border-emerald-600 p-3 rounded-lg flex justify-center text-bold">
        Đăng nhập thành công
      </div>
    {/if}
  </Form>
</div>

<style>
  :global(#sign-in-form) {
    max-width: 350px;
  }
</style>
