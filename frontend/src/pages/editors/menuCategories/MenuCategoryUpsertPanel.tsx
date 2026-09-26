import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { api } from "#/api";
import type { MenuCategoryUpsertModel } from "#/models";
import { getMenuCategoryEditorRoutePath } from "#/helpers";

// Child components.
import UpsertPanel from "../base/UpsertPanel";
import { XMarkIcon, NumberedListIcon } from "@heroicons/react/24/outline";
import { FormField, NumberInput } from "#/components/form";
import { displayNames } from "#/localization";

// Components.
export default function MenuItemUpsertPanel(): React.ReactNode {
  // Dependencies.
  const initialModel = useLoaderData<MenuCategoryUpsertModel>();

  // States.
  const [model, setModel] = useState<MenuCategoryUpsertModel>(initialModel);

  // Callbacks.
  async function handleCreatingAsync(): Promise<void> {
    await api.menuCategory.createAsync(model.toRequestDto());
  }

  async function handleUpdatingAsync(id: number): Promise<void> {
    await api.menuCategory.updateAsync(id, model.toRequestDto());
  }

  // Templates.
  return (
    <UpsertPanel<MenuCategoryUpsertModel>
      resourceName="category"
      editorRoutePath={getMenuCategoryEditorRoutePath()}
      model={model}
      onModelUpdated={(updatedData) => setModel(m => ({ ...m, ...updatedData }))}
      onCreatingAsync={handleCreatingAsync}
      onUpdatingAsync={handleUpdatingAsync}
    >
      <FormField path="sortingIndex" displayName={displayNames.index}>
        {model.sortingIndex >= 0 ? (
          <div className="peer sorting-index-group form-input-group">
            <NumberInput
              className="border-e-0 z-0"
              value={model.sortingIndex}
              onInput={(sortingIndex) => setModel(m => ({ ...m, sortingIndex }))}
            />

            <button
              type="button"
              className="btn btn-danger-outline whitespace-nowrap"
              onClick={() => setModel(m => ({ ...m, sortingIndex: -1 }))}
            >
              <XMarkIcon />
              <span>Tắt chỉ mục</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn whitespace-nowrap"
            onClick={() => setModel(m => ({ ...m, sortingIndex: 0 }))}
          >
            <NumberedListIcon />
            <span>Sử dụng chỉ mục</span>
          </button>
        )}
      </FormField>
    </UpsertPanel>
  );
}
