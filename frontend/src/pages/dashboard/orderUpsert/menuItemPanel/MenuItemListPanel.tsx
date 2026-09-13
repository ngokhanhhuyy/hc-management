import React, { useState, useRef, useEffect } from "react";
import { useLoaderData } from "react-router";
import { api } from "#/api";
import type { MenuItemListModel, MenuItemBasicModel, MenuCategoryBasicModel } from "#/models";
import type { MenuItemListResponseDto } from "@hc-management/shared/dtos";
import { displayNames } from "@hc-management/shared/localization";
import { joinClassName, compute } from "#/helpers";

// Child components.
import type { DataLoadedResult } from "../dataLoader";
import { Form, FormField, TextInput } from "#/components/form";
import MenuItem from "./MenuItem";
import MenuCategory from "./MenuCategory";

// Props.
export type MenuItemWithPickedQuantity = {
  item: MenuItemBasicModel;
  quantity: number;
};

type MenuItemListPanelProps = {
  pickedItems: MenuItemWithPickedQuantity[];
  onPicked?(pickedMenuItem: MenuItemBasicModel): any;
};

// Component.
export default function MenuItemListPanel(props: MenuItemListPanelProps): React.ReactNode {
  // Dependencies.
  const initialLoadedModels = useLoaderData<DataLoadedResult>();

  // States.
  const [itemListModel, setItemListModel] = useState<MenuItemListModel>(initialLoadedModels.menuItemListModel);
  const [loadingState, setLoadingState] = useState<"initialLoading" | "reloading" | null>("initialLoading");
  const latestLoadingRequestId = useRef<number>(-1);

  // Computed.
  const categoryListModel = compute<MenuCategoryBasicModel[]>(() => initialLoadedModels.menuCategoryListModel);

  // Callbacks.
  async function submitAsync(): Promise<MenuItemListResponseDto> {
    return await api.menuItem.getListAsync(itemListModel.toRequestDto());
  }

  function onSubmissionSucceeded(responseDto: MenuItemListResponseDto): void {
    setItemListModel(m => m.mapFromResponseDto(responseDto));
  }

  // Effect.
  useEffect(() => {
    if (loadingState === "initialLoading") {
      setLoadingState(null);
      return;
    }
    
    const loadItemListModelAsync = async () => {
      const responseDto = await api.menuItem.getListAsync(itemListModel.toRequestDto());
      setItemListModel(m => m.mapFromResponseDto(responseDto));
    };

    const loadAsync = async () => {
      setLoadingState("reloading");
      await loadItemListModelAsync();
    };

    loadAsync().finally(() => setLoadingState(null));
  }, [itemListModel.searchContent, itemListModel.category?.id]);

  // Templates.
  function renderSpinner(): React.ReactNode {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-3">
        <span className="text-primary opacity-50">
          Đang tải
        </span>
      </div>
    );
  }

  if (loadingState === "initialLoading") {
    return renderSpinner();
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <Form
        className="flex flex-col gap-3"
        submitAction={submitAsync}
        onSubmissionSucceeded={onSubmissionSucceeded}
      >
        <FormField path="searchContent" displayName={displayNames["searchContent"]} hideLabel>
          <TextInput
            placeholder="Tìm kiếm tên món ăn ..."
            value={itemListModel.searchContent}
            onInput={(searchContent) => setItemListModel(m => ({ ...m, searchContent }))}
          />
        </FormField>

        <FormField path="categoryId" displayName={displayNames["menuCategory"]} hideLabel>
          <div className="flex flex-row flex-wrap justify-start items-start gap-2">
            <MenuCategory
              model={null}
              isSelected={itemListModel.category?.id == null}
              onSelected={() => setItemListModel(m => ({ ...m, category: null }))}
            />

            {categoryListModel.map((category) => (
              <MenuCategory
                model={category}
                isSelected={itemListModel.category?.id === category.id}
                onSelected={() => setItemListModel(m => ({ ...m, category }))}
                key={category.id}
              />
            ))}
          </div>
        </FormField>
      </Form>

      <div className={joinClassName(
        "grid xl:grid-cols-5 lg:grid-cols-4",
        "md:grid-cols-3 gap-3 justify-start items-start",
        loadingState === "reloading" && "opacity-50"
      )}>
        {itemListModel.items.map(menuItem => (
          <MenuItem
            model={menuItem}
            pickedQuantity={props.pickedItems.find(pi => pi.item.id === menuItem.id)?.quantity ?? 0}
            onClick={() => props.onPicked?.(menuItem)}
            key={menuItem.id}
          />
        ))}
      </div>
    </div>
  );
}
