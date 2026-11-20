import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { paginationButton } from "@seed-design/css/recipes/pagination-button";
import { paginationPageItem } from "@seed-design/css/recipes/pagination-page-item";
import { Primitive } from "@seed-design/react-primitive";
import { useScaleFeedback } from "@seed-design/react-scale-feedback";
import clsx from "clsx";
import * as React from "react";
import { Icon } from "../Icon/Icon";

export interface PaginationButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {}

/**
 * Icon-only button for moving to the previous or next page.
 * Pass the icon `svg` as `children`.
 */
export const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ children, className, ...otherProps }, ref) => {
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    return (
      <Primitive.button
        ref={useComposedRefs(scaleFeedbackRef, ref)}
        type="button"
        {...otherProps}
        className={clsx(paginationButton(), scaleFeedbackClassName, className)}
      >
        <Icon svg={children} />
      </Primitive.button>
    );
  },
);
PaginationButton.displayName = "PaginationButton";

export interface PaginationPageItemProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  /**
   * Whether the item represents the current page.
   */
  selected?: boolean;
}

/**
 * Button for moving to a specific page.
 */
export const PaginationPageItem = React.forwardRef<HTMLButtonElement, PaginationPageItemProps>(
  ({ children, className, selected, ...otherProps }, ref) => {
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    return (
      <Primitive.button
        ref={useComposedRefs(scaleFeedbackRef, ref)}
        type="button"
        {...otherProps}
        className={clsx(paginationPageItem(), scaleFeedbackClassName, className)}
        data-selected={selected ? "" : undefined}
      >
        <span data-pagination-page-item-label="">{children}</span>
      </Primitive.button>
    );
  },
);
PaginationPageItem.displayName = "PaginationPageItem";
