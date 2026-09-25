import React, { useState, useMemo, useCallback } from "react";
import { useLoaderData } from "react-router";
import { api } from "#/api";
import type { MenuItemUpsertModel } from "#/models";
import { displayNames } from "#/localization";
import { getMenuItemEditorRoutePath } from "#/helpers";

// Child components.
import UpsertPanel from "../base/UpsertPanel";
import type { MenuItemUpsertLoadedData } from "./dataLoader";
import { FormField, TextInput, NumberInput, SelectInput, type SelectInputOption } from "#/components/form"; 

// Components.
export default function MenuItemUpsertPanel(): React.ReactNode {
  // Dependencies.
  const { upsert: initialUpsertModel, categories } = useLoaderData<MenuItemUpsertLoadedData>();

  // States.
  const [model, setModel] = useState<MenuItemUpsertModel>(initialUpsertModel);

  // Computed.
  const categoryOptions = useMemo<SelectInputOption[]>(() => {
    return [
      { displayName: "Không chọn", value: "" },
      ...categories.map<SelectInputOption>(category => ({ displayName: category.name, value: category.id.toString() }))
    ];
  }, []);

  // Callbacks.
  function handleCategoryInput(categoryIdAsString: string): void {
    if (!categoryIdAsString) {
      setModel(m => ({ ...m, category: null }));
      return;
    }

    const category = categories.find(c => c.id === parseInt(categoryIdAsString))!;
    setModel(m => ({ ...m, category }));
  }

  async function handleCreatingAsync(): Promise<void> {
    await api.menuItem.createAsync(model.toRequestDto());
  }

  async function handleUpdatingAsync(id: number): Promise<void> {
    await api.menuItem.updateAsync(id, model.toRequestDto());
  }

  // Templates.
  return (
    <UpsertPanel<MenuItemUpsertModel>
      resourceName="menuItem"
      editorRoutePath={getMenuItemEditorRoutePath()}
      model={model}
      onModelUpdated={(updatedData) => setModel(m => ({ ...m, ...updatedData }))}
      onCreatingAsync={handleCreatingAsync}
      onUpdatingAsync={handleUpdatingAsync}
    >
      <FormField path="unit">
        <TextInput
          className="z-0"
          value={model.unit}
          onInput={(unit) => setModel(m => ({ ...m, unit }))}
        />
      </FormField>
      
      <div className="grid grid-cols-2 gap-3">
        <FormField path="defaultAmountBeforeVatPerUnit">
          <div className="form-input-group">
            <NumberInput
              className="z-0"
              value={model.defaultAmountBeforeVatPerUnit}
              onInput={(defaultAmountBeforeVatPerUnit) => setModel(m => ({ ...m, defaultAmountBeforeVatPerUnit }))}
              min={0}
              max={99_999_999}
            />

            <span className="form-input-group-text">
              vnđ
            </span>
          </div>
        </FormField>

        <FormField path="defaultVatPercentagePerUnit">
          <div className="form-input-group">
            <NumberInput
              className="z-0"
              value={model.defaultVatPercentagePerUnit}
              onInput={(defaultVatPercentagePerUnit) => setModel(m => ({ ...m, defaultVatPercentagePerUnit }))}
              min={0}
              max={100}
            />

            <span className="form-input-group-text">
              %
            </span>
          </div>
        </FormField>
      </div>

      <FormField path="categoryId" displayName={displayNames.category}>
        <SelectInput
          options={categoryOptions}
          value={model.category?.id.toString() ?? ""}
          onInput={handleCategoryInput}
        />
      </FormField>
    </UpsertPanel>
  );
}
