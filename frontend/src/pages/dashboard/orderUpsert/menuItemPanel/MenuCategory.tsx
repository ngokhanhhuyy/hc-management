import React from "react";
import type { MenuCategoryBasicModel } from "#/models";
import { joinClassName } from "#/helpers";

// Child components.
import { RadioInput } from "#/components/form";

// Props.
type MenuCategoryProps = {
  model: MenuCategoryBasicModel | null;
  isSelected: boolean;
  onSelected(): any;
};

// Components.
export default function MenuCategory(props: MenuCategoryProps): React.ReactNode {
  // Templates.
  return (
    <div
      className="menu-category form-input-group flex-none w-fit rounded-lg cursor-pointer hover:shadow-md"
      onClick={props.onSelected}
    >
      <div className={joinClassName(
        "form-input-group-text border-e-0 transitions-all duration-200",
        props.isSelected ? "bg-blue-600/10 border-blue-600" : "in-[.menu-category:hover]:border-blue-600/50"
      )}>
        <RadioInput isChecked={props.isSelected} onInput={props.onSelected} />
      </div>

      <div className={joinClassName(
        "form-control w-fit ps-2.5 pe-3 transition-colors duration-200 whitespace-nowrap",
        props.isSelected && "bg-blue-600/10 border-blue-600 border-s-blue-600/50",
        !props.isSelected && "in-[.menu-category:hover]:border-e-blue-600/50",
        !props.isSelected && "in-[.menu-category:hover]:border-t-blue-600/50",
        !props.isSelected && "in-[.menu-category:hover]:border-b-blue-600/50"
      )}>
        {props.model?.name ?? "Tất cả"}
      </div>
    </div>
  );
}
