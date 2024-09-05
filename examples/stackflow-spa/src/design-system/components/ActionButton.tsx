import { Slot } from "@radix-ui/react-slot";
import { actionButton, type ActionButtonVariantProps } from "@seed-design/recipe/actionButton";
import clsx from "clsx";
import * as React from "react";

import "@seed-design/stylesheet/actionButton.css";

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ActionButtonVariantProps {
  prefixIcon?: React.ReactNode;
}

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant = "brand", size = "medium", children, prefixIcon, ...otherProps }, ref) => {
    const classNames = actionButton({ variant, size });
    return (
      <button ref={ref} className={clsx(classNames.root, className)} {...otherProps}>
        {prefixIcon && <Slot className={classNames.prefix}>{prefixIcon}</Slot>}
        <span className={classNames.label}>{children}</span>
      </button>
    );
  },
);
ActionButton.displayName = "ActionButton";
