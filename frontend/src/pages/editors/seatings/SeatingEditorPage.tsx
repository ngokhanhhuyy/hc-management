import React, { useState, useRef, useMemo, useCallback } from "react";
import { useParams, useLocation, useLoaderData, Outlet, Link } from "react-router";
import { api } from "#/api";
import type { SeatingBasicModel } from "#/models";
import {
  compute,
  joinClassName,
  getSeatingEditorRoutePath,
  getSeatingEditorCreateRoutePath,
  getSeatingEditorUpdateRoutePath
} from "#/helpers"; 

// Child components.
import {
  Squares2X2Icon,
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
import { loadSeatingListDataAsync } from "./dataLoader";
import SeatingEditorPageContext, { type SeatingEditorPageContextPayload } from "./context";

// Components.
export default function SeatingEditorPage(): React.ReactNode {
  // Dependencies.
  const initialModel = useLoaderData<SeatingBasicModel[]>();
  const location = useLocation();
  const { id } = useParams();

  // States.
  const [model, setModel] = useState<SeatingBasicModel[]>(initialModel);
  const yesNoModalRef = useRef<YesNoModalHandler | null>(null);
  const deletionSuccessModalHandlerRef = useRef<ConfirmationModalHandler | null>(null);

  // Computed.
  const isSeatingEditorRoutePath = compute(() => {
    return location.pathname === getSeatingEditorRoutePath();
  });

  function isSeatingSelected(seating: SeatingBasicModel): boolean {
    return id === seating.id.toString();
  }

  const requestReload = useCallback(async () => {
    const reloadedModel = await loadSeatingListDataAsync();
    setModel(reloadedModel);
  }, []);

  const contextPayload = useMemo<SeatingEditorPageContextPayload>(() => ({
    requestReload
  }), []);

  // Callbacks.
  async function handleDeletionAsync(seating: SeatingBasicModel): Promise<void> {
    if (!yesNoModalRef.current) {
      return;
    }

    const answer = await yesNoModalRef.current.getAnswerAsync();
    if (answer) {
      await api.seating.deleteAsync(seating.id);
    }

    await deletionSuccessModalHandlerRef.current?.confirmAsync();
    setModel(m => m.filter(s => s.id !== seating.id));
  }
  
  // Templates.
  return (
    <div className={joinClassName(
      "grid w-full gap-3 h-fit",
      !isSeatingEditorRoutePath ? "grid-cols-2" : "grid-cols-1"
    )}>
      <div className="panel flex-1">
        <div className="panel-header">
          <span className="panel-header-title">Danh sách bàn ăn</span>
          <Link
            className={joinClassName(
              "btn btn-sm gap-0.5",
              !isSeatingEditorRoutePath && "invisible pe-none"
            )}
            to={getSeatingEditorCreateRoutePath()}
          >
            <PlusIcon />
            <span>Tạo bàn ăn mới</span>
          </Link>
        </div>

        <div className="panel-body p-3">
          <ul className="list-group bg-black/2.5">
            {model.map(seating => (
              <li className="list-group-item flex p-0" key={seating.id}>
                <div className={joinClassName(
                  "flex gap-2 p-2 justify-start items-center w-full",
                  (!isSeatingEditorRoutePath && !isSeatingSelected(seating)) && "opacity-25 pe-none"
                )}>
                  <div className="img-thumbnail size-11 flex justify-center items-center">
                    <Squares2X2Icon className="size-[50%] opacity-25" />
                  </div>

                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex gap-1.5 items-center">
                      <span className={joinClassName(
                        "font-bold",
                        (isSeatingEditorRoutePath || isSeatingSelected(seating)) && "text-blue-700"
                      )}>
                        {seating.name}
                      </span>

                      {seating.activeOrder && (
                        <span className="alert alert-emerald-outline alert-sm">
                          Đang có khách
                        </span> 
                      )}
                    </div>

                    <span className="opacity-50 text-sm">
                      Mã số #{seating.id}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {id == null && (
                      <Link type="button" className="btn" to={getSeatingEditorUpdateRoutePath(seating.id)}>
                        <PencilSquareIcon />
                      </Link>
                    )}

                    {(isSeatingEditorRoutePath || isSeatingSelected(seating)) && (
                      <button
                        type="button"
                        className="btn btn-danger-outline"
                        onClick={() => handleDeletionAsync(seating)}
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

      <SeatingEditorPageContext.Provider value={contextPayload}>
        <Outlet />
      </SeatingEditorPageContext.Provider>

      <YesNoModal
        title="Xác nhận xoá bàn ăn"
        IconComponent={ExclamationTriangleIcon}
        iconClassName="text-yellow-500"
        yesButtonClassName="btn btn-danger-outline"
        questionContent={["Dữ liệu đã xoá có thể sẽ không thể khôi phục lại", "Bạn có chắc chắn muốn xoá bàn ăn này?"]}
        ref={yesNoModalRef}
      />

      <FormSubmissionSucceededModal ref={deletionSuccessModalHandlerRef} />
    </div>
  );
}
