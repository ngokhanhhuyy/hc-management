import React, { useState, useRef, useMemo, useEffect } from "react";
import { useLoaderData } from "react-router";
import { api } from "#/api";
import type { MenuCategoryBasicModel } from "#/models";
import {
  getMenuCategoryEditorRoutePath,
  getMenuCategoryEditorCreateRoutePath,
  getMenuCategoryEditorUpdateRoutePath
} from "#/helpers"; 

// Child components.
import EditorPage from "../base/EditorPage";
import { TagIcon } from "@heroicons/react/24/outline";
import { loadMenuCategoryListDataAsync } from "./dataLoader";

// Components.
export default function MenuCategoryEditorPage(): React.ReactNode {
  // Dependencies.
  const initialModel = useLoaderData<MenuCategoryBasicModel[]>();

  // States.
  const [model, setModel] = useState<MenuCategoryBasicModel[]>(initialModel);

  // Callbacks.

  async function handleReloadAsync(): Promise<void> {
    const reloadedModel = await loadMenuCategoryListDataAsync();
    setModel(reloadedModel);
  }

  // Templates.
  return (
    <EditorPage<MenuCategoryBasicModel>
      resourceName="menuItem"
      model={model}
      editorRoutePath={getMenuCategoryEditorRoutePath()}
      editorCreateRoutePath={getMenuCategoryEditorCreateRoutePath()}
      getEditorUpdateRoutePath={getMenuCategoryEditorUpdateRoutePath}
      onReloading={handleReloadAsync}
      onDeletingAsync={async (id) => await api.menuCategory.deleteAsync(id)}
      onItemRemoved={(id) => setModel(m => ({ ...m, items: m.filter(i => i.id !== id) }))}
      ItemIcon={TagIcon}
      renderItemDescription={(item) => (
        <span className="opacity-50 text-sm">
          Mã số #{item.id}
        </span>
      )}
    />
  );
}
