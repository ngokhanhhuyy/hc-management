import React, { useRef } from "react";
import { useParams, useLocation, Outlet, Link } from "react-router";
import { displayNames } from "#/localization";
import { compute, joinClassName } from "#/helpers"; 

// Child components.
import {
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import {
  YesNoModal,
  FormSubmissionSucceededModal,
  type YesNoModalHandler,
  type ConfirmationModalHandler
} from "#/components/ui";
import EditorPageContext, { type EditorPageContextPayload } from "./context";

// Types.
interface IBasic {
  id: number;
  name: string;
}

// Props.
type EditorPageProps<TBasicModel extends IBasic> = {
  resourceName: "seating" | "menuItem" | "category";
  model: TBasicModel[];
  editorRoutePath: string;
  editorCreateRoutePath: string;
  getEditorUpdateRoutePath(id: number): string;
  onItemRemoved(id: number): any;
  onReloading(): any
  onDeletingAsync(id: number): Promise<any>;
  Icon: (props: { className: string }) => React.ReactNode;
  renderItemDescription(item: TBasicModel): React.ReactNode;
};

// Components.
export default function EditorPage<TBasicModel extends IBasic>(props: EditorPageProps<TBasicModel>): React.ReactNode {
  // Dependencies.
  const location = useLocation();
  const { id } = useParams();

  // States.
  const yesNoModalRef = useRef<YesNoModalHandler | null>(null);
  const deletionSuccessModalHandlerRef = useRef<ConfirmationModalHandler | null>(null);

  // Computed.
  const isEditorRoutePath = compute(() => {
    return location.pathname === props.editorRoutePath;
  });

  function isSelected(seating: TBasicModel): boolean {
    return id === seating.id.toString();
  }

  const contextPayload = compute<EditorPageContextPayload>(() => ({
    requestReload: props.onReloading
  }));

  // Callbacks.
  async function handleDeletionAsync(seating: TBasicModel): Promise<void> {
    if (!yesNoModalRef.current) {
      return;
    }

    const answer = await yesNoModalRef.current.getAnswerAsync();
    if (answer) {
      await props.onDeletingAsync(seating.id);
    }

    await deletionSuccessModalHandlerRef.current?.confirmAsync();
    props.onItemRemoved(seating.id);
  }
  
  // Templates.
  return (
    <div className={joinClassName(
      "grid w-full gap-3 h-fit",
      !isEditorRoutePath ? "grid-cols-2" : "grid-cols-1"
    )}>
      <div className="panel flex-1">
        <div className="panel-header">
          <span className="panel-header-title">Danh sách {displayNames[props.resourceName]}</span>
          <Link
            className={joinClassName(
              "btn btn-sm gap-0.5",
              !isEditorRoutePath && "invisible pe-none"
            )}
            to={props.editorCreateRoutePath}
          >
            <PlusIcon />
            <span>Tạo bàn ăn mới</span>
          </Link>
        </div>

        <div className="panel-body p-3">
          <ul className="list-group bg-black/2.5">
            {props.model.map(item => (
              <li className="list-group-item flex p-0" key={item.id}>
                <div className={joinClassName(
                  "flex gap-2 p-2 justify-start items-center w-full",
                  (!isEditorRoutePath && !isSelected(item)) && "opacity-25 pe-none"
                )}>
                  <div className="img-thumbnail size-11 flex justify-center items-center">
                    <props.Icon className="size-[50%] opacity-25" />
                  </div>

                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex gap-1.5 items-center">
                      <span className={joinClassName(
                        "font-bold",
                        (isEditorRoutePath || isSelected(item)) && "text-blue-700"
                      )}>
                        {item.name}
                      </span>
                    </div>

                    {props.renderItemDescription(item)}
                  </div>

                  <div className="flex gap-2">
                    {id == null && (
                      <Link type="button" className="btn" to={props.getEditorUpdateRoutePath(item.id)}>
                        <PencilSquareIcon />
                      </Link>
                    )}

                    {(isEditorRoutePath || isSelected(item)) && (
                      <button
                        type="button"
                        className="btn btn-danger-outline"
                        onClick={() => handleDeletionAsync(item)}
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <EditorPageContext.Provider value={contextPayload}>
        <Outlet />
      </EditorPageContext.Provider>

      <YesNoModal
        title={`Xác nhận xoá ${displayNames[props.resourceName]}`}
        IconComponent={ExclamationTriangleIcon}
        iconClassName="text-yellow-500"
        yesButtonClassName="btn btn-danger-outline"
        questionContent={[
          "Dữ liệu đã xoá có thể sẽ không thể khôi phục lại",
          `Bạn có chắc chắn muốn xoá ${displayNames[props.resourceName]} này?`
        ]}
        ref={yesNoModalRef}
      />

      <FormSubmissionSucceededModal ref={deletionSuccessModalHandlerRef} />
    </div>
  );
}
