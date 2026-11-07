import { joinClassName } from "#/helpers";

// Child component.
import BaseModal from "./BaseModal";

// Props.
type YesNoModalProps = {
  title: string;
  renderIcon(className: string): JSXElement;
  questionContent: string | string[];
  yesButtonText?: string;
  yesButtonClassName?: string;
  noButtonText?: string;
  noButtonClassName?: string;
  ref: (handler: YesNoModalHandler) => void;
};

export type YesNoModalHandler = {
  getAnswerAsync(): Promise<boolean>;
};

// Component.
export default function YesNoModal(props: YesNoModalProps): JSXElement {
  // States.
  const [isOpen, setIsOpen] = createSignal(false);
  let answerPromise: ((value: boolean | PromiseLike<boolean>) => void) | null = null;

  // Callbacks.
  function handleYesButtonClicked(): void {
    setIsOpen(false);
    setTimeout(() => {
      answerPromise?.(true);
    }, 200);

  }

  function handleNoButtonClicked(): void {
    setIsOpen(false);
    setTimeout(() => {
      answerPromise?.(false);
    }, 200);
  }

  // Handler.
  const handler: YesNoModalHandler = {
    getAnswerAsync(): Promise<boolean> {
      setIsOpen(true);
      return new Promise<boolean>(resolve => answerPromise = resolve);
    },
  };

  props.ref?.(handler);

  // Template.
  const fallbackElement = <span>{props.questionContent}</span>;

  const footerChildren = (
    <>
      <button
        type="button"
        class={joinClassName("btn h-fit", props.noButtonClassName)}
        onClick={handleNoButtonClicked}
      >
        {props.noButtonText ?? "Không đồng ý"}
      </button>

      <button
        type="button"
        class={joinClassName("btn h-fit", props.yesButtonClassName)}
        onClick={handleYesButtonClicked}
      >
        {props.yesButtonText ?? "Đồng ý"}
      </button>
    </>
  );

  return (
    <BaseModal isOpen={isOpen()} onClosed={() => setIsOpen(false)} title={props.title} footerChildren={footerChildren}>
      <div class="grid grid-cols-[auto_1fr] items-center gap-4 p-5">
        {props.renderIcon("text-3xl shrink-0 grow-0")}
        
        <div class="flex flex-col">
          <Show when={Array.isArray(props.questionContent) && props.questionContent} fallback={fallbackElement}>
            {(sentences) => (
              <For each={sentences()}>
                {(sentence) => <span>{sentence}</span>}
              </For>
            )}
          </Show>
        </div>
      </div>
    </BaseModal>
  );
}
