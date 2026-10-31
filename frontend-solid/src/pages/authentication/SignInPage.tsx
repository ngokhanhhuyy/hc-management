import { useNavigate } from "@solidjs/router";
import { SignInModel } from "#/models";
import { useAuthenticationStore } from "#/stores";
import { getHomeRoutePath, joinClassName } from "#/helpers";
import logoUrl from "#/assets/images/logo.png";

// Child components.
import { Form, FormField, TextInput } from "#/components/form";

// Components.
export default function SignInPage(): JSXElement {
  // Dependencies.
  const navigate = useNavigate();
  const authenticationStore = useAuthenticationStore();

  // States.
  const model = $state<SignInModel>(new SignInModel());
  let isSignedIn = $state<boolean>(false);

  // Callbacks.
  async function submitAsync(): Promise<void> {
    await authenticationStore.signInAsync(model);
    model.password = "";
  }

  async function handledSucceeded(): Promise<void> {
    isSignedIn = true;

    setTimeout(() => {
      navigate(getHomeRoutePath());
    }, 1500);
  }

  // Effects.
  $mount(() => {
    if (authenticationStore.isAuthenticated) {
      navigate(getHomeRoutePath());
    }
  });

  // Templates.
  return (
    <div class="flex justify-center items-center w-full h-full">
      <Form class="panel max-w-87.5" action={submitAsync} onSucceeded={handledSucceeded} submitOnEnterKeyPressed>
        <div class="panel-body flex flex-col p-3 gap-3 min-w-75">
          <img src={logoUrl} class="img-thumbnail aspect-square shadow-xs" /> 
          <Show when={!isSignedIn} fallback={<SignedInSuccessNotification />}>
            <FormField path="userName">
              <TextInput
                value={model.userName}
                onInput={(userName) => model.userName = userName}
              />
            </FormField>

            <FormField path="password">
              <TextInput
                type="password"
                value={model.password}
                onInput={(password) => model.password = password}
              />
            </FormField>

            <button type="submit" class="btn bg-black text-white mt-3">
              Đăng nhập
            </button>
          </Show>
        </div>
      </Form>
    </div>
  );
}

function SignedInSuccessNotification(): JSXElement {
  // Computed.
  const className = joinClassName(
    "bg-emerald-600/10 border border-emerald-600/50 text-emerald-600",
    "rounded-lg p-3 flex gap-3 justify-center"
  );

  // Template.
  return (
    <div class={className}>
      <i class="bi bi-check-lg"></i>
      <span>Đăng nhập thành công</span>
    </div>
  );
}
