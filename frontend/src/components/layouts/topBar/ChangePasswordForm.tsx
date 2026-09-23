import React, { useState, useRef, useEffect } from "react";
import { api } from "#/api";
import { createChangePasswordModel, type ChangePasswordModel } from "#/models";

// Child components.
import { Form, FormField, TextInput } from "#/components/form";

// Props
type ChangePasswordFormProps = {
  onFinished(): any;
};

// Components.
export default function ChangePasswordForm(props: ChangePasswordFormProps): React.ReactNode {
  // States.
  const [model, setModel] = useState<ChangePasswordModel>(createChangePasswordModel);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState<boolean>(false);

  // Callbacks.
  async function submitAsync(): Promise<void> {
    await api.authentication.changePasswordAsync(model.toRequestDto());
  }

  function handleSubmissionSuccess(): void {
    setIsSubmissionSuccess(true);
  }

  // Template.
  return (
    <Form className="flex flex-col gap-3 w-full" submitAction={submitAsync} onSubmissionSucceeded={handleSubmissionSuccess}>
      <FormField path="currentPassword">
        <TextInput
          type="password"
          value={model.currentPassword}
          onInput={(currentPassword) => setModel(m => ({ ...m, currentPassword }))}
        />
      </FormField>

      <FormField path="newPassword">
        <TextInput
          type="password"
          value={model.newPassword}
          onInput={(newPassword) => setModel(m => ({ ...m, newPassword }))}
        />
      </FormField>

      <FormField path="confirmationPassword" displayName="Mật khẩu xác nhận">
        <TextInput
          type="password"
          value={model.confirmationPassword}
          onInput={(confirmationPassword) => setModel(m => ({ ...m, confirmationPassword }))}
        />
      </FormField>

      <div className="flex justify-between gap-3">
        <button type="button" className="btn btn-sm" onClick={props.onFinished}>
          Huỷ bỏ
        </button>

        <button type="submit" className="btn btn-sm">
          Xác nhận đổi
        </button>
      </div>
    </Form>
  );
}
