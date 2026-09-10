import React, { useEffect } from "react";
import { useLocation, useMatches, Outlet } from "react-router";
import { compute, getSignInRoutePath } from "#/helpers";

// Child components.
import NavigationBar from "./navigationMenu/NavigationMenu";
// import ProgressBar from "./progressBar/ProgressBar";

// Component.
export function RootLayout(): React.ReactNode {
  // Dependencies.
  const location = useLocation();
  const matchedRoutes = useMatches();

  // Computed.
  const shouldRenderNavigationBar = compute<boolean>(() => !location.pathname.startsWith(getSignInRoutePath()));

  // Effect.
  useEffect(() => {
    for (const matchRoute of matchedRoutes.reverse()) {
      const handle = matchRoute.handle;
      if (typeof handle === "object" && handle != null && "pageTitle" in handle) {
        const pageTitle = handle["pageTitle" as keyof typeof handle] as string;
        document.title = `${pageTitle} - NATSInternal`;
        break;
      }
    }
  }, [matchedRoutes]);

  // Template.
  return (
    <div id="root-layout">
      <main>
        <Outlet />
        {shouldRenderNavigationBar && <NavigationBar />}
      </main>
    </div>
  );
}
