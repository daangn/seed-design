import { listHeader, type ListHeaderVariantProps } from "@seed-design/css/recipes/list-header";
import { forwardRef } from "react";
import clsx from "clsx";
import type { PrimitiveProps } from "@seed-design/react-primitive";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListHeaderProps` instead.
 */
export interface ListHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement>,
    ListHeaderVariantProps {
  /**
   * @default "div"
   */
  as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListHeader` instead.
 */
export const ListHeader = forwardRef<HTMLDivElement, ListHeaderProps>(
  ({ as: Comp = "div", ...props }, ref) => {
    const [variantProps, otherProps] = listHeader.splitVariantProps(props);
    const className = listHeader(variantProps);

    return <Comp ref={ref} {...otherProps} className={clsx(className, props.className)} />;
  },
);
ListHeader.displayName = "ListHeader";
