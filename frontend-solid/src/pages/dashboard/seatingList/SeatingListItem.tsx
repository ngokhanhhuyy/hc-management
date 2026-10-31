import type { SeatingBasicModel } from "#/models";
import { joinClassName } from "#/helpers";

// Props.
type SeatingMapItemProps = {
  model: SeatingBasicModel;
  onClick(): any;
};

// Components.
export default function SeatingMapItem(props: SeatingMapItemProps): JSXElement {
  // Templates.
  return (
    <button
      type="button"
      class={joinClassName(
        "seating-list-item flex flex-col border border-black/15 rounded-lg overflow-hidden",
        "hover:border-blue-600/50 hover:shadow-lg cursor-pointer transition-all h-full"
      )}
      onClick={props.onClick}
    >
      <div class={joinClassName(
        "bg-black/5 in-[.seating-list-item:hover]:text-blue-600 in-[.seating-list-item:hover]:bg-blue-600/25",
        "in-[.seating-list-item:hover]:border-blue-600/25",
        "border-b border-black/15 aspect-2/1 flex justify-center items-center transition-colors"
      )}>
        <i class="bi bi-grid opacity-25 in-[.seating-list-item:hover]:opacity-50 transition-all" />
      </div>

      <div class={joinClassName(
        "bg-white flex justify-between items-start p-2 transition-colors flex-1",
        "in-[.seating-list-item:hover]:bg-blue-600/10 in-[.seating-list-item:hover]:text-blue-600"
      )}>
        <span>{props.model.name}</span>

        <Show when={props.model.activeOrder}>
          <div class={joinClassName(
            "alert alert-emerald-outline in-[.seating-list-item:hover]:alert-emerald",
            "top-2 right-2 transition-colors"
          )}>
            Có khách
          </div>
        </Show>
      </div>
    </button>
  );
}
