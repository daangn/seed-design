import { IconChevronLeftLine, IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, type HStackProps, Text } from "@seed-design/react";
import { useTablePagination, type UseTablePaginationProps } from "@seed-design/react-pagination";
import * as React from "react";
import { PaginationButton } from "../lib/pagination-button";
import { SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger } from "./select";

const defaultPageSizeOptions = [10, 25, 50] as const;

// 앱의 언어에 맞게 locale과 기본 접근성 문구를 수정하세요.
const numberFormatter = new Intl.NumberFormat("ko-KR");
const tablePaginationText = {
  rootAriaLabel: "표 페이지 탐색",
  pageRangeAriaLabel: "표시 범위",
  pageSizeAriaLabel: "페이지당 표시 개수",
  previousPageAriaLabel: "이전 페이지",
  nextPageAriaLabel: "다음 페이지",
  range: (start: number, end: number) =>
    `${numberFormatter.format(start)}-${numberFormatter.format(end)}`,
  total: (totalItems: number) => `/ 총 ${numberFormatter.format(totalItems)}개`,
  pageSize: (size: number) => `${numberFormatter.format(size)}개`,
  pageSizeSuffix: "씩 보기",
} as const;

export type {
  TablePaginationChangeDetails,
  TablePaginationChangeReason,
  TablePaginationValue,
  UseTablePaginationProps,
} from "@seed-design/react-pagination";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type TablePaginationProps = UseTablePaginationProps &
  DistributiveOmit<HStackProps, keyof UseTablePaginationProps | "children" | "as" | "role">;

/**
 * @see https://seed-design.io/react/components/table-pagination
 */
export const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  (props, ref) => {
    const tablePaginationProps: UseTablePaginationProps =
      props.totalItems === undefined
        ? {
            value: props.value,
            defaultValue: props.defaultValue,
            onValueChange: props.onValueChange,
            pageSizeOptions: props.pageSizeOptions ?? defaultPageSizeOptions,
            disabled: props.disabled,
            totalItems: undefined,
            hasPreviousPage: props.hasPreviousPage,
            hasNextPage: props.hasNextPage,
            currentPageItemCount: props.currentPageItemCount,
          }
        : {
            value: props.value,
            defaultValue: props.defaultValue,
            onValueChange: props.onValueChange,
            pageSizeOptions: props.pageSizeOptions ?? defaultPageSizeOptions,
            disabled: props.disabled,
            totalItems: props.totalItems,
            pageOptions: props.pageOptions,
          };
    const pagination = useTablePagination(tablePaginationProps);

    const {
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      pageSizeOptions: _pageSizeOptions,
      disabled: _disabled,
      totalItems: _totalItems,
      pageOptions: _pageOptions,
      hasPreviousPage: _hasPreviousPage,
      hasNextPage: _hasNextPage,
      currentPageItemCount: _currentPageItemCount,
      ...rootProps
    } = props;

    const handlePageRangeChange = (values: string[]) => {
      const nextPage = Number(values[0]);

      if (Number.isSafeInteger(nextPage)) pagination.goToPage(nextPage);
    };

    const handlePageSizeChange = (values: string[]) => {
      const nextPageSize = Number(values[0]);

      if (Number.isSafeInteger(nextPageSize)) pagination.setPageSize(nextPageSize);
    };

    return (
      <HStack
        ref={ref}
        height="40px"
        width="full"
        minWidth="max-content"
        wrap="nowrap"
        align="center"
        justify="space-between"
        gap="x4"
        aria-label={tablePaginationText.rootAriaLabel}
        {...pagination.rootProps}
        {...rootProps}
        role="group"
      >
        <HStack minWidth="max-content" shrink={0} align="center" gap="x2">
          <HStack minWidth="96px" width="max-content" shrink={0}>
            <SelectRoot
              size="medium"
              value={[String(pagination.pageSize)]}
              onValueChange={handlePageSizeChange}
              disabled={pagination.disabled}
            >
              <SelectTrigger
                aria-label={tablePaginationText.pageSizeAriaLabel}
                style={{ minWidth: 96 }}
              />
              <SelectContent>
                <SelectGroup>
                  {pagination.pageSizeOptions.map((pageSize) => (
                    <SelectItem
                      key={pageSize}
                      value={String(pageSize)}
                      label={tablePaginationText.pageSize(pageSize)}
                    />
                  ))}
                </SelectGroup>
              </SelectContent>
            </SelectRoot>
          </HStack>
          <Text textStyle="t4Regular" whiteSpace="nowrap">
            {tablePaginationText.pageSizeSuffix}
          </Text>
        </HStack>

        <HStack minWidth="max-content" shrink={0} align="center" gap="x4">
          {pagination.isTotalKnown && pagination.totalItems !== undefined ? (
            <HStack minWidth="max-content" shrink={0} align="center" gap="x2">
              <HStack minWidth="96px" width="max-content" shrink={0}>
                <SelectRoot
                  size="medium"
                  value={[String(pagination.page)]}
                  onValueChange={handlePageRangeChange}
                  disabled={pagination.disabled || pagination.pageRangeSelectDisabled}
                >
                  <SelectTrigger
                    aria-label={tablePaginationText.pageRangeAriaLabel}
                    style={{ minWidth: 96 }}
                  />
                  <SelectContent
                    style={{ "--seed-select-max-height": "240px" } as React.CSSProperties}
                  >
                    <SelectGroup>
                      {pagination.pageRangeOptions.map((option) => (
                        <SelectItem
                          key={option.page}
                          value={String(option.page)}
                          label={tablePaginationText.range(option.start, option.end)}
                        />
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </HStack>
              <Text textStyle="t4Regular" whiteSpace="nowrap">
                {tablePaginationText.total(pagination.totalItems)}
              </Text>
            </HStack>
          ) : (
            <Text textStyle="t4Regular" whiteSpace="nowrap">
              {tablePaginationText.range(pagination.range.start, pagination.range.end)}
            </Text>
          )}
          <HStack align="center">
            <PaginationButton
              {...pagination.previousButtonProps}
              aria-label={tablePaginationText.previousPageAriaLabel}
            >
              <IconChevronLeftLine />
            </PaginationButton>
            <PaginationButton
              {...pagination.nextButtonProps}
              aria-label={tablePaginationText.nextPageAriaLabel}
            >
              <IconChevronRightLine />
            </PaginationButton>
          </HStack>
        </HStack>
      </HStack>
    );
  },
);
TablePagination.displayName = "TablePagination";
