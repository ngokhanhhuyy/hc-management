import React, { useState, useRef, useContext } from "react";
import { useLoaderData, useNavigate, useParams, Link } from "react-router";
import { api } from "#/api";
import type { SeatingUpsertModel } from "#/models";
import { getSeatingEditorRoutePath } from "#/helpers";

// Child components.
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Form, FormField, TextInput } from "#/components/form";
import { FormSubmissionSucceededModal, type ConfirmationModalHandler } from "#/components/ui"; 
import SeatingEditorPageContext from "./context";

// Components.
export default function SeatingUpsertPanel(): React.ReactNode {
  // Dependencies.
  const initialModel = useLoaderData<SeatingUpsertModel>();
  const editorPageContext = useContext(SeatingEditorPageContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // States.
  const [model, setModel] = useState<SeatingUpsertModel>(initialModel);
  const submissionSucceeededModalRef = useRef<ConfirmationModalHandler | null>(null);

  // Callbacks.
  async function submitAsync(): Promise<void> {
    if (id == null) {
      await api.seating.createAsync(model.toRequestDto());
      return;
    }

    await api.seating.updateAsync(parseInt(id), model.toRequestDto());
  }

  async function handleSubmissionSucceeeded(): Promise<void> {
    await submissionSucceeededModalRef.current?.confirmAsync();
    editorPageContext.requestReload();
    navigate(getSeatingEditorRoutePath());
  }

  // Templates.
  return (
    <div className="panel h-fit sticky top-[calc(var(--topbar-height)+(--spacing(3)))]">
      <div className="panel-header">
        <span className="panel-header-title">
          {id == null ? "Tạo bàn ăn mới" : `Chỉnh sửa ${initialModel.name}`}
        </span>
      </div>

      <div className="panel-body p-3 pt-2">
        <Form id="seating-upsert-form" submitAction={submitAsync} onSubmissionSucceeded={handleSubmissionSucceeeded}>
          <FormField path="name">
            <TextInput
              value={model.name}
              onInput={(name) => setModel(m => ({ ...m, name }))}
            />
          </FormField>
        </Form>
      </div>

      <div className="panel-footer">
        <div className="flex gap-2 justify-end">
          <Link className="btn" to={getSeatingEditorRoutePath()}>
            <XMarkIcon />
            <span>Huỷ bỏ</span>
          </Link>

          <button type="submit" className="btn btn-primary-outline" form="seating-upsert-form">
            <ArrowDownTrayIcon />
            <span>Lưu</span>
          </button>
        </div>
      </div>

      <FormSubmissionSucceededModal ref={submissionSucceeededModalRef} />
    </div>
  );
}
