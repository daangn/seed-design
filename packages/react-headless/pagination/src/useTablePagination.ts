"use client";

import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useControllableState } from "@seed-design/react-use-controllable-state";
import { useCallback, useEffect, useMemo, useRef } from "react";

const DEFAULT_VALUE: TablePaginationValue = { page: 1, pageSize: 10 };
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
const EMPTY_PAGE_RANGE_OPTIONS: readonly [] = [];
const MAX_AUTO_PAGE_OPTIONS = 10_000;

export interface TablePaginationValue {
  /** 1부터 시작하는 현재 페이지입니다. */
  page: number;
  /** 한 페이지에 표시하는 항목 수입니다. */
  pageSize: number;
}

export type TablePaginationChangeReason =
  | "previous"
  | "next"
  | "page-range"
  | "page-size"
  | "constraint";

export interface TablePaginationChangeDetails {
  reason: TablePaginationChangeReason;
  previousValue: TablePaginationValue;
}

export interface TablePaginationPageRangeOption {
  page: number;
  start: number;
  end: number;
}

interface UseTablePaginationBaseProps {
  /** 제어할 페이지와 페이지 크기입니다. */
  value?: TablePaginationValue;
  /** 비제어 방식으로 사용할 때의 초기 값입니다. @default { page: 1, pageSize: 10 } */
  defaultValue?: TablePaginationValue;
  /** 페이지 또는 페이지 크기가 바뀔 때 호출됩니다. */
  onValueChange?: (value: TablePaginationValue, details: TablePaginationChangeDetails) => void;
  /** 사용자가 선택할 수 있는 페이지 크기입니다. @default [10, 25, 50] */
  pageSizeOptions?: readonly number[];
  /** 모든 페이지 이동과 선택을 비활성화합니다. @default false */
  disabled?: boolean;
}

export interface UseTablePaginationKnownProps extends UseTablePaginationBaseProps {
  /** 전체 항목 수입니다. */
  totalItems: number;
  /** 페이지 범위 선택기에 노출할 페이지입니다. 페이지 수가 10,000개 이하면 기본적으로 모든 페이지를 노출합니다. */
  pageOptions?: readonly number[];
  hasPreviousPage?: never;
  hasNextPage?: never;
  currentPageItemCount?: never;
}

export interface UseTablePaginationUnknownProps extends UseTablePaginationBaseProps {
  totalItems?: never;
  pageOptions?: never;
  /** 이전 페이지가 있는지 서버가 알려주는 값입니다. */
  hasPreviousPage: boolean;
  /** 다음 페이지가 있는지 서버가 알려주는 값입니다. */
  hasNextPage: boolean;
  /** 현재 페이지에 실제로 포함된 항목 수입니다. 없으면 pageSize를 사용합니다. */
  currentPageItemCount?: number;
}

export type UseTablePaginationProps = UseTablePaginationKnownProps | UseTablePaginationUnknownProps;

interface UseTablePaginationCommonReturn {
  value: TablePaginationValue;
  page: number;
  pageSize: number;
  range: { start: number; end: number };
  pageSizeOptions: readonly number[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  disabled: boolean;
  pageRangeSelectDisabled: boolean;
  goToPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  rootProps: ReturnType<typeof elementProps>;
  previousButtonProps: ReturnType<typeof buttonProps>;
  nextButtonProps: ReturnType<typeof buttonProps>;
}

export interface UseTablePaginationKnownReturn extends UseTablePaginationCommonReturn {
  isTotalKnown: true;
  totalItems: number;
  totalPages: number;
  pageRangeOptions: readonly TablePaginationPageRangeOption[];
}

export interface UseTablePaginationUnknownReturn extends UseTablePaginationCommonReturn {
  isTotalKnown: false;
  totalItems: undefined;
  totalPages: undefined;
  pageRangeOptions: readonly [];
  pageRangeSelectDisabled: true;
}

export type UseTablePaginationReturn =
  | UseTablePaginationKnownReturn
  | UseTablePaginationUnknownReturn;

function assertSafeInteger(value: number, name: string) {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`TablePagination: ${name}는 안전한 정수여야 합니다.`);
  }
}

function assertPositiveInteger(value: number, name: string) {
  assertSafeInteger(value, name);
  if (value < 1) {
    throw new RangeError(`TablePagination: ${name}는 1 이상의 정수여야 합니다.`);
  }
}

function validateValue(value: TablePaginationValue | undefined, name: "value" | "defaultValue") {
  if (value === undefined) return;
  assertSafeInteger(value.page, `${name}.page`);
  assertPositiveInteger(value.pageSize, `${name}.pageSize`);
}

function validateOptions(options: readonly number[], name: "pageOptions" | "pageSizeOptions") {
  const seen = new Set<number>();
  for (let index = 0; index < options.length; index += 1) {
    const option = options[index];
    assertPositiveInteger(option, `${name}[${index}]`);
    if (seen.has(option)) {
      throw new RangeError(`TablePagination: ${name}에는 중복 값을 전달할 수 없습니다.`);
    }
    seen.add(option);
  }
}

function getTotalPages(totalItems: number, pageSize: number) {
  return Math.ceil(totalItems / pageSize);
}

function clampPage(page: number, totalPages: number | undefined) {
  if (totalPages === 0) return 1;
  return totalPages === undefined ? Math.max(page, 1) : Math.min(Math.max(page, 1), totalPages);
}

function createRange(page: number, pageSize: number, itemCount: number) {
  if (itemCount === 0) return { start: 0, end: 0 };

  const offset = (page - 1) * pageSize;
  const start = offset + 1;
  const end = offset + itemCount;
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) {
    throw new RangeError(
      "TablePagination: page와 pageSize로 계산한 범위가 안전한 정수를 벗어납니다.",
    );
  }
  return { start, end };
}

function createKnownRange(page: number, pageSize: number, totalItems: number) {
  if (totalItems === 0) return { start: 0, end: 0 };
  const offset = (page - 1) * pageSize;
  if (!Number.isSafeInteger(offset)) {
    throw new RangeError(
      "TablePagination: page와 pageSize로 계산한 범위가 안전한 정수를 벗어납니다.",
    );
  }
  return createRange(page, pageSize, Math.min(pageSize, totalItems - offset));
}

function validateProps(props: UseTablePaginationProps) {
  validateValue(props.value, "value");
  validateValue(props.defaultValue, "defaultValue");
  validateOptions(props.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS, "pageSizeOptions");

  if (props.totalItems !== undefined) {
    assertSafeInteger(props.totalItems, "totalItems");
    if (props.totalItems < 0) {
      throw new RangeError("TablePagination: totalItems는 0 이상의 정수여야 합니다.");
    }
    if (props.pageOptions !== undefined) validateOptions(props.pageOptions, "pageOptions");
    return;
  }

  if (typeof props.hasPreviousPage !== "boolean" || typeof props.hasNextPage !== "boolean") {
    throw new TypeError(
      "TablePagination: 전체 항목 수를 모르는 경우 hasPreviousPage와 hasNextPage가 필요합니다.",
    );
  }
  if (props.currentPageItemCount !== undefined) {
    assertSafeInteger(props.currentPageItemCount, "currentPageItemCount");
    if (props.currentPageItemCount < 0) {
      throw new RangeError("TablePagination: currentPageItemCount는 0 이상의 정수여야 합니다.");
    }
  }
}

export function useTablePagination(
  props: UseTablePaginationKnownProps,
): UseTablePaginationKnownReturn;
export function useTablePagination(
  props: UseTablePaginationUnknownProps,
): UseTablePaginationUnknownReturn;
export function useTablePagination(props: UseTablePaginationProps): UseTablePaginationReturn;
export function useTablePagination(props: UseTablePaginationProps): UseTablePaginationReturn {
  validateProps(props);

  const {
    value: valueProp,
    defaultValue = DEFAULT_VALUE,
    onValueChange,
    pageSizeOptions: pageSizeOptionsProp = DEFAULT_PAGE_SIZE_OPTIONS,
    disabled = false,
  } = props;
  const isTotalKnown = props.totalItems !== undefined;

  const [rawValue, setRawValue] = useControllableState<
    TablePaginationValue,
    TablePaginationChangeDetails
  >({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: (nextValue, details) => {
      if (details !== undefined) onValueChange?.(nextValue, details);
    },
    caller: "useTablePagination",
  });

  const totalItems = isTotalKnown ? props.totalItems : undefined;
  const totalPages =
    totalItems === undefined ? undefined : getTotalPages(totalItems, rawValue.pageSize);
  const page = clampPage(rawValue.page, totalPages);
  const pageSize = rawValue.pageSize;
  const value = useMemo(
    () => (rawValue.page === page ? rawValue : { page, pageSize }),
    [page, pageSize, rawValue],
  );

  const constraintKeyRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (rawValue.page === page) {
      constraintKeyRef.current = undefined;
      return;
    }

    const constraintKey = `${rawValue.page}:${rawValue.pageSize}:${page}:${pageSize}`;
    if (constraintKeyRef.current === constraintKey) return;
    constraintKeyRef.current = constraintKey;
    setRawValue(value, { reason: "constraint", previousValue: rawValue });
  }, [page, pageSize, rawValue, setRawValue, value]);

  const resolvedPageSizeOptions = useMemo(() => {
    const options = new Set(pageSizeOptionsProp);
    options.add(pageSize);
    return [...options].sort((a, b) => a - b);
  }, [pageSize, pageSizeOptionsProp]);

  const pageRangeOptions = useMemo(() => {
    if (totalItems === undefined || totalPages === undefined) return EMPTY_PAGE_RANGE_OPTIONS;

    if (props.pageOptions === undefined && totalPages > MAX_AUTO_PAGE_OPTIONS) {
      throw new RangeError(
        `TablePagination: 페이지 수가 ${MAX_AUTO_PAGE_OPTIONS.toLocaleString("en-US")}개를 넘으면 pageOptions를 전달해야 합니다.`,
      );
    }

    const pageOptions =
      props.pageOptions ?? Array.from({ length: totalPages }, (_, index) => index + 1);
    const pages = new Set(pageOptions.filter((option) => option <= totalPages));
    pages.add(page);
    return [...pages]
      .sort((a, b) => a - b)
      .map((optionPage) => ({
        page: optionPage,
        ...createKnownRange(optionPage, pageSize, totalItems),
      }));
  }, [page, pageSize, props.pageOptions, totalItems, totalPages]);

  let range: { start: number; end: number };
  let hasPreviousPage: boolean;
  let hasNextPage: boolean;

  if (totalItems !== undefined && totalPages !== undefined) {
    range = createKnownRange(page, pageSize, totalItems);
    hasPreviousPage = totalItems > 0 && page > 1;
    hasNextPage = totalItems > 0 && page < totalPages;
  } else {
    const unknownProps = props as UseTablePaginationUnknownProps;
    const currentPageItemCount = unknownProps.currentPageItemCount ?? pageSize;
    if (currentPageItemCount > pageSize) {
      throw new RangeError(
        "TablePagination: currentPageItemCount는 현재 pageSize보다 클 수 없습니다.",
      );
    }
    range = createRange(page, pageSize, currentPageItemCount);
    hasPreviousPage = page > 1 && unknownProps.hasPreviousPage;
    hasNextPage = unknownProps.hasNextPage;
  }

  const changePage = useCallback(
    (nextPage: number, reason: "previous" | "next" | "page-range") => {
      if (disabled) return;
      assertSafeInteger(nextPage, "goToPage의 page");
      const constrainedPage = clampPage(nextPage, totalPages);
      if (constrainedPage === page) return;
      setRawValue({ page: constrainedPage, pageSize }, { reason, previousValue: value });
    },
    [disabled, page, pageSize, setRawValue, totalPages, value],
  );

  const goToPage = useCallback(
    (nextPage: number) => changePage(nextPage, "page-range"),
    [changePage],
  );
  const setPageSize = useCallback(
    (nextPageSize: number) => {
      if (disabled) return;
      assertPositiveInteger(nextPageSize, "setPageSize의 pageSize");
      if (nextPageSize === pageSize) return;
      setRawValue(
        { page: 1, pageSize: nextPageSize },
        { reason: "page-size", previousValue: value },
      );
    },
    [disabled, pageSize, setRawValue, value],
  );
  const goToPreviousPage = useCallback(() => {
    if (!hasPreviousPage) return;
    changePage(page - 1, "previous");
  }, [changePage, hasPreviousPage, page]);
  const goToNextPage = useCallback(() => {
    if (!hasNextPage) return;
    changePage(page + 1, "next");
  }, [changePage, hasNextPage, page]);

  const previousDisabled = disabled || !hasPreviousPage;
  const nextDisabled = disabled || !hasNextPage;
  const pageRangeSelectDisabled = !isTotalKnown || disabled || pageRangeOptions.length <= 1;
  const common = {
    value,
    page,
    pageSize,
    range,
    pageSizeOptions: resolvedPageSizeOptions,
    hasPreviousPage,
    hasNextPage,
    disabled,
    pageRangeSelectDisabled,
    goToPage,
    setPageSize,
    goToPreviousPage,
    goToNextPage,
    rootProps: elementProps({
      role: "group",
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
  };

  if (totalItems !== undefined && totalPages !== undefined) {
    return {
      ...common,
      isTotalKnown: true,
      totalItems,
      totalPages,
      pageRangeOptions,
    };
  }

  return {
    ...common,
    isTotalKnown: false,
    totalItems: undefined,
    totalPages: undefined,
    pageRangeOptions: EMPTY_PAGE_RANGE_OPTIONS,
    pageRangeSelectDisabled: true,
  };
}
