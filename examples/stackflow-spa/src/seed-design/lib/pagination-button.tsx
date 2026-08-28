import { paginationButton } from "@seed-design/css/recipes/pagination-button";
import { Icon } from "@seed-design/react";
import clsx from "clsx";
import * as React from "react";

export interface PaginationButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {}

export const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  (props, ref) => {
    const { children, className, ...buttonProps } = props;

    return (
      <button
        ref={ref}
        type="button"
        {...buttonProps}
        className={clsx(paginationButton(), className)}
      >
        <Icon svg={children} />
      </button>
    );
  },
);
PaginationButton.displayName = "PaginationButton";
