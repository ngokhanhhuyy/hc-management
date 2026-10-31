import { joinClassName } from "#/helpers";

// Child components.
import BaseModal from "./BaseModal";

// Props.
type ConfirmationModalProps = {
  title: string;
  renderIcon(className: string): JSXElement;
  informationContent: string | string[];
  okButtonText?: string;
  okButtonClassName?: string;
  ref: (handler: ConfirmationModalHandler) => void;
};

// Handler.
export type ConfirmationModalHandler = {
  confirmAsync(): Promise<void>;
};

// Components.
export default function ConfirmationModal(props: ConfirmationModalProps): JSXElement {
  // States.
  let isOpen = $state(false);
  let confirmationPromise: ((value: void | PromiseLike<void>) => void) | null = null;

  // Callbacks.
  const handleOkButtonClicked = () => {
    isOpen = false;
  };

  // Effects.
  $effect(() => {
    if (!isOpen && confirmationPromise != null) {
      confirmationPromise();
    }
  });
  
  // Handler.
  const handler: ConfirmationModalHandler = {
    confirmAsync() {
      isOpen = true;
      return new Promise<void>(resolve => confirmationPromise = resolve);
    },
  };

  props.ref?.(handler);
  
  // Template.
  const fallbackElement = <span>{props.informationContent}</span>;

  const footerChildren = (
    <button
      type="button"
      class={joinClassName("btn h-fit", props.okButtonClassName)}
      onClick={handleOkButtonClicked}
    >
      {props.okButtonText ?? "Đã hiểu"}
    </button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClosed={() => isOpen = false}
      title={props.title}
      footerChildren={footerChildren}
    >
      <div class="grid grid-cols-[auto_1fr] items-center gap-4 p-5">
        {props.renderIcon("text-3xl shrink-0 grow-0")}
        
        <div class="flex flex-col">
          <Show when={Array.isArray(props.informationContent) && props.informationContent} fallback={fallbackElement}>
            {(sentences) => (
              <For each={sentences}>
                {(sentence) => (<span>{sentence}</span>)}
              </For>
            )}
          </Show>
        </div>
      </div>
    </BaseModal>
  );
}
