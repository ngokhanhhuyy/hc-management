import { useNavigate } from "@solidjs/router";
import type { SeatingBasicModel } from "#/models";
import { getSeatingOrderUpsertRoutePath, joinClassName } from "#/helpers";

// Child components.
import SeatingListItem from "./SeatingListItem";
import { FormField, TextInput } from "#/components/form";

// Props.
type SeatingListPanelProps = {
  model: SeatingBasicModel[];
};

// Components.
export default function SeatingListPanel(props: SeatingListPanelProps): JSXElement {
  // Dependencies.
  const navigate = useNavigate();

  // States.
  let searchContent = $signal<string>("");

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
          <div class="panel-body-area gap-3 p-3">
            <FormField path="searchContent">
              <div class="form-input-group group">
                <span class="form-input-group-text px-2">
                  <i class="bi bi-search" />
                </span>

                <TextInput
                  class={joinClassName("z-0", searchContent && "not-focus:border-e-transparent")}
                  value={searchContent}
                  onInput={(content) => searchContent = content}
                />

                {searchContent && (
                  <button
                    type="button"
                    class="btn btn-danger-outline group-has-[input:focus]:border-s-transparent"
                    onClick={() => searchContent = ""}
                  >
                    <i class="bi bi-x-lg" />
                  </button>
                )}
              </div>
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
    </div>
  );
}
