import { Slot } from "@radix-ui/react-slot";
import { actionChip, type ActionChipVariantProps } from "@seed-design/recipe/actionChip";
import clsx from "clsx";
import * as React from "react";

import "@seed-design/stylesheet/actionChip.css";

export interface ActionChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ActionChipVariantProps {
  prefixIcon?: React.ReactNode;

  suffixIcon?: React.ReactNode;
}

export const ActionChip = React.forwardRef<HTMLButtonElement, ActionChipProps>(
  (
    {
      className,
      size = "medium",
      layout = "text",
      children,
      prefixIcon,
      suffixIcon,
      ...otherProps
    },
    ref,
  ) => {
    const classNames = actionChip({ size, layout });
    return (
      <button ref={ref} className={clsx(classNames.root, className)} {...otherProps}>
        {prefixIcon && <Slot className={classNames.prefix}>{prefixIcon}</Slot>}
        {layout === "text" ? (
          <span className={classNames.label}>{children}</span>
        ) : (
          <Slot className={classNames.icon}>{children}</Slot>
        )}
        {suffixIcon && <Slot className={classNames.suffix}>{suffixIcon}</Slot>}
      </button>
    );
  },
);
ActionChip.displayName = "ActionChip";