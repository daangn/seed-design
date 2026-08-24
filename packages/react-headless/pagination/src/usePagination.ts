"use client";

import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useControllableState } from "@seed-design/react-use-controllable-state";
import { useCallback, useEffect, useMemo, useRef } from "react";

export type PaginationVisibleItemCount = 7 | 9;

export type PaginationItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; side: "start" | "end" };

export type PaginationChangeReason = "page-item" | "previous" | "next" | "constraint";

export interface PaginationChangeDetails {
  reason: PaginationChangeReason;
  previousPage: number;
}

export interface UsePaginationProps {
  /** 제어할 현재 페이지입니다. 페이지 번호는 1부터 시작합니다. */
  page?: number;
  /** 비제어 방식으로 사용할 때의 초기 페이지입니다. */
  defaultPage?: number;
  /** 페이지가 바뀔 때 호출됩니다. */
  onPageChange?: (page: number, details: PaginationChangeDetails) => void;
  /** 전체 페이지 수입니다. */
  totalPages: number;
  /** 이전·다음 버튼, 페이지, 생략 표시를 합친 전체 슬롯 수입니다. @default 9 */
  visibleItemCount?: PaginationVisibleItemCount;
  /** 모든 페이지 이동을 비활성화합니다. @default false */
  disabled?: boolean;
}

export interface UsePaginationReturn {
  page: number;
  totalPages: number;
  items: readonly PaginationItem[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  disabled: boolean;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  rootProps: ReturnType<typeof elementProps>;
  previousButtonProps: ReturnType<typeof buttonProps>;
  nextButtonProps: ReturnType<typeof buttonProps>;
  getPageButtonProps: (page: number) => ReturnType<typeof buttonProps> & {
    "data-current"?: "";
    "data-selected"?: "";
    "data-disabled"?: "";
  };
}

function assertSafeInteger(value: number, name: string) {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`Pagination: ${name}는 안전한 정수여야 합니다.`);
  }
}

function validateProps({
  page,
  defaultPage,
  totalPages,
  visibleItemCount,
}: Pick<UsePaginationProps, "page" | "defaultPage" | "totalPages" | "visibleItemCount">) {
  assertSafeInteger(totalPages, "totalPages");
  if (totalPages < 0) {
    throw new RangeError("Pagination: totalPages는 0 이상의 정수여야 합니다.");
  }

  if (page !== undefined) assertSafeInteger(page, "page");
  if (defaultPage !== undefined) assertSafeInteger(defaultPage, "defaultPage");
  if (visibleItemCount !== 7 && visibleItemCount !== 9) {
    throw new RangeError("Pagination: visibleItemCount는 7 또는 9여야 합니다.");
  }
}

function clampPage(page: number, totalPages: number) {
  if (totalPages === 0) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

function pageItems(start: number, end: number): PaginationItem[] {
  return Array.from({ length: end - start + 1 }, (_, index) => ({
    type: "page",
    page: start + index,
  }));
}

function createItems(
  page: number,
  totalPages: number,
  visibleItemCount: PaginationVisibleItemCount,
): PaginationItem[] {
  const navigationItemCount = totalPages > 1 ? 2 : 0;
  const availableItemCount = visibleItemCount - navigationItemCount;
  if (totalPages <= availableItemCount) return pageItems(1, totalPages);

  const siblingCount = Math.floor((availableItemCount - 5) / 2);
  const edgePageCount = availableItemCount - 2;
  const edgeThreshold = edgePageCount - siblingCount;

  if (page <= edgeThreshold) {
    return [
      ...pageItems(1, edgePageCount),
      { type: "ellipsis", side: "end" },
      { type: "page", page: totalPages },
    ];
  }

  if (page >= totalPages - edgeThreshold + 1) {
    return [
      { type: "page", page: 1 },
      { type: "ellipsis", side: "start" },
      ...pageItems(totalPages - edgePageCount + 1, totalPages),
    ];
  }

  return [
    { type: "page", page: 1 },
    { type: "ellipsis", side: "start" },
    ...pageItems(page - siblingCount, page + siblingCount),
    { type: "ellipsis", side: "end" },
    { type: "page", page: totalPages },
  ];
}

export function usePagination({
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  totalPages,
  visibleItemCount = 9,
  disabled = false,
}: UsePaginationProps): UsePaginationReturn {
  validateProps({ page: pageProp, defaultPage, totalPages, visibleItemCount });

  const [rawPage, setRawPage] = useControllableState<number, PaginationChangeDetails>({
    prop: pageProp,
    defaultProp: defaultPage,
    onChange: (nextPage, details) => {
      if (details !== undefined) onPageChange?.(nextPage, details);
    },
    caller: "usePagination",
  });
  const page = clampPage(rawPage, totalPages);

  const constraintKeyRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (rawPage === page) {
      constraintKeyRef.current = undefined;
      return;
    }

    const constraintKey = `${rawPage}:${page}`;
    if (constraintKeyRef.current === constraintKey) return;
    constraintKeyRef.current = constraintKey;
    setRawPage(page, { reason: "constraint", previousPage: rawPage });
  }, [page, rawPage, setRawPage]);

  const items = useMemo(
    () => createItems(page, totalPages, visibleItemCount),
    [page, totalPages, visibleItemCount],
  );
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const changePage = useCallback(
    (nextPage: number, reason: Exclude<PaginationChangeReason, "constraint">) => {
      if (disabled) return;
      assertSafeInteger(nextPage, "goToPage의 page");
      const constrainedPage = clampPage(nextPage, totalPages);
      if (constrainedPage === page) return;
      setRawPage(constrainedPage, { reason, previousPage: page });
    },
    [disabled, page, setRawPage, totalPages],
  );

  const goToPage = useCallback(
    (nextPage: number) => changePage(nextPage, "page-item"),
    [changePage],
  );
  const goToPreviousPage = useCallback(() => {
    if (!hasPreviousPage) return;
    changePage(page - 1, "previous");
  }, [changePage, hasPreviousPage, page]);
  const goToNextPage = useCallback(() => {
    if (!hasNextPage) return;
    changePage(page + 1, "next");
  }, [changePage, hasNextPage, page]);

  const getPageButtonProps = useCallback(
    (itemPage: number) => {
      assertSafeInteger(itemPage, "getPageButtonProps의 page");
      if (itemPage < 1 || itemPage > totalPages) {
        throw new RangeError(
          "Pagination: getPageButtonProps의 page는 1 이상 totalPages 이하여야 합니다.",
        );
      }

      const current = itemPage === page;
      return buttonProps({
        type: "button",
        disabled,
        "aria-current": current ? "page" : undefined,
        "aria-disabled": ariaAttr(disabled),
        "data-current": dataAttr(current),
        "data-selected": dataAttr(current),
        "data-disabled": dataAttr(disabled),
        onClick(event) {
          if (event.defaultPrevented || current) return;
          goToPage(itemPage);
        },
      });
    },
    [disabled, goToPage, page, totalPages],
  );

  const previousDisabled = disabled || !hasPreviousPage;
  const nextDisabled = disabled || !hasNextPage;

  return {
    page,
    totalPages,
    items,
    hasPreviousPage,
    hasNextPage,
    disabled,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    rootProps: elementProps({
      role: "navigation",
      "aria-disabled": ariaAttr(disabled),
      "data-disabled": dataAttr(disabled),
    }),
    previousButtonProps: buttonProps({
      type: "button",
      disabled: previousDisabled,
      "aria-disabled": ariaAttr(previousDisabled),
      "data-disabled": dataAttr(previousDisabled),
      onClick(event) {
        if (event.defaultPrevented) return;
        goToPreviousPage();
      },
    }),
    nextButtonProps: buttonProps({
      type: "button",
      disabled: nextDisabled,
      "aria-disabled": ariaAttr(nextDisabled),
      "data-disabled": dataAttr(nextDisabled),
      onClick(event) {
        if (event.defaultPrevented) return;
        goToNextPage();
      },
    }),
    getPageButtonProps,
  };
}
