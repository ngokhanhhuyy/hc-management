import React, { useState, useRef, useEffect } from "react";
import { useAuthenticationStore } from "#/stores";
import { joinClassName } from "#/helpers";

// Child components.
import { UserIcon } from "@heroicons/react/24/solid";
import ChangePasswordForm from "./ChangePasswordForm";

// Components.
export default function AuthenticatedUserDropDown(): React.ReactNode {
  // Dependencies.
  const authenticationStore = useAuthenticationStore();

  // States.
  const [isUserMenuVisible, setIsUserMenuVisible] = useState<boolean>(false);
  const [isChangePasswordFormVisible, setIsChangePasswordFormVisible] = useState<boolean>(false);
  const userMenuContainerElementRef = useRef<HTMLDivElement | null>(null);

  // Effect.
  useEffect(() => {
    const handleUserMenuVisibility = (event: MouseEvent) => {
      const userMenuContainsClickedElement = userMenuContainerElementRef.current?.contains(event.target as Node);
      console.log(event.target);
      console.log(userMenuContainsClickedElement);
      if (!userMenuContainsClickedElement) {
        setIsUserMenuVisible(false);
      }
    };

    document.addEventListener("click", handleUserMenuVisibility);

    return () => {
      document.removeEventListener("click", handleUserMenuVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isUserMenuVisible) {
      setIsChangePasswordFormVisible(false);
    }
  }, [isUserMenuVisible]);

  // Template.
  return (
    <div className="relative h-full flex justify-start" ref={userMenuContainerElementRef}>
      <button
        type="button"
        className="btn bg-black/5 hover:bg-black/10 border border-black/10 rounded-full h-full aspect-square"
        onClick={() => setIsUserMenuVisible(isVisible => !isVisible)}
      >
        <UserIcon className="opacity-50" />
      </button>

      {isUserMenuVisible && (
        <div className={joinClassName(
          "bg-white border border-black/25 rounded-lg shadow-lg w-60 h-fit absolute",
          "flex flex-col gap-3 p-3 items-center top-full right-0 mt-1"
        )}>
          <div className="bg-black/5 border border-black/10 w-[50%] aspect-square rounded-full p-[15%]">
            <UserIcon className="opacity-50" />
          </div>

          <span>{authenticationStore.authenticatedUser?.userName}</span>

          {isChangePasswordFormVisible ? (
            <ChangePasswordForm onFinished={() => setIsChangePasswordFormVisible(false)} />
          ) : (
            <div className="flex justify-between w-full mt-5">
              <button type="button" className="btn btn-sm" onClick={() => setIsChangePasswordFormVisible(true)}>
                Đổi mật khẩu
              </button>

              <button
                type="button"
                className="btn btn-sm"
                onClick={() => authenticationStore.setAuthenticationUser(null)}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
