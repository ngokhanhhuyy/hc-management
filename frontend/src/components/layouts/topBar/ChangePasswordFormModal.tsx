import React, { useState, useMemo } from "react";
import { api } from "#/api";
import { createChangePasswordModel, type ChangePasswordModel } from "#/models";
import { compute, joinClassName } from "#/helpers";

// Child components.
import { EyeIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
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
export default function ChangePasswordFormModal(props: ChangePasswordFormModalProps): React.ReactNode {
  // States.
  const [model, setModel] = useState<ChangePasswordModel>(createChangePasswordModel);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState<boolean>(false);
  const [isPasswordTextVisible, setIsPasswordTextVisible] = useState<boolean>(false);

  // Computed.
  const passwordStrengthLevel = useMemo<number>(() => {
    const characters = Array.from(model.newPassword);
    const criteria: boolean[] = [
      model.newPassword.length >= 6,
      /[^\p{L}\p{N}]/u.test(model.newPassword),
      /[0-9]+/u.test(model.newPassword),
      characters.some(char => char.toLowerCase() !== char.toUpperCase() && char === char.toLowerCase()),
      characters.some(char => char.toLowerCase() !== char.toUpperCase() && char === char.toUpperCase())
    ];

    return criteria.filter(criterion => criterion).length;
  }, [model.newPassword]);

  // Callbacks.
  async function submitAsync(): Promise<void> {
    await api.authentication.changePasswordAsync(model.toRequestDto());
  }

  function handleSubmissionSuccess(): void {
    setIsSubmissionSuccess(true);
  }

  // Template.
  return (
    <BaseModal
      title="Đổi mật khẩu"
      isOpen={props.isOpen}
      onClosed={props.onClosed}
      footerChildren={
        <div className="flex justify-between gap-3">
          <button type="button" className="btn btn-sm" onClick={props.onClosed}>
            {isSubmissionSuccess ? "Hoàn tất" : "Huỷ bỏ"}
          </button>

          {!isSubmissionSuccess && (
            <button type="submit" className="btn btn-sm" form="change-password-form">
              Xác nhận đổi
            </button>
          )}
        </div>
      }
    >
      {!isSubmissionSuccess ? (
        <Form
          id="change-password-form"
          className="flex flex-col gap-3 w-full p-3 pt-2"
          submitAction={submitAsync}
          onSubmissionSucceeded={handleSubmissionSuccess}
        >
          <FormField path="currentPassword">
            <TextInput
              type="password"
              value={model.currentPassword}
              onInput={(currentPassword) => setModel(m => ({ ...m, currentPassword }))}
            />
          </FormField>

          <FormField path="newPassword">
            <div className="form-input-group">
              <TextInput
                type={isPasswordTextVisible ? "text" : "password"}
                className="rounded-e-none z-0"
                value={model.newPassword}
                onInput={(newPassword) => setModel(m => ({ ...m, newPassword }))}
              />
              <button
                type="button"
                className="btn border-s-0"
                onPointerDown={() => setIsPasswordTextVisible(true)}
                onPointerUp={() => setIsPasswordTextVisible(false)}
                onBlur={() => setIsPasswordTextVisible(false)}
              >
                <EyeIcon />
              </button>
            </div>

            <div className="flex justify-start items-center gap-3">
              <span className="text-sm opacity-50">Độ an toàn</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <PasswordStrengthIndicator
                    strengthLevel={index + 1}
                    currentStrengthLevel={passwordStrengthLevel}
                    key={index}
                  />
                ))}
              </div>
            </div>
          </FormField>
        </Form>
        ) : (
          <div className={joinClassName(
            "bg-emerald-600/10 border border-emerald-600/30 rounded-lg text-emerald-600",
            "m-3 p-3 pt-2 flex justify-center items-center gap-1"
          )}>
            <ExclamationCircleIcon className="size-5" />
            <span>Đổi mật khẩu thành công</span>
          </div>
        )}
    </BaseModal>
  );
}

function PasswordStrengthIndicator(props: PasswordStrengthIndicatorProps): React.ReactNode {
  // Compute.
  const backgroundClassName = compute<string>(() => {
    const backgroundClassNames = [
      "bg-neutral-400",
      "bg-red-400",
      "bg-orange-400",
      "bg-yellow-400",
      "bg-lime-400",
      "bg-emerald-400"
    ];

    return backgroundClassNames[props.currentStrengthLevel];
  });

  // Templates.
  return (
    <div className={joinClassName(
      "w-7.5 h-1",
      backgroundClassName,
      props.currentStrengthLevel < props.strengthLevel && "opacity-25"
    )} />
  );
}
