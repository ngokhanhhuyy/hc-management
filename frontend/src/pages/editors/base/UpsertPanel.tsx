import React, { useState, useRef, useMemo, useContext } from "react";
import { useLoaderData, useNavigate, useParams, Link } from "react-router";
import { displayNames } from "#/localization";

// Child components.
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Form, FormField, TextInput } from "#/components/form";
import { FormSubmissionSucceededModal, type ConfirmationModalHandler } from "#/components/ui"; 
import EditorPageContext from "./context";

// Types.
interface IUpsertModel {
  name: string;
}

// Props.
type UpsertPanelProps<TUpsertModel extends IUpsertModel> = {
  resourceName: "seating" | "menuItem" | "category";
  editorRoutePath: string;
  model: TUpsertModel;
  onModelUpdated(updatedData: Partial<TUpsertModel>): any;
  onCreatingAsync(): Promise<any>;
  onUpdatingAsync(id: number): Promise<any>;
  children?: React.ReactNode | React.ReactNode[];
};

// Components.
function UpsertPanel<TUpsertModel extends IUpsertModel>(props: UpsertPanelProps<TUpsertModel>): React.ReactNode {
  // Dependencies.
  const editorPageContext = useContext(EditorPageContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // States.
  const submissionSucceeededModalRef = useRef<ConfirmationModalHandler | null>(null);

  // Callbacks.
  async function submitAsync(): Promise<void> {
    if (id == null) {
      await props.onCreatingAsync();
      return;
    }

    await props.onUpdatingAsync(parseInt(id));
  }

  async function handleSubmissionSucceeeded(): Promise<void> {
    await submissionSucceeededModalRef.current?.confirmAsync();
    editorPageContext.requestReload();
    navigate(props.editorRoutePath);
  }

  // Templates.
  return (
    <div className="panel h-fit sticky top-[calc(var(--topbar-height)+(--spacing(3)))]">
      <div className="panel-header">
        <span className="panel-header-title">
          {id == null ? `Tạo ${displayNames[props.resourceName]} mới` : `Chỉnh sửa ${displayNames[props.resourceName]}`}
        </span>
      </div>

      <div className="panel-body p-3">
        <Form
          id={`${props.resourceName}-upsert-form`}
          className="bg-black/2.5 border border-black/15 rounded-lg flex flex-col gap-3 p-3 pt-2"
          submitAction={submitAsync}
          onSubmissionSucceeded={handleSubmissionSucceeeded}
        >
          <FormField path="name">
            <TextInput
              value={props.model.name}
              onInput={(name) => props.onModelUpdated({ name } as Partial<TUpsertModel>)}
            />
          </FormField>

          {props.children}
        </Form>
      </div>

      <div className="panel-footer">
        <div className="flex gap-2 justify-end">
          <Link className="btn" to={props.editorRoutePath}>
            <XMarkIcon />
            <span>Huỷ bỏ</span>
          </Link>

          <button type="submit" className="btn btn-primary-outline" form={`${props.resourceName}-upsert-form`}>
            <ArrowDownTrayIcon />
            <span>Lưu</span>
          </button>
        </div>
      </div>

      <FormSubmissionSucceededModal ref={submissionSucceeededModalRef} />
    </div>
  );
}

export default UpsertPanel;
