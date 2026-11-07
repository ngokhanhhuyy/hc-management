import type { MenuItemBasicModel, OrderItemUpsertModel } from "#/models";
import { joinClassName, getDisplayAmountText } from "#/helpers";

// Props.
type MenuItemProps = {
  model: MenuItemBasicModel;
  pickedOrderItems: OrderItemUpsertModel[];
  class?: string;
  onClick(): any;
};

// Components.
export default function MenuItem(props: MenuItemProps): JSXElement {
  // Computed.
  const pickedQuantity = createMemo(() => {
    return props.pickedOrderItems
      .filter(pi => pi.menuItem.id == props.model.id)
      .reduce((total, item) => total + item.quantity, 0);
  });

  // Templates.
  return (
    <button
      class={joinClassName(
        "menu-item flex flex-col overflow-hidden h-full flex-1 cursor-pointer transition-shadow duration-150",
        "border border-black/10 hover:border-blue-600/50 hover:text-blue-600",
        "rounded-lg hover:shadow-lg transition-all duration-150 relative",
        props.class
      )}
      onClick={props.onClick}
    >
      <div class={joinClassName(
        "bg-black/5 in-[.menu-item:hover]:bg-blue-600/25",
        "border-b border-black/10 in-[.menu-item:hover]:border-blue-600/20",
        "flex justify-center items-center transition-colors duration-150 aspect-2/1"
      )}>
        <i class={joinClassName(
          "bi bi-fork-knife in-[.menu-item:hover]:fill-blue-600 size-6",
          "opacity-25 in-[.menu-item:hover]:opacity-50 transition-colors duration-150"
        )} />
      </div>

      <div class={joinClassName(
        "bg-white in-[.menu-item:hover]:bg-blue-600/10 px-2 pt-1 pb-2",
        "flex flex-col flex-1 justify-between items-start transition-colors duration-150 text-start",
      )}>
        <span class="fw-bold">
          {props.model.name}
        </span>

        <div class="flex justify-between gap-2 w-full">
          <span class={joinClassName(
            "alert alert-blue-outline in-[.menu-item:hover]:alert-blue",
            "alert-sm transition-colors duration-150"
          )}>
            {getDisplayAmountText(props.model.defaultAmountBeforeVatPerUnit, { suffix: " vnđ" })}
          </span>

          <Show when={props.model.defaultVatPercentagePerUnit > 0}>
            <span class={joinClassName(
              "alert alert-emerald-outline in-[.menu-item:hover]:alert-emerald",
              "alert-sm transition-colors duration-150"
            )}>
              {props.model.defaultVatPercentagePerUnit}%
            </span>
          </Show>
        </div>
      </div>

      <Show when={pickedQuantity() > 0}>
        <div class={joinClassName(
          "alert alert-red-outline in-[.menu-item:hover]:alert-red",
          "alert-sm absolute top-1.5 right-1.5 min-w-5"
        )}>
          {pickedQuantity()}
        </div>
      </Show>
    </button>
  );
}
