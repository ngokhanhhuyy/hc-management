import React, { useState } from "react";
import { api } from "#/api";
import { createSignInModel, type SignInModel } from "#/models";

// Child components.
import { Form, FormField, TextInput } from "#/components/form";

// Props.
type SignInPageProps = {
  onSignedIn(): any;
};

// Components.
export default function SignInPage(props: SignInPageProps): React.ReactNode {
  // States.
  const [model, setModel] = useState<SignInModel>(createSignInModel);

  // Callbacks.
  async function submitAsync(): Promise<void> {
    await api.authentication.getAccessCookieAsync(model.toRequestDto());
    setModel(m => ({ ...m, password: "" }));
  }

  function onSubmissionSucceeded(): void {
    props.onSignedIn();
  }

  // Templates.
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Form
        className="panel"
        style={{ maxWidth: 350 }}
        submitAction={submitAsync}
        onSubmissionSucceeded={onSubmissionSucceeded}
        submitOnEnterKeyPressed
      >
        <div className="panel-header">
          <span className="panel-header-title text-center w-full">
            Quán nhậu sân vườn
          </span>
        </div>

        <div className="panel-body flex flex-col p-3 pt-2 gap-3 min-w-75">
          <FormField path="userName">
            <TextInput
              value={model.userName}
              onInput={(userName) => setModel(m => ({ ...m, userName }))}
            />
          </FormField>

          <FormField path="password">
            <TextInput
              type="password"
              value={model.password}
              onInput={(password) => setModel(m => ({ ...m, password }))}
            />
          </FormField>

          <button type="submit" className="btn btn-primary mt-3">
            Đăng nhập
          </button>
        </div>
      </Form>
    </div>
  );
}
