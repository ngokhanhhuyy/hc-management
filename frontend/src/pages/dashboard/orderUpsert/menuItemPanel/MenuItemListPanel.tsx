import React, { useState, useRef, useEffect } from "react";
import { useLoaderData } from "react-router";
import { api, displayNames, type MenuItemListResponseDto } from "#/api";
import type { MenuItemListModel, MenuItemBasicModel, MenuCategoryBasicModel, OrderItemUpsertModel } from "#/models";
import { joinClassName, compute } from "#/helpers";

// Child components.
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { DataLoadedResult } from "../dataLoader";
import { Form, FormField, TextInput } from "#/components/form";
import { Paginator } from "#/components/ui";
import MenuItem from "./MenuItem";
import MenuCategory from "./MenuCategory";

// Props.
export type MenuItemWithPickedQuantity = {
  item: MenuItemBasicModel;
  quantity: number;
};

type MenuItemListPanelProps = {
  pickedOrderItems: OrderItemUpsertModel[];
  onPicked(pickedMenuItem: MenuItemBasicModel): any;
  disabled: boolean;
};

// Component.
export default function MenuItemListPanel(props: MenuItemListPanelProps): React.ReactNode {
  // Dependencies.
  const initialLoadedModels = useLoaderData<DataLoadedResult>();

  // States.
  const [itemListModel, setItemListModel] = useState<MenuItemListModel>(initialLoadedModels.menuItemListModel);
  const [loadingState, setLoadingState] = useState<"initialLoading" | "reloading" | null>("initialLoading");
  const lastRequestId = useRef<number>(0);

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

    const requestId = lastRequestId.current += 1;
    const loadAsync = async () => {
      setLoadingState("reloading");
      const responseDto = await api.menuItem.getListAsync(itemListModel.toRequestDto());
      if (lastRequestId.current === requestId) {
        setItemListModel(m => m.mapFromResponseDto(responseDto));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    loadAsync().finally(() => setLoadingState(null));
  }, [itemListModel.page, itemListModel.pageCount, itemListModel.searchContent, itemListModel.category?.id]);

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
    <div className={joinClassName("flex flex-col gap-3 h-full", props.disabled && "opacity-50 pointer-events-none")}>
      <div className="panel">
        <div className="panel-header">
          <span className="panel-header-title">
            Danh sách món ăn
          </span>
        </div>

        <div className="panel-body flex flex-col">
          <Form
            className="bg-black/5 border border-black/10 rounded-lg flex flex-col gap-3 m-3 p-3"
            submitAction={submitAsync}
            onSubmissionSucceeded={onSubmissionSucceeded}
          >
            <FormField path="searchContent" displayName={displayNames["searchContent"]} hideLabel>
              <div className="form-input-group">
                <div className="form-input-group-text px-2">
                  <MagnifyingGlassIcon className="size-4.5" />
                </div>

                <TextInput
                  className={joinClassName("z-0", itemListModel.searchContent && "rounded-e-none")}
                  placeholder="Tìm kiếm tên món ăn ..."
                  value={itemListModel.searchContent}
                  onInput={(searchContent) => setItemListModel(m => ({ ...m, searchContent, page: 1, category: null }))}
                />

                {itemListModel.searchContent && (
                  <button
                    type="button"
                    className="btn border-s-0"
                    onClick={() => setItemListModel(m => ({ ...m, searchContent: "", page: 1, category: null }))}
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
                  onSelected={() => setItemListModel(m => ({ ...m, category: null, page: 1 }))}
                />

                {categoryListModel.map((category) => (
                  <MenuCategory
                    model={category}
                    isSelected={itemListModel.category?.id === category.id}
                    onSelected={() => setItemListModel(m => ({ ...m, category, page: 1 }))}
                    key={category.id}
                  />
                ))}
              </div>
            </FormField>
          </Form>

          <div className="flex flex-col justify-center items-center gap-3 p-3 border-t border-black/15">
            {itemListModel.items.length > 0 ? (
              <div className={joinClassName(
                "grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-3 justify-start items-start",
                "w-full transition-opacity",
                loadingState === "reloading" && "opacity-50"
              )}>
                {itemListModel.items.map(menuItem => (
                  <MenuItem
                    model={menuItem}
                    pickedOrderItems={props.pickedOrderItems}
                    onClick={() => props.onPicked?.(menuItem)}
                    key={menuItem.id}
                  />
                ))}
              </div>
            ) : (
              <div className="opacity-30 py-10">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>

        {itemListModel.pageCount > 1 && (
          <div className="panel-footer">
            <Paginator
              page={itemListModel.page}
              pageCount={itemListModel.pageCount}
              onPageChanged={(page) => setItemListModel(m => ({ ...m, page }))}
              getPageButtonClassName={(_, isActive) => isActive ? "btn btn-primary" : "btn"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
