import React, { useState } from "react";
import { Outlet } from "react-router";

// Components.
export default function DashboardPage(): React.ReactNode {
  // Templates.
  return (
    <div className="flex flex-col gap-3 size-full">
      <Outlet />
    </div>
  );
}
