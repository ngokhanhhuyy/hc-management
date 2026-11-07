import type { MenuCategoryBasicModel } from "#/models";
import { joinClassName } from "#/helpers";

// Props.
type MenuCategoryProps = {
  model: MenuCategoryBasicModel | null;
  isSelected: boolean;
  onSelected(): any;
};

// Components.
export default function MenuCategory(props: MenuCategoryProps): JSXElement {
  // Templates.
  return (
    <button
      type="button"
      class={joinClassName(
        "menu-category btn flex-none w-fit rounded-lg px-3 cursor-pointer",
        "transition-all duration-200 whitespace-nowrap shadow-xs min-w-20",
        !props.isSelected && "shadow-none",
        props.isSelected && "btn-primary",
        !props.isSelected && props.model == null && "btn-primary-outline"
      )}
      onClick={props.onSelected}
    >
      {props.model?.name ?? "Tất cả"}
    </button>
  );
}
