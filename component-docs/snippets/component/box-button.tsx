"use client";

import "@seed-design/stylesheet/boxButton.css";

import * as React from "react";
import clsx from "clsx";
import { Slot } from "@radix-ui/react-slot";
import { boxButton, type BoxButtonVariantProps } from "@seed-design/recipe/boxButton";

export interface BoxButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BoxButtonVariantProps {
  prefixIcon?: React.ReactNode;
}

/**
 * @see https://component.seed-design.io/components/box-button
 */
export const BoxButton = React.forwardRef<HTMLButtonElement, BoxButtonProps>(
  ({ className, variant = "brand", size = "medium", children, prefixIcon, ...otherProps }, ref) => {
    const classNames = boxButton({ variant, size });
    return (
      <button ref={ref} className={clsx(classNames.root, className)} {...otherProps}>
        {prefixIcon && <Slot className={classNames.prefix}>{prefixIcon}</Slot>}
        <span className={classNames.label}>{children}</span>
      </button>
    );
  },
);
BoxButton.displayName = "BoxButton";
