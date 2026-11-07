import { Portal } from "solid-js/web";
import { joinClassName } from "#/helpers";

// Props.
type BaseModalProps = {
  isOpen: boolean;
  onClosed?(): any;
  title?: string;
  modalClassName?: string;
  headerChildren?: JSXElement | JSXElement[];
  children?: JSXElement | JSXElement[];
  footerChildren?: JSXElement | JSXElement[];
  closeOnEscapeKeyDown?: boolean;
};

export default function BaseModal(props: BaseModalProps) {
  // Computed.
  const backgroundClassName = createMemo<string | undefined>(() => {
    let visibilityClassName = "opacity-0 pointer-events-none";
    if (props.isOpen) {
      visibilityClassName = "opacity-100";
    }

    return joinClassName(
      "w-screen h-screen z-1000 contain-[layout-paint] fixed top-0 left-0 ease-in-out backdrop-blur-lg",
      "bg-black/40 flex justify-center items-center transition-opacity duration-150",
      visibilityClassName
    );
  });

  const modalClassName = createMemo<string | undefined>(() => {
    return joinClassName(
      "bg-white dark:bg-neutral-900 border border-black/50 rounded-xl shadow max-w-lg w-full mx-3 sm:mx-auto",
      props.modalClassName,
    );
  });

  // Callbacks.
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.target !== event.currentTarget) {
      return;
    }

    if ((props.closeOnEscapeKeyDown ?? true) && event.key === "Escape") {
      props.onClosed?.();
    }
  };


  // Effects
  createEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.removeProperty("overflow");
  });

  // Template.
  return (
    <Portal>
      <div
        id="customer-introducer-picker-modal"
        class={backgroundClassName()}
        onKeyDown={handleKeyDown}
      >
        <div class={modalClassName()}>
          {/* Header */}
          <div class={headerClassName}>
            <div class="text-sm font-bold opacity-75">
              {props.title?.toUpperCase()}
            </div>

            {props.headerChildren}
          </div>

          {/* Body */}
          <div class="border-b border-black/15 dark:border-white/10">
            {props.children}
          </div>

          {/* Footer */}
          <div class="flex justify-end gap-2 p-2 dark:border-white/10 rounded-b-xl">
            {props.footerChildren}
          </div>
        </div>
      </div>
    </Portal>
  );
}

const headerClassName = joinClassName(
  "dark:bg-white/10 flex justify-between items-center p-3 rounded-t-xl",
  "border-b border-black/15 dark:border-white/10"
);
