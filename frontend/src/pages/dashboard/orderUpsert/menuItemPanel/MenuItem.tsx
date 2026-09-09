import React from "react";
import type { MenuItemBasicModel } from "#/models";
import { joinClassName, getDisplayAmountText } from "#/helpers";

// Child components.
import { FoodIcon } from "#/components/ui";

// Props.
type MenuItemProps = {
  model: MenuItemBasicModel;
  pickedQuantity: number;
  onClick(): any;
};

// Components.
export default function MenuItem(props: MenuItemProps): React.ReactNode {
  // Templates.
  return (
    <button
      className={joinClassName(
        "menu-item flex flex-col overflow-hidden h-full flex-1 cursor-pointer transition-shadow duration-150",
        "border border-black/10 hover:border-blue-600/50 hover:text-blue-600",
        "rounded-lg hover:shadow-lg transition-all duration-150 relative"
      )}
      onClick={props.onClick}
    >
      <div className={joinClassName(
        "bg-black/5 in-[.menu-item:hover]:bg-blue-600/25",
        "border-b border-black/10 in-[.menu-item:hover]:border-blue-600/20",
        "flex justify-center items-center transition-colors duration-150 aspect-2/1"
      )}>
        <FoodIcon className={joinClassName(
          "in-[.menu-item:hover]:fill-blue-600 size-6 opacity-25 in-[.menu-item:hover]:opacity-50",
          "transition-colors duration-150"
        )} />
      </div>

      <div className={joinClassName(
        "bg-white in-[.menu-item:hover]:bg-blue-600/10 px-2 pt-1 pb-2",
        "flex flex-col justify-center items-start transition-colors duration-150 text-start",
      )}>
        <span className="fw-bold">
          {props.model.name}
        </span>

        <div className="flex justify-between gap-2 w-full">
          <span className={joinClassName(
            "alert alert-blue-outline in-[.menu-item:hover]:alert-blue",
            "alert-sm transition-colors duration-150"
          )}>
            {getDisplayAmountText(props.model.defaultAmountBeforeVatPerUnit, { suffix: " vnđ" })}
          </span>

          {props.model.defaultVatPercentagePerUnit > 0 && (
            <span className={joinClassName(
              "alert alert-emerald-outline in-[.menu-item:hover]:alert-emerald",
              "alert-sm transition-colors duration-150"
            )}>
              {props.model.defaultVatPercentagePerUnit}%
            </span>
          )}
        </div>
      </div>
      
      {props.pickedQuantity > 0 && (
        <div className="alert alert-red-outline in-[.menu-item:hover]:alert-red alert-sm absolute top-1.5 right-1.5 min-w-5">
          {props.pickedQuantity}
        </div>
      )}
    </button>
  );
}
