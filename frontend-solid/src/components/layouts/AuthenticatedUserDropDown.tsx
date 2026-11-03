import { useAuthenticationStore } from "#/stores";
import { joinClassName } from "#/helpers";
import ChangePasswordFormModal from "./ChangePasswordFormModal";

// Components.
export default function AuthenticatedUserDropDown(): JSXElement {
  // Dependencies.
  const authenticationStore = useAuthenticationStore();

  // States.
  let isUserMenuVisible = $state<boolean>(false);
  let isChangePasswordFormModalOpened = $state<boolean>(false);
  let userMenuContainerElementRef: HTMLDivElement;

  // Computed.
  const iconAvatarContainerClassName = joinClassName(
    "bg-black/5 border border-black/10 w-[50%]",
    "flex justify-center items-center aspect-square rounded-full p-[15%]"
  );

  // Callbacks.
  function handleMouseClickedOutside(event: MouseEvent): void {
    const userMenuContainsClickedElement = userMenuContainerElementRef?.contains(event.target as Node);
    if (!userMenuContainsClickedElement) {
      $untrack(() => {
        isUserMenuVisible = false;
      });
    }
  }

  function handleChangePasswordButtonClicked(): void {
    isUserMenuVisible = false;
    isChangePasswordFormModalOpened = true;
  };

  // Lifecycle.
  $mount(() => window.addEventListener("click", handleMouseClickedOutside));
  $cleanup(() => window.removeEventListener("click", handleMouseClickedOutside));

  // Template.
  return (
    <div class="relative h-full flex justify-start" ref={(element) => userMenuContainerElementRef = element}>
      <button
        type="button"
        class="btn bg-black/2.5 hover:bg-black/10 border border-black/15 rounded-full h-full aspect-square"
        onClick={() => isUserMenuVisible = true}
      >
        <i class="bi bi-person opacity-50" />
      </button>

      <Show when={isUserMenuVisible}>
        <div class={joinClassName(
          "bg-white border border-black/25 rounded-lg shadow-lg w-60 h-fit absolute",
          "flex flex-col gap-3 p-3 items-center top-full right-0 mt-1"
        )}>
          <div class={iconAvatarContainerClassName}>
            <i class="bi bi-person opacity-25 text-3xl" />
          </div>

          <span>{authenticationStore.authenticatedUser?.userName}</span>

          <div class="flex justify-between w-full mt-5">
            <button type="button" class="btn btn-sm" onClick={handleChangePasswordButtonClicked}>
              Đổi mật khẩu
            </button>

            <button type="button" class="btn btn-sm" onClick={authenticationStore.signOutAsync}>
              Đăng xuất
            </button>
          </div>
        </div>
      </Show>

      <ChangePasswordFormModal
        isOpen={isChangePasswordFormModalOpened}
        onClosed={() => isChangePasswordFormModalOpened = false}
      />
    </div>
  );
}
