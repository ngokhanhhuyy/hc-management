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

export function BaseModal(props: BaseModalProps) {
  // States.
  let elementRef: HTMLDivElement | null;

  // Computed.
  const backgroundClassName = $memo<string | undefined>(() => {
    return joinClassName(
      "w-screen h-screen z-1000 contain-[layout-paint]0 fixed top-0 left-0 ease-in-out backdrop-blur-lg",
      props.isOpen ? "flex justify-center items-center" : "hidden"
    );
  });

  const modalClassName = $memo<string | undefined>(() => {
    return joinClassName(
      "bg-white dark:bg-neutral-900 border border-black/25 rounded-xl shadow max-w-lg w-full mx-3 sm:mx-auto",
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
  $effect(() => {
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
        ref={(element) => elementRef = element}
        id="customer-introducer-picker-modal"
        class={backgroundClassName}
        onKeyDown={handleKeyDown}
      >
        <div class={modalClassName}>
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
