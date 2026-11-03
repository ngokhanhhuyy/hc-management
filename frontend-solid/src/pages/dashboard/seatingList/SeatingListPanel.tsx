import { useNavigate } from "@solidjs/router";
import { MenuItemListSortingCriterion } from "#/api";
import type { SeatingBasicModel } from "#/models";
import { getSeatingOrderUpsertRoutePath, joinClassName, compute, getDisplayNameByKey } from "#/helpers";

// Child components.
import SeatingListItem from "./SeatingListItem";
import { FormField, TextInput, SelectInput, type SelectInputOption } from "#/components/form";

// Props.
type SeatingListPanelProps = {
  model: SeatingBasicModel[];
};

// Components.
export default function SeatingListPanel(props: SeatingListPanelProps): JSXElement {
  // Dependencies.
  const navigate = useNavigate();

  // States.
  const filters = $state<{ searchContent: string, criterion: string | null; }>({
    searchContent: "",
    criterion: null,
  });

  // Computed.
  const criterionOptions = compute<SelectInputOption[]>(() => {
    const options: SelectInputOption[] = [{ value: "", displayName: "Không thiết lập" }];
    for (const criterion of Object.values(MenuItemListSortingCriterion)) {
      const key = criterion[0].toLocaleLowerCase() + criterion.slice(1);
      options.push({ value: criterion, displayName: getDisplayNameByKey(key) ?? undefined });
    }

    return options;
  });

  // Life cycle hooks.
  $mount(() => {
    filters.criterion = criterionOptions[1].value;
  });

  // Templates.
  return (
    <div class="panel">
      <div class="panel-header">
        <span class="panel-header-title">
          Danh sách bàn ăn
        </span>
      </div>

      <div class="panel-body flex flex-col">
        <div class="p-3 border-b border-black/10">
          <div class="panel-body-area grid grid-cols-[3fr_1fr] gap-3 p-3">
            <FormField path="searchContent">
              <div class="form-input-group group">
                <span class="form-input-group-text px-2">
                  <i class="bi bi-search" />
                </span>

                <TextInput
                  class={joinClassName("z-0", filters.searchContent && "not-focus:border-e-transparent")}
                  value={filters.searchContent}
                  onInput={(content) => filters.searchContent = content}
                />

                <Show when={filters.searchContent}>
                  <button
                    type="button"
                    class="btn btn-danger-outline group-has-[input:focus]:border-s-transparent"
                    onClick={() => filters.searchContent = ""}
                  >
                    <i class="bi bi-x-lg" />
                  </button>
                </Show>
              </div>
            </FormField>

            <FormField path="sortByCriterion">
              <SelectInput
                value={filters.criterion ?? ""}
                onInput={(criterionAsString) => filters.criterion = criterionAsString || null}
                options={criterionOptions}
              />
            </FormField>
          </div>
        </div>

        <div class="grid xl:grid-cols-6 lg:grid-cols-5 items-start gap-3 p-3">
          <For each={props.model}>
            {(seating) => (
              <SeatingListItem
                model={seating}
                onClick={() => navigate(getSeatingOrderUpsertRoutePath(seating.id))}
              />
            )}
          </For>
        </div>
      </div>

      <div class="panel-footer p-3">
        <FormField path="sortByCriterion">
          <SelectInput
            value={filters.criterion ?? ""}
            onInput={(criterionAsString) => filters.criterion = criterionAsString || null}
            options={criterionOptions}
          />
        </FormField>
      </div>
    </div>
  );
}
