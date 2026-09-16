import React, { useMemo } from "react";
import { Link } from "react-router";
import { joinClassName } from "#/helpers";
import { getDisplayNameByKey } from "@hc-management/shared/localization";

// Types
export type NavigationBarItemData = {
  name: string;
  displayName?: string;
  routePath: string;
  isDisabled?: boolean;
  Icon?: (props: { isActive: boolean, className?: string, title?: string }) => React.ReactNode;
};

// Props.
export type NavigationBarItemProps = NavigationBarItemData & {
  isActive: boolean;
};

// Components.
export default function NavigationBarItem({ Icon, ...props }: NavigationBarItemProps): React.ReactNode {
  // Computed.
  const displayName = useMemo<string | undefined>(() => {
    return props.displayName ?? getDisplayNameByKey(props.name) ?? "";
  }, []);

  // Template.
  return (
    <Link
      className={joinClassName(
        "flex items-center gap-2 hover:no-underline px-2 py-1.5 border rounded-lg",
        props.isActive && "bg-white border-black/20 font-bold text-blue-700",
        !props.isActive && "border-transparent text-black/75",
        !props.isDisabled && "hover:text-blue-700",
        (!props.isActive && !props.isDisabled) && "hover:bg-black/5",
        (!props.isActive && props.isDisabled) && "pointer-events-none opacity-50"
      )}
      to={props.routePath}
      tabIndex={props.isDisabled ? -1 : undefined}
    >
      {Icon && <Icon className="size-4" isActive={props.isActive} />}
      <span>
        {displayName}
      </span>
    </Link>
  );
}
