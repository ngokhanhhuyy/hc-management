import React, { useMemo } from "react";
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
} & React.ComponentPropsWithoutRef<"div">;

export function Paginator(props: PaginatorProps): React.ReactNode {
  // Props.
  const {
    page: currentPage,
    pageCount,
    onPageChanged,
    className,
    getPageButtonClassName,
    ...domProps
  } = props;

  // Computed.
  const paginationRanges: PaginationRanges = useMemo(() => ({
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
  }), [currentPage, pageCount]);

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

  const renderPageWithNumberButtons = (): React.ReactNode[] => {
    const startingPage = paginationRanges.smScreen.startingPage;
    const endingPage = paginationRanges.smScreen.endingPage;
    const arrayLength = endingPage - (startingPage - 1);

    return Array.from({ length: arrayLength }, (_, index) => index + startingPage).map(page => (
      <button
        type="button"
        className={joinClassName(
          "min-w-8.5",
          isPageExceedingXsScreenRange(page) && "hidden sm:flex",
          getPageButtonClassName?.(pageCount, page === currentPage)
        )}
        onClick={() => handlePageButtonClick(page)}
        key={page}
      >
        {page}
      </button>
    ));
  };

  return (
    <div {...domProps} className={joinClassName(className, "flex flex-row justify-center gap-2")}>
      {isPageExceedingSmScreenRange(1) && (
        <div className={joinClassName(
          "flex gap-2",
          !isPageExceedingXsScreenRange(1) && "hidden"
        )}>
          <button
            type="button"
            className={joinClassName(
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
        <div className={joinClassName(
          "flex gap-2",
          !isPageExceedingXsScreenRange(pageCount) && "hidden"
        )}>
          <span>...</span>
          <button
            type="button"
            className={joinClassName(
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
