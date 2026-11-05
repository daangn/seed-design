import { paginationPageItem } from "@seed-design/css/recipes/pagination-page-item";
import clsx from "clsx";
import * as React from "react";

export interface PaginationPageItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  selected?: boolean;
}

export const PaginationPageItem = React.forwardRef<HTMLButtonElement, PaginationPageItemProps>(
  ({ children, className, selected, ...buttonProps }, ref) => (
    <button
      ref={ref}
      type="button"
      {...buttonProps}
      className={clsx(paginationPageItem(), className)}
      data-selected={selected ? "" : undefined}
    >
      <span data-pagination-page-item-label="">{children}</span>
    </button>
  ),
);
PaginationPageItem.displayName = "PaginationPageItem";
