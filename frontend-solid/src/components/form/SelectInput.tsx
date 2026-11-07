import { Portal } from "solid-js/web";
import { joinClassName } from "#/helpers";
import { FormFieldContext } from "./FormField";

// Props.
export type SelectInputProps = {
  value: string;
  onInput(newValue: string): void;
  options: SelectInputOption[];
} & Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onInput">;

export type SelectInputOption = {
  value: string;
  displayName?: string;
};

// Component.
export function SelectInput(props: SelectInputProps): JSXElement {
  // Props.
  const [, domProps] = splitProps(props, ["value", "onInput", "options"]);

  // Dependencies.
  const formFieldContext = useContext(FormFieldContext);

  // States.
  const [isMenuVisible, setIsMenuVisible] = createSignal(false);
  const [menuRect, setMenuRect] = createSignal({ top: 0, left: 0, minWidth: 0 });

  let buttonElement: HTMLButtonElement;
  let portalElement: HTMLDivElement;
  let menuContainerElement: HTMLDivElement;

  const observer: ResizeObserver = new ResizeObserver(updateMenuPosition);

  // Computed.
  const displayName = createMemo<string>(() => {
    const option = props.options.find(o => o.value === props.value);
    if (option) {
      return option.displayName ?? option.value;
    }

    return "";
  });

  const portalClassName = createMemo<string>(() => {
    return joinClassName(
      "fixed inset-0 w-screen h-screen",
      !isMenuVisible() && "pointer-events-none"
    )!;
  });

  const menuContainerClassName = createMemo<string | undefined>(() => {
    let visibilityClassName: string;
    if (isMenuVisible()) {
      visibilityClassName = "opacity-100";
    } else {
      visibilityClassName = "opacity-0 pointer-events-none";
    }

    return joinClassName("absolute z-100 py-2", visibilityClassName);
  });

  const menuContainerStyle = createMemo<string>(() => {
    return (
      `top: ${Math.round(menuRect().top)}px;` +
      `left: ${Math.round(menuRect().left)}px;` +
      `min-width: ${Math.round(menuRect().minWidth)}px`
    );
  });

  const menuClassName = createMemo<string | undefined>(() => {
    return joinClassName(
      "bg-white/75 border border-black/20 shadow-lg backdrop-blur-sm h-fit",
      "rounded-lg transition-opacity duration-50 w-full min-w-fit"
    );
  });

  // Callbacks.
  function updateMenuPosition(): void {
    if (!isMenuVisible()) {
      return;
    }

    const buttonDOMRect: DOMRect = buttonElement.getBoundingClientRect();
    const menuDOMRect: DOMRect = menuContainerElement.getBoundingClientRect();

    let top = buttonDOMRect.bottom;
    const menuFitsBelow = top + menuDOMRect.height <= window.innerHeight;
    if (!menuFitsBelow) {
      top = buttonDOMRect.top - menuDOMRect.height;
    }

    if (top < 0) {
      top = 0;
    }

    let left = buttonDOMRect.left;
    if (left + menuDOMRect.width > window.innerWidth) {
      left = window.innerWidth - menuDOMRect.width;
    }

    if (left < 0) {
      left = 0;
    }

    setMenuRect(previous => ({ ...previous, top, left, minWidth: buttonDOMRect.width }));
  }

  function handleViewportChanged(): void {
    if (!isMenuVisible()) {
      return;
    }

    updateMenuPosition();
  }

  function handleButtonOutsideClicked(event: MouseEvent): void {
    if (!buttonElement.contains(event.target as HTMLElement)) {
      setIsMenuVisible(false);
    }
  }

  // Life cycle hooks.
  onMount(() => {
    observer.observe(buttonElement);
    observer.observe(menuContainerElement);
    document.addEventListener("click", handleButtonOutsideClicked);
    window.addEventListener("resize", handleViewportChanged);
    window.addEventListener("scroll", handleViewportChanged, true);
  });

  onCleanup(() => {
    observer.disconnect();
    document.removeEventListener("click", handleButtonOutsideClicked);
    window.removeEventListener("resize", handleViewportChanged);
    window.removeEventListener("scroll", handleViewportChanged, true);
  });

  createEffect(on(() => isMenuVisible(), () => {
    if (isMenuVisible()) {
      updateMenuPosition();
    }

    if (!portalElement) {
      return;
    }

    portalElement.classList = portalClassName();
  }));

  // Template.
  return (
    <>
      <button
        {...domProps}
        type="button"
        name={formFieldContext?.path()}
        class={joinClassName("form-control cursor-pointer text-start", domProps.class)}
        value={props.value}
        onClick={() => setIsMenuVisible(!isMenuVisible())}
        ref={element => buttonElement = element}
      >
        {displayName()}
      </button>

        <Portal ref={(element) => portalElement = element}>
          <div
            class={menuContainerClassName()}
            style={menuContainerStyle()}
            ref={(element) => menuContainerElement = element}
          >
            <div class={menuClassName()}>
              <ul class="flex flex-col p-2 list-none">
                <For each={props.options}>
                  {(option) => (
                    <li
                      class="flex gap-2 rounded-md px-2 py-1 hover:bg-blue-600 hover:text-white cursor-pointer"
                      onClick={() => props.onInput(option.value)}
                    >
                      <i class={joinClassName("bi bi-check-lg", option.value !== props.value && "invisible")} />
                      <span>{option.displayName ?? option.value}</span>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </div>
        </Portal>
    </>
  );
}
