import React, { useState, useEffect } from "react";
import { api } from "#/api";
import {
  createMenuItemListModel,
  createMenuCategoryBasicModel,
  type MenuItemListModel,
  type MenuItemBasicModel,
  type MenuCategoryBasicModel
} from "#/models";
import type { MenuItemListResponseDto } from "@hc-management/shared/dtos";
import { displayNames } from "@hc-management/shared/localization";
import { joinClassName } from "#/helpers";

// Child components.
import { Form, FormField, TextInput, RadioInput } from "#/components/form";
import MenuItem from "./MenuItem";

// Props.
type MenuItemListPanelProps = {
  onPicked?(pickedMenuItem: MenuItemBasicModel): any;
};

// Component.
export default function MenuItemListPanel(props: MenuItemListPanelProps): React.ReactNode {
  // States.
  const [itemListModel, setItemListModel] = useState<MenuItemListModel>(createMenuItemListModel);
  const [categoryListModel, setCategoryListModel] = useState<MenuCategoryBasicModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Callbacks.
  async function submitAsync(): Promise<MenuItemListResponseDto> {
    return await api.menuItem.getListAsync(itemListModel.toRequestDto());
  }

  function onSubmissionSucceeded(responseDto: MenuItemListResponseDto): void {
    setItemListModel(m => m.mapFromResponseDto(responseDto));
  }

  // Effect.
  useEffect(() => {
    const loadItemListModelAsync = async () => {
      const responseDto = await api.menuItem.getListAsync(itemListModel.toRequestDto());
      setItemListModel(m => m.mapFromResponseDto(responseDto));
    };

    const loadCategoryListModelAsync = async () => {
      const responseDtos = await api.menuCategory.getAllAsync();
      setCategoryListModel(responseDtos.map(createMenuCategoryBasicModel));
    };

    const loadAsync = async () => {
      setIsLoading(true);
      await Promise.all([
        loadItemListModelAsync(),
        loadCategoryListModelAsync()
      ]);
    };

    loadAsync().finally(() => setIsLoading(false));
  }, []);

  // Templates.
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-3">
        <span className="text-primary opacity-50">
          Đang tải
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <Form
        className="flex flex-col gap-3"
        submitAction={submitAsync}
        onSubmissionSucceeded={onSubmissionSucceeded}
      >
        <FormField path="searchContent" displayName={displayNames["searchContent"]} hideLabel>
          <TextInput
            value={itemListModel.searchContent}
            onInput={(searchContent) => setItemListModel(m => ({ ...m, searchContent }))}
          />
        </FormField>

        <FormField path="categoryId" displayName={displayNames["menuCategory"]} hideLabel>
          <div className="flex flex-wrap justify-start items-start gap-2 w-fit">
            {categoryListModel.map((category) => (
              <div
                className="menu-category form-input-group w-fit rounded-lg cursor-pointer hover:shadow-md"
                onClick={() => setItemListModel(m => ({ ...m, category }))}
                key={category.id}
              >
                <div className={joinClassName(
                  "form-input-group-text border-e-0",
                  "in-[.menu-category:hover]:border-blue-600 transition-colors duration-200"
                )}>
                  <RadioInput
                    isChecked={category.id === itemListModel.category?.id}
                    onInput={() => setItemListModel(m => ({ ...m, category }))}
                  />
                </div>

                <div className={joinClassName(
                  "form-control w-fit pe-4 in-[.menu-category:hover]:border-e-blue-600",
                  "in-[.menu-category:hover]:border-t-blue-600 in-[.menu-category:hover]:border-b-blue-600"
                )}>
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </FormField>
      </Form>

      <div className={joinClassName(
        "grid 2xl:grid-cols-7 xl:grid-cols-5 lg:grid-cols-4",
        "md:grid-cols-3 gap-3 justify-start items-start"
      )}>
        {itemListModel.items.map(menuItem => (
          <MenuItem
            model={menuItem}
            onClick={() => props.onPicked?.(menuItem)}
            key={menuItem.id}
          />
        ))}
      </div>
    </div>
  );
}
