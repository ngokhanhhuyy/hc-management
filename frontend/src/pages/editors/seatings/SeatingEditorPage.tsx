import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { api } from "#/api";
import type { SeatingBasicModel } from "#/models";
import {
  getSeatingEditorRoutePath,
  getSeatingEditorCreateRoutePath,
  getSeatingEditorUpdateRoutePath
} from "#/helpers"; 

// Child components.
import EditorPage from "../base/EditorPage";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { loadSeatingListDataAsync } from "./dataLoader";

// Components.
export default function SeatingEditorPage(): React.ReactNode {
  // Dependencies.
  const initialModel = useLoaderData<SeatingBasicModel[]>();

  // States.
  const [model, setModel] = useState<SeatingBasicModel[]>(initialModel);

  // Templates.
  return (
    <EditorPage<SeatingBasicModel>
      resourceName="seating"
      model={model}
      editorRoutePath={getSeatingEditorRoutePath()}
      editorCreateRoutePath={getSeatingEditorCreateRoutePath()}
      getEditorUpdateRoutePath={getSeatingEditorUpdateRoutePath}
      onReloading={loadSeatingListDataAsync}
      onDeletingAsync={async (id) => await api.seating.deleteAsync(id)}
      onItemRemoved={(id) => setModel(m => m.filter(item => item.id !== id))}
      Icon={Squares2X2Icon}
      renderItemDescription={(item) => (
        <div className="flex gap-1">
          <span className="opacity-50 text-sm">
            Mã số #{item.id}
          </span>

          {item.activeOrder && (
            <span className="alert alert-emerald-outline alert-sm">
              Đang có khách
            </span>
          )}
        </div>
      )}
    />
  );
}
