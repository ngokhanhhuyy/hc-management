import { api, displayNames, type MenuItemListResponseDto } from "#/api";
import {
  createMenuItemListModel, createMenuCategoryBasicModel, type MenuCategoryBasicModel, type MenuItemListModel,
  type MenuItemBasicModel, type OrderItemUpsertModel,
} from "#/models";
import { joinClassName } from "#/helpers";

// Child components.
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
export default function MenuItemListPanel(props: MenuItemListPanelProps): JSXElement {
  // States.
  const [itemListModel, setItemListModel] = createSignal<MenuItemListModel>(createMenuItemListModel());
  const [categoryListModel, setCategoryListModel] = createSignal<MenuCategoryBasicModel[]>([]);
  const [loadingState, setLoadingState] = createSignal<"initialLoading" | "reloading" | null>("initialLoading");
  let lastRequestId = 0;

  // Computed.
  const reloadFilters = createMemo(() => [
    itemListModel().page,
    itemListModel().pageCount,
    itemListModel().searchContent,
    itemListModel().category?.id,
  ] as const, undefined, {
    equals: (previous, next) => previous.every((value, index) => value === next[index])
  });

  // Callbacks.
  function getPageButtonClassName(_: number, isActive: boolean): string {
    if (isActive) {
      return "btn btn-primary";
    }

    return "btn";
  }

  function handleSearchCleared(): void {
    setItemListModel(previous => ({ ...previous, searchContent: "", page: 1, category: null }));
  }

  function handleCategorySelected(category: MenuCategoryBasicModel | null): void {
    setItemListModel(previous => ({ ...previous, page: 1, category }));
  }

  async function submitAsync(): Promise<MenuItemListResponseDto> {
    return await api.menuItem.getListAsync(itemListModel().toRequestDto());
  }

  function onSubmissionSucceeded(responseDto: MenuItemListResponseDto): void {
    setItemListModel(previous => previous.mapFromResponseDto(responseDto));
  }

  // Life cycle.
  onMount(async () => {
    try {
      const [itemListResponseDto, categoryResponseDtos] = await Promise.all([
        api.menuItem.getListAsync(itemListModel().toRequestDto()),
        api.menuCategory.getAllAsync()
      ]);

      setItemListModel(previous => previous.mapFromResponseDto(itemListResponseDto));
      setCategoryListModel(categoryResponseDtos.map(createMenuCategoryBasicModel));
    } finally {
      setLoadingState(null);
    }
  });

  createEffect(on(reloadFilters, async () => {
      const requestId = lastRequestId += 1;
      const itemListResponseDto = await api.menuItem.getListAsync(itemListModel().toRequestDto());

      if (lastRequestId === requestId) {
        setItemListModel(previous => previous.mapFromResponseDto(itemListResponseDto));
        window.scrollTo({ top: 0, behavior: "smooth" });
        setLoadingState(null);
      }
    }));

  // Templates.
  const spinner = (
    <div class="flex flex-col justify-center items-center h-full gap-3">
      <span class="text-primary opacity-50">
        Đang tải
      </span>
    </div>
  );

  const gridFallback = (
    <div class="opacity-30 py-10">
      Không tìm thấy kết quả
    </div>
  );

  return (
    <Show when={loadingState() !== "initialLoading"} fallback={spinner}>
      <div class={joinClassName("flex flex-col gap-3 h-full", props.disabled && "opacity-50 pointer-events-none")}>
        <div class="panel">
          <div class="panel-header">
            <span class="panel-header-title">
              Danh sách món ăn
            </span>
          </div>

          <div class="panel-body flex flex-col">
            <Form
              class="panel-body-area flex flex-col gap-3 m-3 p-3"
              action={submitAsync}
              onSucceeded={onSubmissionSucceeded}
            >
              <FormField path="searchContent" displayName={displayNames["searchContent"]} hideLabel>
                <div class="form-input-group">
                  <div class="form-input-group-text px-2">
                    <i class="bi bi-search size-4.5" />
                  </div>

                  <TextInput
                    class={joinClassName("z-0", itemListModel().searchContent && "rounded-e-none")}
                    placeholder="Tìm kiếm tên món ăn ..."
                    value={itemListModel().searchContent}
                    onInput={(searchContent) => setItemListModel(previous => ({ ...previous, searchContent }))}
                  />

                  <Show when={itemListModel().searchContent}>
                    <button
                      type="button"
                      class="btn border-s-0"
                      onClick={handleSearchCleared}
                    >
                      <i class="bi bi-x-lg" />
                    </button>
                  </Show>
                </div>
              </FormField>

              <FormField path="categoryId" displayName={displayNames.category} hideLabel>
                <div class="flex flex-row flex-wrap justify-start items-start gap-2">
                  <MenuCategory
                    model={null}
                    isSelected={itemListModel().category?.id == null}
                    onSelected={() => handleCategorySelected(null)}
                  />

                  <For each={categoryListModel()}>
                    {(category) => (
                      <MenuCategory
                        model={category}
                        isSelected={itemListModel().category?.id === category.id}
                        onSelected={() => handleCategorySelected(category)}
                      />
                    )}
                  </For>
                </div>
              </FormField>
            </Form>

            <div class="flex flex-col justify-center items-center gap-3 p-3 border-t border-black/15">
              <Show when={itemListModel().items.length > 0} fallback={gridFallback}>
                <div class={joinClassName(
                  "grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-3 justify-start items-start",
                  "w-full transition-opacity",
                  loadingState() === "reloading" && "opacity-50"
                )}>
                  <For each={itemListModel().items}>
                    {(menuItem) => (
                      <MenuItem
                        model={menuItem}
                        pickedOrderItems={props.pickedOrderItems}
                        onClick={() => props.onPicked?.(menuItem)}
                      />
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>

          <Show when={itemListModel().pageCount > 1}>
            <div class="panel-footer">
              <Paginator
                page={itemListModel().page}
                pageCount={itemListModel().pageCount}
                onPageChanged={(page) => setItemListModel(previous => ({ ...previous, page }))}
                getPageButtonClassName={getPageButtonClassName}
              />
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
}
