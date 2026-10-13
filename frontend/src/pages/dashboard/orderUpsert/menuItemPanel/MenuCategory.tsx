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
    <button
      type="button"
      className={joinClassName(
        "menu-category btn flex-none w-fit rounded-lg px-3 cursor-pointer",
        "transition-all duration-200 whitespace-nowrap shadow-xs min-w-20",
        !props.isSelected && "shadow-none",
        props.isSelected ? "btn-primary" : (props.model == null && "btn-primary-outline")
      )}
      onClick={props.onSelected}
    >
      {props.model?.name ?? "Tất cả"}
    </button>
  );
}
