import React from "react";
import { Outlet } from "react-router";

// Child components.
import NavigationMenu from "./navigationMenu/NavigationMenu";

// Components.
export function MainPageLayout(): React.ReactNode {
  // Templates.
  return (
    <div className="grid grid-cols-[200px_1fr] max-w-450 mx-auto gap-3 p-3">
      <NavigationMenu />
      <Outlet />
    </div>
  );
}
