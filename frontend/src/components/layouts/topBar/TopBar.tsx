import React, { useState, useRef, useEffect } from "react";
import logoUrl from "#/assets/images/logo.png";

// Child components.
import AuthenticatedUserDropDown from "./AuthenticatedUserDropDown";

// Components.
export default function TopBar(): React.ReactNode {
  // Template.
  return (
    <div className="bg-white border-b border-black/15 fixed top-0 left-0 w-full h-(--topbar-height) z-10">
      <div className="flex justify-between gap-5 items-center p-2 max-w-350 mx-auto h-full">
        <div className="flex gap-3 items-center h-full">
          <img src={logoUrl} className="h-full rounded-full m-0.5" />
          <div className="flex flex-col">
            <span className="uppercase">Quán nhậu sân vườn</span>
            <span className="text-sm opacity-50">117/14 Nguyễn Hữu Thấu, BMT</span>
          </div>
        </div>

        <AuthenticatedUserDropDown />
      </div>
    </div>
  );
}
