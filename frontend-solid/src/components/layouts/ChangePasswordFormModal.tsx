import { api } from "#/api";
import { createChangePasswordModel, type ChangePasswordModel } from "#/models";
import { joinClassName } from "#/helpers";

// Child components.
import { Form, FormField, TextInput } from "#/components/form";
import { BaseModal } from "#/components/ui";

// Props
type ChangePasswordFormModalProps = {
  isOpen: boolean;
  onClosed(): any;
};

type PasswordStrengthIndicatorProps = {
  strengthLevel: number;
  currentStrengthLevel: number;
};

// Components.
export default function ChangePasswordFormModal(props: ChangePasswordFormModalProps): JSXElement {
  // States.
  const [model, setModel] = createSignal<ChangePasswordModel>(createChangePasswordModel());
  const [isSubmissionSuccess, setIsSubmissionSuccess] = createSignal<boolean>(false);
  const [isPasswordTextVisible, setIsPasswordTextVisible] = createSignal<boolean>(false);

  // Computed.
  const passwordStrengthLevel = createMemo<number>(() => {
    const characters = Array.from(model().newPassword);
    const criteria: boolean[] = [
      model().newPassword.length >= 6,
      /[^\p{L}\p{N}]/u.test(model().newPassword),
      /[0-9]+/u.test(model().newPassword),
      characters.some(char => char.toLowerCase() !== char.toUpperCase() && char === char.toLowerCase()),
      characters.some(char => char.toLowerCase() !== char.toUpperCase() && char === char.toUpperCase())
    ];

    return criteria.filter(criterion => criterion).length;
  });

  const closeButtonText = createMemo(() => {
    if (isSubmissionSuccess()) {
      return "Hoàn tất";
    }

    return "Huỷ bỏ";
  });

  const passwordInputType = createMemo(() => {
    if (isPasswordTextVisible()) {
      return "text";
    }

    return "password";
  });

  // Callbacks.
  async function submitAsync(): Promise<void> {
    await api.authentication.changePasswordAsync(model().toRequestDto());
  }

  function handleSubmissionSuccess(): void {
    setIsSubmissionSuccess(true);
  }

  // Template.
  const renderSubmissionSucceededNotification = () => (
    <div class={joinClassName(
      "bg-emerald-600/10 border border-emerald-600/30 rounded-lg text-emerald-600",
      "m-3 p-3 pt-2 flex justify-center items-center gap-1.5"
    )}>
      <i class="bi bi-exclamation-circle" />
      <span>Đổi mật khẩu thành công</span>
    </div>
  );

  return (
    <BaseModal
      title="Đổi mật khẩu"
      isOpen={props.isOpen}
      onClosed={props.onClosed}
      footerChildren={(
        <div class="flex justify-between gap-2">
          <button type="button" class="btn" onClick={props.onClosed}>
            {closeButtonText()}
          </button>

          <Show when={!isSubmissionSuccess()}>
            <button type="submit" class="btn" form="change-password-form">
              Xác nhận đổi
            </button>
          </Show>
        </div>
      )}
    >
      <Show when={!isSubmissionSuccess()} fallback={renderSubmissionSucceededNotification()}>
        <Form
          id="change-password-form"
          class="flex flex-col gap-3 w-full p-3 pt-2"
          action={submitAsync}
          onSucceeded={handleSubmissionSuccess}
        >
          <FormField path="currentPassword">
            <TextInput
              type="password"
              value={model().currentPassword}
              onInput={(currentPassword) => setModel(previous => ({ ...previous, currentPassword }))}
            />
          </FormField>

          <FormField path="newPassword">
            <div class="form-input-group">
              <TextInput
                type={passwordInputType()}
                class="rounded-e-none z-0"
                value={model().newPassword}
                onInput={(newPassword) => setModel(previous => ({ ...previous, newPassword }))}
              />
              <button
                type="button"
                class="btn border-s-0"
                onPointerDown={() => setIsPasswordTextVisible(true)}
                onPointerUp={() => setIsPasswordTextVisible(false)}
                onBlur={() => setIsPasswordTextVisible(false)}
              >
                <i class="bi bi-eye" />
              </button>
            </div>

            <div class="flex justify-start items-center gap-3">
              <span class="text-sm opacity-50">Độ an toàn</span>
              <div class="flex gap-1">
                <For each={Array.from({ length: 5 })}>
                  {(_, index) => (
                    <PasswordStrengthIndicator
                      strengthLevel={index() + 1}
                      currentStrengthLevel={passwordStrengthLevel()}
                    />
                  )}
                </For>
              </div>
            </div>
          </FormField>
        </Form>
      </Show>
    </BaseModal>
  );
}

function PasswordStrengthIndicator(props: PasswordStrengthIndicatorProps): JSXElement {
  // Compute.
  const backgroundClassName = createMemo<string | undefined>(() => {
    const backgroundClassNames = [
      "bg-neutral-400",
      "bg-red-400",
      "bg-orange-400",
      "bg-yellow-400",
      "bg-lime-400",
      "bg-emerald-400"
    ];

    return joinClassName(
      "w-7.5 h-1",
      backgroundClassNames[props.currentStrengthLevel],
      props.currentStrengthLevel < props.strengthLevel && "opacity-25"
    );
  });

  // Templates.
  return (
    <div class={backgroundClassName()} />
  );
}
