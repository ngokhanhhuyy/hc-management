import { api, displayNames, MenuItemListSortingCriterion } from "#/api";
import {
  MenuCategoryBasicModel,
  MenuItemListModel,
  type MenuItemBasicModel} from "#/models";
import {
  getMenuItemEditorRoutePath,
  getMenuItemEditorCreateRoutePath,
  getMenuItemEditorUpdateRoutePath,
  joinClassName,
  compute,
  getDisplayNameByKey
} from "#/helpers"; 

// Child components.
import EditorPage from "../base/EditorPage";
import { FormField, TextInput, SelectInput, type SelectInputOption } from "#/components/form";
import { Paginator } from "#/components/ui"; 

// Props.
type MenuItemEditorPageProps = {
  children?: JSXElement;
};

// Components.
export default function MenuItemEditorPage(props: MenuItemEditorPageProps): JSXElement {
  // States.
  const model = $state<MenuItemListModel>(new MenuItemListModel());
  const categories = $state<MenuCategoryBasicModel[]>([]);
  let latestRequestId = -1;

  // Computed.
  const categoryOptions = $memo<SelectInputOption[]>(() => {
    return [
      { displayName: "Tất cả", value: "" },
      ...categories.map<SelectInputOption>(category => ({ displayName: category.name, value: category.id.toString() }))
    ];
  });

  const criterionOptions = compute<SelectInputOption[]>(() => {
    return Object
      .entries(MenuItemListSortingCriterion)
      .map<SelectInputOption>(([key, value]) => ({
        displayName: getDisplayNameByKey(key[0].toLowerCase() + key.slice(1)) ?? key,
        value: value.toString()
      }));
  });

  // Callbacks.
  function handleCategoryInput(categoryIdAsString: string): void {
    if (!categoryIdAsString) {
      model.category = null;
      return;
    }

    const id = parseInt(categoryIdAsString);
    const index = categories.findIndex(c => c.id === id);
    const category = categories[index];
    if (category) {
      model.category = category;
    }
  }

  function handleSortingByCriterionInput(criterionAsString: string): void {
    const key = criterionAsString[0].toUpperCase() + criterionAsString.slice(1);
    const criterion = MenuItemListSortingCriterion[key as keyof typeof MenuItemListSortingCriterion];
    if (criterion) {
      model.sortByCriterion = criterion;
    }
  }

  async function handleReloadAsync(): Promise<void> {
    const requestId = latestRequestId += 1;
    const responseDtos = await api.menuItem.getListAsync(model.toRequestDto());

    if (latestRequestId == requestId) {
      model.mapFromResponseDto(responseDtos);
    }
  }

  function handleItemRemoved(id: number): void {
    const index = model.items.findIndex(i => i.id === id);
    if (index > -1) {
      model.items.splice(index, 1);
    }
  }

  // Life cycle hooks.
  $mount(async () => {
    const loadCategoriesAsync = async (): Promise<void> => {
      const responseDtos = await api.menuCategory.getAllAsync();
      for (const dto of responseDtos) {
        categories.push(new MenuCategoryBasicModel(dto));
      }
    };

    const loadListAsync = async (): Promise<void> => {
      const responseDto = await api.menuItem.getListAsync(model.toRequestDto());
      model.mapFromResponseDto(responseDto);
    };

    await Promise.all([loadCategoriesAsync(), loadListAsync()]);
  });

  $watch(
    [model.sortByAscending, model.sortByCriterion, model.page, model.searchContent, model.category],
    handleReloadAsync,
    { immediate: true }
  );

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
      onItemRemoved={(id) => handleItemRemoved(id)}
      renderItemIcon={(className) => (<i class={joinClassName("bi bi-grid", className)} />)}
      renderItemDescription={(item) => (
        <div class="flex gap-1">
          {item.category && (
            <div class="alert alert-blue-outline alert-sm gap-0.5">
              <i class="bi bi-tag" />
              <span>{item.category.name}</span>
            </div>
          )}

          <div class="alert alert-emerald-outline alert-sm gap-0.5">
            <i class="bi bi-currency-dollar" />
            <span>{item.displayDefaultAmountBeforeVatPerUnit}</span>
          </div>
        </div>
      )}
      renderUpperArea={(isEditorRoutePath, semiTransparentClassName) => (
        <div class="bg-black/2.5 border border-black/10 rounded-lg">
          <div class={joinClassName("gap-3 p-3 pt-2 grid grid-cols-2", !isEditorRoutePath && semiTransparentClassName)}>
            <FormField class="col-span-2" path="searchContent">
              <TextInput
                value={model.searchContent}
                onInput={(searchContent) => model.searchContent = searchContent}
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
      renderLowerArea={(isEditorRoutePath, semiTransparentClassName) => (
        <Show when={model.pageCount > 1}>
          <Paginator
            class={joinClassName(!isEditorRoutePath && semiTransparentClassName)}
            page={model.page}
            pageCount={model.pageCount}
            onPageChanged={(page) => model.page = page}
            getPageButtonClassName={(_, isActive) => isActive ? "btn btn-primary" : "btn"}
          />
        </Show>
      )}
    >
      {props.children}
    </EditorPage>
  );
}
