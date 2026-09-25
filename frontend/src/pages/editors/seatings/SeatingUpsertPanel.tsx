import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { api } from "#/api";
import type { SeatingUpsertModel } from "#/models";
import { getSeatingEditorRoutePath } from "#/helpers";

// Child components.
import UpsertPanel from "../base/UpsertPanel";
// Components.
export default function SeatingUpsertPanel(): React.ReactNode {
  // Dependencies.
  const initialModel = useLoaderData<SeatingUpsertModel>();

  // States.
  const [model, setModel] = useState<SeatingUpsertModel>(initialModel);
  
  // Callbacks.
  async function handleCreatingAsync(): Promise<void> {
    await api.seating.createAsync(model.toRequestDto());
  }

  async function handleUpdatingAsync(id: number): Promise<void> {
    await api.seating.updateAsync(id, model.toRequestDto());
  }

  // Templates.
  return (
    <UpsertPanel<SeatingUpsertModel>
      resourceName="seating"
      editorRoutePath={getSeatingEditorRoutePath()}
      model={model}
      onModelUpdated={(updatedData) => setModel(m => ({ ...m, ...updatedData }))}
      onCreatingAsync={handleCreatingAsync}
      onUpdatingAsync={handleUpdatingAsync}
    />
  );
}
