import {
  IconChevronLeftLine,
  IconChevronRightLine,
  IconDot3HorizontalLine,
} from "@karrotmarket/react-monochrome-icon";
import { HStack, type HStackProps, Icon, useBreakpointValue } from "@seed-design/react";
import {
  usePagination,
  type PaginationVisibleItemCount,
  type UsePaginationProps,
} from "@seed-design/react-pagination";
import * as React from "react";
import { PaginationButton } from "../lib/pagination-button";
import { PaginationPageItem } from "../lib/pagination-page-item";

// 앱의 언어에 맞게 locale과 기본 접근성 문구를 수정하세요.
const numberFormatter = new Intl.NumberFormat("ko-KR");
const paginationText = {
  rootAriaLabel: "페이지 탐색",
  previousPageAriaLabel: "이전 페이지",
  nextPageAriaLabel: "다음 페이지",
  pageAriaLabel: (page: number) => `${numberFormatter.format(page)}페이지`,
} as const;

export type {
  PaginationChangeDetails,
  PaginationChangeReason,
  UsePaginationProps,
} from "@seed-design/react-pagination";

type PaginationBehaviorProps = Omit<UsePaginationProps, "visibleItemCount">;
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type PaginationProps = PaginationBehaviorProps &
  DistributiveOmit<HStackProps, keyof UsePaginationProps | "children" | "as" | "role">;

function PaginationNavigationPlaceholder() {
  return <HStack width="40px" height="40px" aria-hidden="true" />;
}

/**
 * @see https://seed-design.io/react/components/pagination
 */
export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>((props, ref) => {
  const { page, defaultPage, onPageChange, totalPages, disabled, ...rootProps } = props;
  const visibleItemCount = useBreakpointValue<PaginationVisibleItemCount>({ base: 7, sm: 9 }) ?? 7;
  const pagination = usePagination({
    page,
    defaultPage,
    onPageChange,
    totalPages,
    visibleItemCount,
    disabled,
  });

  if (pagination.totalPages <= 1) return null;

  return (
    <HStack
      ref={ref}
      align="center"
      aria-label={paginationText.rootAriaLabel}
      {...pagination.rootProps}
      {...rootProps}
      as="nav"
      role="navigation"
    >
      {pagination.hasPreviousPage ? (
        <PaginationButton
          {...pagination.previousButtonProps}
          aria-label={paginationText.previousPageAriaLabel}
        >
          <IconChevronLeftLine />
        </PaginationButton>
      ) : (
        <PaginationNavigationPlaceholder />
      )}

      {pagination.items.map((item) => {
        if (item.type === "ellipsis") {
          return (
            <HStack
              key={`ellipsis-${item.side}`}
              width="40px"
              height="40px"
              align="center"
              justify="center"
              aria-hidden="true"
            >
              <Icon svg={<IconDot3HorizontalLine />} size="x4" color="fg.neutral" />
            </HStack>
          );
        }

        const formattedPage = numberFormatter.format(item.page);

        return (
          <PaginationPageItem
            key={item.page}
            selected={item.page === pagination.page}
            {...pagination.getPageButtonProps(item.page)}
            aria-label={paginationText.pageAriaLabel(item.page)}
            title={formattedPage}
          >
            {formattedPage}
          </PaginationPageItem>
        );
      })}

      {pagination.hasNextPage ? (
        <PaginationButton
          {...pagination.nextButtonProps}
          aria-label={paginationText.nextPageAriaLabel}
        >
          <IconChevronRightLine />
        </PaginationButton>
      ) : (
        <PaginationNavigationPlaceholder />
      )}
    </HStack>
  );
});
Pagination.displayName = "Pagination";
