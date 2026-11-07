import { useMatch, A } from "@solidjs/router";

// Types
export type NavigationBarItemProps = {
  displayName: string;
  routePath: string;
  isDisabled?: boolean;
  children: JSXElement;
};

// Components.
export default function NavigationBarItem(props: NavigationBarItemProps): JSXElement {
  // Dependencies.
  const currentMatch = useMatch(() => `${props.routePath}/*`);

  // Computed.
  const isActive = createMemo(() => Boolean(currentMatch()));
  const isDisabled = createMemo(() => isActive() || props.isDisabled);
  const tabIndex = createMemo(() => {
    if (isDisabled()) {
      return -1;
    }
  });
  
  const className = createMemo(() => {
    const names = ["flex items-center gap-2 hover:no-underline px-2 py-1.5 border rounded-lg w-full"];
    if (isActive()) {
      names.push("bg-white border-black/20 text-blue-700");
    } else {
      names.push("border-transparent text-black/75");
      if (!isDisabled()) {
        names.push("hover:bg-black/5 cursor-pointer");
      } else {
        names.push("pointer-events-none opacity-50");
      }
    }

    if (isDisabled()) {
      names.push("hover:text-blue-700");
    }

    return names.join(" ");
  });

  // Template.
  return (
    <A class={className()} href={props.routePath} tabIndex={tabIndex()}>
      {props.children}
      <span>
        {props.displayName}
      </span>
    </A>
  );
}
