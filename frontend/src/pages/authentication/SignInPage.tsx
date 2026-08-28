import React, { useState } from "react";
import { api } from "#/api";
import { createSignInModel, type SignInModel } from "./signInModel";
import { AuthenticationError } from "@hc-management/shared/errors";

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

  function onSubmissionFailed(_: unknown, isKnownError: boolean): void {
    if (isKnownError) {
      props.onSignedIn();
    }
  }

  // Templates.
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center w-100 h-100">
      <Form
        className="bg-white border d-flex flex-column gap-3 p-3 rounded-3 w-100 shadow-sm"
        style={{ maxWidth: 350 }}
        submitAction={submitAsync}
        onSubmissionSucceeded={onSubmissionSucceeded}
        onSubmissionFailed={onSubmissionFailed}
      >
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
      </Form>
    </div>
  );
}
