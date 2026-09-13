import React, { useEffect } from "react";
import { useMatches, Outlet } from "react-router";

// Component.
export function RootLayout(): React.ReactNode {
  // Dependencies.
  const matchedRoutes = useMatches();

  // Effect.
  useEffect(() => {
    for (const matchRoute of matchedRoutes.reverse()) {
      const handle = matchRoute.handle;
      if (typeof handle === "object" && handle != null && "pageTitle" in handle) {
        const pageTitle = handle["pageTitle" as keyof typeof handle] as string;
        document.title = `${pageTitle} - HCManagement`;
        break;
      }
    }
  }, [matchedRoutes]);

  // Template.
  return (
    <main className="w-full h-full">
      <Outlet />
    </main>
  );
}
