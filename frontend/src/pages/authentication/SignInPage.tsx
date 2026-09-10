import React, { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "#/api";
import { createSignInModel, type SignInModel } from "#/models";
import { getSeatingListRoutePath } from "#/helpers";
import logoUrl from "#/assets/images/logo.png";

// Child components.
import { Form, FormField, TextInput } from "#/components/form";

// Components.
export default function SignInPage(): React.ReactNode {
  // Dependencies.
  const navigate = useNavigate();

  // States.
  const [model, setModel] = useState<SignInModel>(createSignInModel);

  // Callbacks.
  async function submitAsync(): Promise<void> {
    await api.authentication.getAccessCookieAsync(model.toRequestDto());
    setModel(m => ({ ...m, password: "" }));
  }

  function onSubmissionSucceeded(): void {
    navigate(getSeatingListRoutePath());
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
        <div className="panel-body flex flex-col p-3 gap-3 min-w-75">
          <img src={logoUrl} className="img-thumbnail aspect-square shadow-xs" /> 
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

          <button type="submit" className="btn bg-black text-white mt-3">
            Đăng nhập
          </button>
        </div>
      </Form>
    </div>
  );
}
