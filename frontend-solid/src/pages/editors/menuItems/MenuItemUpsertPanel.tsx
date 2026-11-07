import { useParams, useNavigate } from "@solidjs/router";
import { api, menuItemContracts } from "#/api";
import {
  createMenuItemUpsertModel, createMenuCategoryBasicModel, type MenuItemUpsertModel, type MenuCategoryBasicModel,
} from "#/models";
import { displayNames } from "#/api";
import { getMenuItemEditorRoutePath } from "#/helpers";

// Child components.
import UpsertPanel from "../base/UpsertPanel";
import { FormField, TextInput, NumberInput, SelectInput, type SelectInputOption } from "#/components/form"; 

// Components.
export default function MenuItemUpsertPanel(): JSXElement {
  // Dependencies.
  const params = useParams();
  const navigate = useNavigate();

  // States.
  const [model, setModel] = createSignal<MenuItemUpsertModel>(createMenuItemUpsertModel());
  const [categories, setCategories] = createSignal<MenuCategoryBasicModel[]>([]);
  const [isInitiallyLoaded, setIsInitiallyLoaded] = createSignal<boolean>(false);

  // Computed.
  const categoryOptions = createMemo<SelectInputOption[]>(() => {
    return [
      { displayName: "Không chọn", value: "" },
      ...categories().map<SelectInputOption>(category => ({
        displayName: category.name,
        value: category.id.toString()
      }))
    ];
  });

  // Callbacks.
  function handleCategoryInput(categoryIdAsString: string): void {
    if (!categoryIdAsString) {
      setModel(previous => ({ ...previous, category: null }));
      return;
    }

    const index = categories().findIndex(c => c.id === parseInt(categoryIdAsString));
    const category = categories()[index];
    setModel(previous => ({ ...previous, category }));
  }

  function handleAmountBeforeVatInput(defaultAmountBeforeVatPerUnit: number): void {
    setModel(previous => ({ ...previous, defaultAmountBeforeVatPerUnit }));
  }

  function handleVatPercentageInput(defaultVatPercentagePerUnit: number): void {
    setModel(previous => ({ ...previous, defaultVatPercentagePerUnit }));
  }

  async function handleCreatingAsync(): Promise<void> {
    await api.menuItem.createAsync(model().toRequestDto());
  }

  async function handleUpdatingAsync(id: number): Promise<void> {
    await api.menuItem.updateAsync(id, model().toRequestDto());
  }

  // Life cycle hooks.
  onMount(async () => {
    const loadCategoriesAsync = async () => {
      const categoryResponseDtos = await api.menuCategory.getAllAsync();
      setCategories(categoryResponseDtos.map(createMenuCategoryBasicModel));
    };

    try {
      if (!params.id) {
        await loadCategoriesAsync();
        return;
      }

      const id = parseInt(params.id);
      if (isNaN(id)) {
        navigate(-1, { replace: true });
        return;
      }

      const [menuItemResponseDto] = await Promise.all([
        api.menuItem.getDetailAsync(id),
        loadCategoriesAsync()
      ]);
      
      setModel(createMenuItemUpsertModel(menuItemResponseDto));
    } finally {
      setIsInitiallyLoaded(true);
    }
  });

  // Templates.
  return (
    <Show when={isInitiallyLoaded()}>
      <UpsertPanel<MenuItemUpsertModel>
        resourceName="menuItem"
        editorRoutePath={getMenuItemEditorRoutePath()}
        model={model()}
        nameMaxLength={menuItemContracts.nameMaxLength}
        onModelUpdated={updatedData => setModel(previous => ({ ...previous, ...updatedData }))}
        onCreatingAsync={handleCreatingAsync}
        onUpdatingAsync={handleUpdatingAsync}
      >
        <FormField path="unit">
          <TextInput
            class="z-0"
            value={model().unit}
            onInput={(unit) => setModel(previous => ({ ...previous, unit }))}
          />
        </FormField>
        
        <div class="grid grid-cols-2 gap-3">
          <FormField path="defaultAmountBeforeVatPerUnit">
            <div class="form-input-group">
              <NumberInput
                class="z-0"
                value={model().defaultAmountBeforeVatPerUnit}
                onInput={handleAmountBeforeVatInput}
                min={0}
                max={99_999_999}
              />

              <span class="form-input-group-text">
                vnđ
              </span>
            </div>
          </FormField>

          <FormField path="defaultVatPercentagePerUnit">
            <div class="form-input-group">
              <NumberInput
                class="z-0"
                value={model().defaultVatPercentagePerUnit}
                onInput={handleVatPercentageInput}
                min={0}
                max={100}
              />

              <span class="form-input-group-text">
                %
              </span>
            </div>
          </FormField>
        </div>

        <FormField path="categoryId" displayName={displayNames.category}>
          <SelectInput
            options={categoryOptions()}
            value={model().category?.id.toString() ?? ""}
            onInput={handleCategoryInput}
          />
        </FormField>
      </UpsertPanel>
    </Show>
  );
}
