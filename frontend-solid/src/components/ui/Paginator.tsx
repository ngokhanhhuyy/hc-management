import { getPaginationRange, joinClassName, type PaginationRange } from "#/helpers";

// Types.
type PaginationRanges = {
  smScreen: PaginationRange,
  xsScreen: PaginationRange,
};

export type PaginatorProps = {
  page: number;
  pageCount: number;
  onPageChanged: (page: number) => any;
  getPageButtonClassName?: (page: number, isActive: boolean) => string | null | undefined;
} & HTMLAttributes<HTMLDivElement>;

export function Paginator(props: PaginatorProps): JSXElement {
  // Props.
  const {
    page: currentPage,
    pageCount,
    onPageChanged,
    class: className,
    getPageButtonClassName,
    ...domProps
  } = $destructure(props);

  // Computed.
  const paginationRanges: PaginationRanges = $memo(() => ({
    smScreen: getPaginationRange({
      currentPage,
      pageCount,
      visibleButtons: 5
    }),
    xsScreen: getPaginationRange({
      currentPage,
      pageCount,
      visibleButtons: 3
    }),
  }));

  const isPageExceedingXsScreenRange = (page: number) => {
    return page < paginationRanges.xsScreen.startingPage || page > paginationRanges.xsScreen.endingPage;
  };

  const isPageExceedingSmScreenRange = (page: number) => {
    return page < paginationRanges.smScreen.startingPage || page > paginationRanges.smScreen.endingPage;
  };

  // Callbacks.
  const handlePageButtonClick = (buttonPage: number): void => {
    props.onPageChanged(buttonPage);
  };

  // Template.
  if (pageCount <= 1) {
    return null;
  }

  const renderPageWithNumberButtons = (): JSXElement => {
    const startingPage = paginationRanges.smScreen.startingPage;
    const endingPage = paginationRanges.smScreen.endingPage;
    const arrayLength = endingPage - (startingPage - 1);

    return (
      <For each={Array.from({ length: arrayLength }, (_, index) => index + startingPage)}>
        {(page) => (
          <button
            type="button"
            class={joinClassName(
              "min-w-8.5",
              isPageExceedingXsScreenRange(page) && "hidden sm:flex",
              getPageButtonClassName?.(pageCount, page === currentPage)
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
    <div {...domProps} class={joinClassName(className, "flex flex-row justify-center gap-2")}>
      {isPageExceedingSmScreenRange(1) && (
        <div class={joinClassName(
          "flex gap-2",
          !isPageExceedingXsScreenRange(1) && "hidden"
        )}>
          <button
            type="button"
            class={joinClassName(
              "btn min-w-8.5",
              getPageButtonClassName?.(1, currentPage === 1))}
            onClick={() => handlePageButtonClick(1)}
          >
            {1}
          </button>
          <span>...</span>
        </div>
      )}
      {renderPageWithNumberButtons()}
      {isPageExceedingSmScreenRange(pageCount) && (
        <div class={joinClassName(
          "flex gap-2",
          !isPageExceedingXsScreenRange(pageCount) && "hidden"
        )}>
          <span>...</span>
          <button
            type="button"
            class={joinClassName(
              "btn min-w-8.5",
              getPageButtonClassName?.(pageCount, currentPage === pageCount))}
            onClick={() => handlePageButtonClick(pageCount)}
          >
            {pageCount}
          </button>
        </div>
      )}
    </div>
  );
};
