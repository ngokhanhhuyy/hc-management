import React, { useState, useRef, useMemo, useEffect } from "react";
import { useLoaderData } from "react-router";
import { api, MenuItemListSortingCriterion } from "#/api";
import { displayNames } from "#/localization";
import { useThrottledState } from "#/hooks";
import {
  createMenuCategoryBasicModel,
  type MenuItemListModel,
  type MenuItemBasicModel,
  type MenuCategoryBasicModel
} from "#/models";
import {
  getMenuItemEditorRoutePath,
  getMenuItemEditorCreateRoutePath,
  getMenuItemEditorUpdateRoutePath,
  joinClassName,
  getDisplayNameByKey
} from "#/helpers"; 

// Child components.
import EditorPage from "../base/EditorPage";
import { Squares2X2Icon, TagIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { Form, FormField, TextInput, SelectInput, type SelectInputOption } from "#/components/form";

// Components.
export default function MenuItemEditorPage(): React.ReactNode {
  // Dependencies.
  const initialModel = useLoaderData<MenuItemListModel>();

  // States.
  const [model, setModel] = useState<MenuItemListModel>(initialModel);
  const throttledModel = useThrottledState(model);
  const [categories, setCategories] = useState<MenuCategoryBasicModel[]>([]);
  const latestRequestId = useRef<number>(-1);

  // Computed.
  const categoryOptions = useMemo<SelectInputOption[]>(() => {
    return [
      { displayName: "Tất cả", value: "" },
      ...categories.map<SelectInputOption>(category => ({ displayName: category.name, value: category.id.toString() }))
    ];
  }, [categories]);

  const criterionOptions = useMemo<SelectInputOption[]>(() => {
    return Object
      .entries(MenuItemListSortingCriterion)
      .map<SelectInputOption>(([key, value]) => ({
        displayName: getDisplayNameByKey(key[0].toLowerCase() + key.slice(1)) ?? key,
        value: value.toString()
      }));
  }, []);

  // Callbacks.
  function handleCategoryInput(categoryIdAsString: string): void {
    if (!categoryIdAsString) {
      setModel(m => ({ ...m, category: null }));
      return;
    }

    const category = categories.find(c => c.id === parseInt(categoryIdAsString));
    if (category) {
      setModel(m => ({ ...m, category }));
    }
  }

  function handleSortingByCriterionInput(criterionAsString: string): void {
    const key = criterionAsString[0].toUpperCase() + criterionAsString.slice(1);
    const criterion = MenuItemListSortingCriterion[key as keyof typeof MenuItemListSortingCriterion];
    if (criterion) {
      setModel(m => ({ ...m, sortByCriterion: criterion }));
    }
  }

  async function handleReloadAsync(): Promise<void> {
    const requestId = latestRequestId.current += 1;
    const responseDtos = await api.menuItem.getListAsync(throttledModel);

    if (latestRequestId.current == requestId) {
      setModel(m => m.mapFromResponseDto(responseDtos));
    }
  }

  // Effects.
  useEffect(() => {
    const loadCategoriesAsync = async (): Promise<void> => {
      const responseDtos = await api.menuCategory.getAllAsync();
      setCategories(responseDtos.map(createMenuCategoryBasicModel));
    };

    loadCategoriesAsync();
  }, []);

  useEffect(() => {
    handleReloadAsync();
  }, [throttledModel.sortByAscending, throttledModel.sortByCriterion, throttledModel.searchContent]);

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
      ItemIcon={Squares2X2Icon}
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
      renderUpperArea={(isEditorRoutePath, semiTransparentClassName) => (
        <div className="bg-black/2.5 border border-black/10 rounded-lg">
          <div className={joinClassName(
            "gap-3 p-3 pt-2 grid grid-cols-2",
            !isEditorRoutePath && semiTransparentClassName
          )}>
            <FormField className="col-span-2" path="searchContent">
              <TextInput
                value={model.searchContent}
                onInput={(searchContent) => setModel(m => ({ ...m, searchContent }))}
              />
            </FormField>

            <FormField path="categoryId" displayName={displayNames.category}>
              <SelectInput
                options={categoryOptions}
                value={model.category?.id.toString() ?? ""}
                onInput={handleCategoryInput}
              />
            </FormField>

            <FormField path="sortByCriterion">
              <SelectInput
                options={criterionOptions}
                value={model.sortByCriterion}
                onInput={handleSortingByCriterionInput}
              />
            </FormField>
          </div>
        </div>
      )}
    />
  );
}
