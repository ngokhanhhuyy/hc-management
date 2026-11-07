import { getPaginationRange, joinClassName, type PaginationRange } from "#/helpers";

// Types.
type PaginationRanges = {
  smScreen: PaginationRange;
  xsScreen: PaginationRange;
};

export type PaginatorProps = {
  page: number;
  pageCount: number;
  onPageChanged: (page: number) => any;
  getPageButtonClassName?: (page: number, isActive: boolean) => string | null | undefined;
} & HTMLAttributes<HTMLDivElement>;

export function Paginator(props: PaginatorProps): JSXElement {
  // Props.
  const [local, domProps] = splitProps(props, [
    "page", "pageCount", "onPageChanged", "class", "getPageButtonClassName"
  ]);

  // Computed.
  const paginationRanges = createMemo<PaginationRanges>(() => ({
    smScreen: getPaginationRange({
      currentPage: local.page,
      pageCount: local.pageCount,
      visibleButtons: 5
    }),
    xsScreen: getPaginationRange({
      currentPage: local.page,
      pageCount: local.pageCount,
      visibleButtons: 3
    }),
  }));

  const isPageExceedingXsScreenRange = (page: number) => {
    return page < paginationRanges().xsScreen.startingPage || page > paginationRanges().xsScreen.endingPage;
  };

  const isPageExceedingSmScreenRange = (page: number) => {
    return page < paginationRanges().smScreen.startingPage || page > paginationRanges().smScreen.endingPage;
  };

  // Callbacks.
  function handlePageButtonClick(buttonPage: number): void {
    props.onPageChanged(buttonPage);
  }

  // Template.
  const renderPageWithNumberButtons = (): JSXElement => {
    const startingPage = paginationRanges().smScreen.startingPage;
    const endingPage = paginationRanges().smScreen.endingPage;
    const arrayLength = endingPage - (startingPage - 1);

    return (
      <For each={Array.from({ length: arrayLength }, (_, index) => index + startingPage)}>
        {(page) => (
          <button
            type="button"
            class={joinClassName(
              "min-w-8.5",
              isPageExceedingXsScreenRange(page) && "hidden sm:flex",
              local.getPageButtonClassName?.(local.pageCount, page === local.page)
            )}
            onClick={() => handlePageButtonClick(page)}
          >
            {page}
          </button>
        )}
      </For>
    );
  };

  return (
    <Show when={local.pageCount > 1}>
      <div {...domProps} class={joinClassName(local.class, "flex flex-row justify-center gap-2")}>
        {isPageExceedingSmScreenRange(1) && (
          <div class={joinClassName(
            "flex gap-2",
            !isPageExceedingXsScreenRange(1) && "hidden"
          )}>
            <button
              type="button"
              class={joinClassName(
                "btn min-w-8.5",
                local.getPageButtonClassName?.(1, local.page === 1))}
              onClick={() => handlePageButtonClick(1)}
            >
              {1}
            </button>
            <span>...</span>
          </div>
        )}
        {renderPageWithNumberButtons()}
        {isPageExceedingSmScreenRange(local.pageCount) && (
          <div class={joinClassName(
            "flex gap-2",
            !isPageExceedingXsScreenRange(local.pageCount) && "hidden"
          )}>
            <span>...</span>
            <button
              type="button"
              class={joinClassName(
                "btn min-w-8.5",
                local.getPageButtonClassName?.(local.pageCount, local.page === local.pageCount))}
              onClick={() => handlePageButtonClick(local.pageCount)}
            >
              {local.pageCount}
            </button>
          </div>
        )}
      </div>
    </Show>
  );
}
