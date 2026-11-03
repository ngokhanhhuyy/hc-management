import { useParams, useNavigate } from "@solidjs/router";
import { api, menuItemContracts } from "#/api";
import { MenuItemUpsertModel, MenuCategoryBasicModel } from "#/models";
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
  const model = $state<MenuItemUpsertModel>(new MenuItemUpsertModel());
  const categories = $state<MenuCategoryBasicModel[]>([]);
  let isInitialLoaded = $state<boolean>(false);

  // Computed.
  const categoryOptions = $memo<SelectInputOption[]>(() => {
    return [
      { displayName: "Không chọn", value: "" },
      ...categories.map<SelectInputOption>(category => ({
        displayName: category.name,
        value: category.id.toString()
      }))
    ];
  });

  // Callbacks.
  function handleCategoryInput(categoryIdAsString: string): void {
    if (!categoryIdAsString) {
      model.category = null;
      return;
    }

    const index = categories.findIndex(c => c.id === parseInt(categoryIdAsString));
    const category = categories[index];
    model.category = category;
  }

  async function handleCreatingAsync(): Promise<void> {
    await api.menuItem.createAsync(model.toRequestDto());
  }

  async function handleUpdatingAsync(id: number): Promise<void> {
    await api.menuItem.updateAsync(id, model.toRequestDto());
  }

  // Life cycle hooks.
  $mount(async () => {
    const loadCategoriesAsync = async () => {
      const categoryResponseDtos = await api.menuCategory.getAllAsync();
      for (const dto of categoryResponseDtos) {
        categories.push(new MenuCategoryBasicModel(dto));
      }
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
      
      model.mapFromResponseDto(menuItemResponseDto);
    } finally {
      isInitialLoaded = true;
    }
  });

  // Templates.
  return (
    <Show when={isInitialLoaded}>
      <UpsertPanel<MenuItemUpsertModel>
        resourceName="menuItem"
        editorRoutePath={getMenuItemEditorRoutePath()}
        model={model}
        nameMaxLength={menuItemContracts.nameMaxLength}
        onModelUpdated={(mutator) => mutator(model)}
        onCreatingAsync={handleCreatingAsync}
        onUpdatingAsync={handleUpdatingAsync}
      >
        <FormField path="unit">
          <TextInput
            class="z-0"
            value={model.unit}
            onInput={(unit) => model.unit = unit}
          />
        </FormField>
        
        <div class="grid grid-cols-2 gap-3">
          <FormField path="defaultAmountBeforeVatPerUnit">
            <div class="form-input-group">
              <NumberInput
                class="z-0"
                value={model.defaultAmountBeforeVatPerUnit}
                onInput={(defaultAmountBeforeVatPerUnit) => {
                  model.defaultAmountBeforeVatPerUnit = defaultAmountBeforeVatPerUnit;
                }}
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
                value={model.defaultVatPercentagePerUnit}
                onInput={(defaultVatPercentagePerUnit) => {
                  model.defaultVatPercentagePerUnit = defaultVatPercentagePerUnit;
                }}
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
            options={categoryOptions}
            value={model.category?.id.toString() ?? ""}
            onInput={handleCategoryInput}
          />
        </FormField>
      </UpsertPanel>
    </Show>
  );
}
