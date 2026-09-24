import React, { useState, useRef, useEffect } from "react";
import { useLoaderData } from "react-router";
import { api, type MenuItemBasicResponseDto } from "#/api";
import type { MenuItemListModel, MenuItemBasicModel, MenuCategoryBasicModel } from "#/models";
import { displayNames } from "#/localization";
import { joinClassName, compute } from "#/helpers";

// Child components.
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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

type ProcessingRequest = {
  id: string;
  handler: () => Promise<void>;
};

// Component.
export default function MenuItemListPanel(props: MenuItemListPanelProps): React.ReactNode {
  // Dependencies.
  const initialLoadedModels = useLoaderData<DataLoadedResult>();

  // States.
  const [itemListModel, setItemListModel] = useState<MenuItemListModel>(initialLoadedModels.menuItemListModel);
  const [loadingState, setLoadingState] = useState<"initialLoading" | "reloading" | null>("initialLoading");
  const processingRequests = useRef<ProcessingRequest[]>([]);

  // Computed.
  const categoryListModel = compute<MenuCategoryBasicModel[]>(() => initialLoadedModels.menuCategoryListModel);

  // Callbacks.
  async function submitAsync(): Promise<MenuItemBasicResponseDto[]> {
    return await api.menuItem.getListAsync(itemListModel.toRequestDto());
  }

  function onSubmissionSucceeded(responseDto: MenuItemBasicResponseDto[]): void {
    setItemListModel(m => m.mapFromResponseDto(responseDto));
  }

  // Effect.
  useEffect(() => {
    if (loadingState === "initialLoading") {
      setLoadingState(null);
      return;
    }

    const loadAsync = async () => {
      const promise = new Promise(resolve => setTimeout(resolve, 1000));
      try {
        setLoadingState("reloading");
        const responseDto = await api.menuItem.getListAsync(itemListModel.toRequestDto());
        setItemListModel(m => m.mapFromResponseDto(responseDto));
      } finally {
        setLoadingState(null);
        await promise;
        processingRequests.current.splice(0, 1);

        if (processingRequests.current.length > 0) {
          processingRequests.current[0].handler();
        }
      }
    };

    const requestId = crypto.randomUUID();
    const request = {
      id: requestId,
      handler: () => loadAsync()
    };

    if (processingRequests.current.length > 0) {
      processingRequests.current[1] = request;
    } else {
      processingRequests.current[0] = request;
      loadAsync();
    }
  }, [itemListModel.searchContent, itemListModel.category?.id]);

  useEffect(() => {
    console.log(JSON.stringify(processingRequests.current, null, 2));
  }, [itemListModel.searchContent]);

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
          <div className="form-input-group">
            <div className="form-input-group-text px-2">
              <MagnifyingGlassIcon className="size-4.5" />
            </div>

            <TextInput
              className={joinClassName("shadow-xs z-0", itemListModel.searchContent && "rounded-e-none")}
              placeholder="Tìm kiếm tên món ăn ..."
              value={itemListModel.searchContent}
              onInput={(searchContent) => setItemListModel(m => ({ ...m, searchContent }))}
            />

            {itemListModel.searchContent && (
              <button
                type="button"
                className="btn border-s-0"
                onClick={() => setItemListModel(m => ({ ...m, searchContent: "" }))}
              >
                <XMarkIcon />
              </button>
            )}
          </div>
        </FormField>

        <FormField path="categoryId" displayName={displayNames.category} hideLabel>
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
        "grid xl:grid-cols-4 lg:grid-cols-3",
        "md:grid-cols-2 gap-3 justify-start items-start",
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
