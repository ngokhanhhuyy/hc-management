import { useParams, useNavigate } from "@solidjs/router";
import { api, menuCategoryContracts } from "#/api";
import { createMenuCategoryUpsertModel, type MenuCategoryUpsertModel } from "#/models";
import { getMenuCategoryEditorRoutePath } from "#/helpers";

// Child components.
import UpsertPanel from "../base/UpsertPanel";
import { FormField, NumberInput } from "#/components/form";
import { displayNames } from "#/api";

// Components.
export default function MenuItemUpsertPanel(): JSXElement {
  // Dependencies.
  const navigate = useNavigate();
  const params = useParams();

  // States.
  const [model, setModel] = createSignal<MenuCategoryUpsertModel>(createMenuCategoryUpsertModel());

  // Callbacks.
  async function handleCreatingAsync(): Promise<void> {
    await api.menuCategory.createAsync(model().toRequestDto());
  }

  async function handleUpdatingAsync(id: number): Promise<void> {
    await api.menuCategory.updateAsync(id, model().toRequestDto());
  }

  // Life cycle hooks.
  onMount(async () => {
    if (params.id == null) {
      return;
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      navigate(-1, { replace: true });
      return;
    }

    const responseDto = await api.menuCategory.getSingleAsync(id);
    setModel(createMenuCategoryUpsertModel(responseDto));
  });

  // Templates.
  function renderFallback(): JSXElement {
    return (
      <button
        type="button"
        class="btn whitespace-nowrap"
        onClick={() => setModel(previous => ({ ...previous, sortingIndex: 0 }))}
      >
        <i class="bi bi-list-ol" />
        <span>Sử dụng chỉ mục</span>
      </button>
    );
  }

  return (
    <UpsertPanel<MenuCategoryUpsertModel>
      resourceName="category"
      editorRoutePath={getMenuCategoryEditorRoutePath()}
      model={model()}
      nameMaxLength={menuCategoryContracts.nameMaxLength}
      onModelUpdated={updatedData => setModel(previous => ({ ...previous, ...updatedData }))}
      onCreatingAsync={handleCreatingAsync}
      onUpdatingAsync={handleUpdatingAsync}
    >
      <FormField path="sortingIndex" displayName={displayNames.index}>
        <Show when={model().sortingIndex >= 0} fallback={renderFallback()}>
          <div class="peer sorting-index-group form-input-group">
            <NumberInput
              class="border-e-0 z-0"
              value={model().sortingIndex}
              onInput={(sortingIndex) => setModel(previous => ({ ...previous, sortingIndex }))}
            />

            <button
              type="button"
              class="btn btn-danger-outline whitespace-nowrap"
              onClick={() => setModel(previous => ({ ...previous, sortingIndex: -1 }))}
            >
              <i class="bi bi-x-lg" />
              <span>Tắt chỉ mục</span>
            </button>
          </div>
        </Show>
      </FormField>
    </UpsertPanel>
  );
}
