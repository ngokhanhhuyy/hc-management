import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { api } from "#/api";
import { useAuthenticationStore } from "#/stores";
import { getSignInRoutePath } from "#/helpers";

// Child components.
import TopBar from "./topBar/TopBar";
import NavigationMenu from "./navigationMenu/NavigationMenu";

// Components.
export function MainPageLayout(): React.ReactNode {
  // Dependencies.
  const isAuthenticated = useAuthenticationStore(store => store.isAuthenticated);
  const navigate = useNavigate();

  // Effects.
  useEffect(() => {
    const signOutAsync = async () => {
      if (!isAuthenticated) {
        await api.authentication.clearAccessCookieAsync();
        navigate(getSignInRoutePath());
      }
    };

    signOutAsync();
  }, [isAuthenticated]);

  // Templates.
  return (
    <>
      <TopBar />

      <div className="hidden lg:grid grid-cols-[200px_1fr] max-w-350 mx-auto gap-3 p-3 min-h-full mt-(--topbar-height)">
        <NavigationMenu />
        <Outlet />
      </div>

      <div className="flex flex-col lg:hidden justify-center items-center size-full opacity-30">
        <span className="text-2xl">
          Ứng dụng không hỗ trợ kích thước màn hình này
        </span>

        <span className="text-lg">
          Vui lòng sử dụng màn hình có kích thước lớn hơn
        </span>
      </div>
    </>
  );
}
