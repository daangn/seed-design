import { listHeader } from "@seed-design/css/recipes/list-header";
import { forwardRef } from "react";
import clsx from "clsx";

export interface ListHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const ListHeader = forwardRef<HTMLDivElement, ListHeaderProps>(
  ({ as: Comp = "div", ...props }, ref) => {
    const [variantProps, otherProps] = listHeader.splitVariantProps(props);
    const className = listHeader(variantProps);

    return <Comp ref={ref} {...otherProps} className={clsx(className, props.className)} />;
  },
);
ListHeader.displayName = "ListHeader";
