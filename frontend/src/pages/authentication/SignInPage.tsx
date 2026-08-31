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
    <div className="container-fluid d-flex justify-content-center align-items-center w-100 h-100">
      <Form
        className="bg-white border rounded-3 w-100 shadow-sm"
        style={{ maxWidth: 350 }}
        submitAction={submitAsync}
        onSubmissionSucceeded={onSubmissionSucceeded}
      >
        <div className="text-primary border-bottom p-3 pb-2">
          <h3 className="w-100 text-center text-uppercase">
            Quán nhậu sân vườn
          </h3>
        </div>

        <div className="d-flex flex-column p-3 pt-2 gap-3">
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
