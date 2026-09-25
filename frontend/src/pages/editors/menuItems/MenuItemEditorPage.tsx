import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { api } from "#/api";
import type { MenuItemListModel, MenuItemBasicModel } from "#/models";
import {
  getMenuItemEditorRoutePath,
  getMenuItemEditorCreateRoutePath,
  getMenuItemEditorUpdateRoutePath
} from "#/helpers"; 

// Child components.
import EditorPage from "../base/EditorPage";
import { Squares2X2Icon, TagIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { loadMenuItemListDataAsync } from "./dataLoader";

// Components.
export default function MenuItemEditorPage(): React.ReactNode {
  // Dependencies.
  const initialModel = useLoaderData<MenuItemListModel>();

  // States.
  const [model, setModel] = useState<MenuItemListModel>(initialModel);

  // Callbacks.
  async function handleReloadAsync(): Promise<void> {
    const reloadedModel = await loadMenuItemListDataAsync(model);
    setModel(reloadedModel);
  }

  // Templates.
  return (
    <EditorPage<MenuItemBasicModel>
      resourceName="menuItem"
      model={model.items}
      editorRoutePath={getMenuItemEditorRoutePath()}
      editorCreateRoutePath={getMenuItemEditorCreateRoutePath()}
      getEditorUpdateRoutePath={getMenuItemEditorUpdateRoutePath}
      onReloading={handleReloadAsync}
      onDeletingAsync={async (id) => await api.seating.deleteAsync(id)}
      onItemRemoved={(id) => setModel(m => ({ ...m, items: m.items.filter(i => i.id !== id) }))}
      Icon={Squares2X2Icon}
      renderItemDescription={(item) => (
        <div className="flex gap-1">
          {item.category && (
            <div className="alert alert-blue-outline alert-sm gap-0.5">
              <TagIcon className="size-4" />
              <span>{item.category.name}</span>
            </div>
          )}

          <div className="alert alert-emerald-outline alert-sm gap-0.5">
            <CurrencyDollarIcon className="size-4" />
            <span>{item.displayDefaultAmountBeforeVatPerUnit}</span>
          </div>
        </div>
      )}
    />
  );
}
