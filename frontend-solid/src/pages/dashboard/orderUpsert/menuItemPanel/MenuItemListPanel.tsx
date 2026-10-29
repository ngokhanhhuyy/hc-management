import { api, displayNames, type MenuItemListResponseDto } from "#/api";
import {
  MenuCategoryBasicModel,
  MenuItemListModel,
  type MenuItemBasicModel,
  type OrderItemUpsertModel
} from "#/models";
import { joinClassName } from "#/helpers";

// Child components.
import { Form, FormField, TextInput } from "#/components/form";
// import { Paginator } from "#/components/ui";
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
  const itemListModel = $mutable<MenuItemListModel>(new MenuItemListModel());
  const categoryListModel = $mutable<MenuCategoryBasicModel[]>([]);
  let loadingState = $signal<"initialLoading" | "reloading" | null>("initialLoading");
  let lastRequestId = 0;

  // Callbacks.
  async function submitAsync(): Promise<MenuItemListResponseDto> {
    return await api.menuItem.getListAsync(itemListModel.toRequestDto());
  }

  function onSubmissionSucceeded(responseDto: MenuItemListResponseDto): void {
    itemListModel.mapFromResponseDto(responseDto);
  }

  // Life cycle.
  $mount(async () => {
    try {
      const [itemListResponseDto, categoryResponseDtos] = await Promise.all([
        api.menuItem.getListAsync(itemListModel.toRequestDto()),
        api.menuCategory.getAllAsync()
      ]);

      itemListModel.mapFromResponseDto(itemListResponseDto);
      categoryListModel.push(...categoryResponseDtos.map(dto => new MenuCategoryBasicModel(dto)));
    } finally {
      loadingState = null;
    }
  });

  $watch(
    [itemListModel.page, itemListModel.pageCount, itemListModel.searchContent, itemListModel.category?.id],
    async () => {
      const requestId = lastRequestId += 1;
      const itemListResponseDto = await api.menuItem.getListAsync(itemListModel.toRequestDto());

      if (lastRequestId === requestId) {
        itemListModel.mapFromResponseDto(itemListResponseDto);
        window.scrollTo({ top: 0, behavior: "smooth" });
        loadingState = null;
      }
    });

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
    <Show when={loadingState !== "initialLoading"} fallback={spinner}>
      <div class={joinClassName("flex flex-col gap-3 h-full", props.disabled && "opacity-50 pointer-events-none")}>
        <div class="panel">
          <div class="panel-header">
            <span class="panel-header-title">
              Danh sách món ăn
            </span>
          </div>

          <div class="panel-body flex flex-col">
            <Form
              class="bg-black/5 border border-black/10 rounded-lg flex flex-col gap-3 m-3 p-3"
              action={submitAsync}
              onSucceeded={onSubmissionSucceeded}
            >
              <FormField path="searchContent" displayName={displayNames["searchContent"]} hideLabel>
                <div class="form-input-group">
                  <div class="form-input-group-text px-2">
                    <i class="bi bi-search size-4.5" />
                  </div>

                  <TextInput
                    class={joinClassName("z-0", itemListModel.searchContent && "rounded-e-none")}
                    placeholder="Tìm kiếm tên món ăn ..."
                    value={itemListModel.searchContent}
                    onInput={(searchContent) => itemListModel.searchContent = searchContent}
                  />

                  <Show when={itemListModel.searchContent}>
                    <button
                      type="button"
                      class="btn border-s-0"
                      onClick={() => $batch(() => {
                        itemListModel.searchContent = "";
                        itemListModel.page = 1;
                        itemListModel.category = null;
                      })}
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
                    isSelected={itemListModel.category?.id == null}
                    onSelected={() => $batch(() => {
                      itemListModel.page = 1;
                      itemListModel.category = null;
                    })}
                  />

                  <For each={categoryListModel}>
                    {(category) => (
                      <MenuCategory
                        model={category}
                        isSelected={itemListModel.category?.id === category.id}
                        onSelected={() => $batch(() => {
                          itemListModel.category = category;
                          itemListModel.page = 1;
                        })}
                      />
                    )}
                  </For>
                </div>
              </FormField>
            </Form>

            <div class="flex flex-col justify-center items-center gap-3 p-3 border-t border-black/15">
              <Show when={itemListModel.items.length > 0} fallback={gridFallback}>
                <For each={itemListModel.items}>
                  {(menuItem) => (
                    <MenuItem
                      model={menuItem}
                      pickedOrderItems={props.pickedOrderItems}
                      onClick={() => props.onPicked?.(menuItem)}
                    />
                  )}
                </For>
              </Show>
            </div>
          </div>

          {/* {itemListModel.pageCount > 1 && (
            <div class="panel-footer">
              <Paginator
                page={itemListModel.page}
                pageCount={itemListModel.pageCount}
                onPageChanged={(page) => setItemListModel(m => ({ ...m, page }))}
                getPageButtonClassName={(_, isActive) => isActive ? "btn btn-primary" : "btn"}
              />
            </div>
          )} */}
        </div>
      </div>
    </Show>
  );
}
