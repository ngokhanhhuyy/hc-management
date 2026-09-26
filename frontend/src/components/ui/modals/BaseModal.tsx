import React, { useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { joinClassName } from "#/helpers";

// Props.
type BaseModalProps = {
  isOpen: boolean;
  onClosed?(): any;
  title?: string;
  modalClassName?: string;
  headerChildren?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[];
  footerChildren?: React.ReactNode | React.ReactNode[];
  closeOnEscapeKeyDown?: boolean;
};

export default function BaseModal(props: BaseModalProps) {
  // States.
  const elementRef = useRef<HTMLDivElement | null>(null);

  // Callbacks.
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if ((props.closeOnEscapeKeyDown ?? true) && event.key === "Escape") {
      props.onClosed?.();
    }
  }, [props.closeOnEscapeKeyDown]);


  // Effects
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.removeProperty("overflow");
  }, [props.isOpen]);

  // Template.
  return createPortal((
    <div
      ref={elementRef}
      id="customer-introducer-picker-modal"
      className={joinClassName(
        "w-screen h-screen z-1000 contain-[layout-paint]0 fixed top-0 left-0 ease-in-out backdrop-blur-lg",
        props.isOpen ? "flex justify-center items-center" : "hidden"
      )}
      onKeyDown={handleKeyDown}
    >
      <div className={joinClassName(
        "bg-white dark:bg-neutral-900 border border-black/25 rounded-xl shadow max-w-lg w-full mx-3 sm:mx-auto",
        props.modalClassName,
      )}>
        {/* Header */}
        <div className={joinClassName(
          "dark:bg-white/10 flex justify-between items-center p-3 rounded-t-xl",
          "border-b border-black/15 dark:border-white/10"
        )}>
          <div className="text-sm font-bold opacity-75">
            {props.title && props.title.toUpperCase()}
          </div>

          {props.headerChildren}
        </div>

        {/* Body */}
        <div className="border-b border-black/15 dark:border-white/10">
          {props.children}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-2 dark:border-white/10 rounded-b-xl">
          {props.footerChildren}
        </div>
      </div>
    </div>
  ), document.body);
}
