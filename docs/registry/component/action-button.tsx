"use client";

import "@seed-design/stylesheet/actionButton.css";

import * as React from "react";
import clsx from "clsx";
import { Slot } from "@radix-ui/react-slot";
import {
  actionButton,
  type ActionButtonVariantProps,
} from "@seed-design/recipe/actionButton";

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ActionButtonVariantProps {
  prefixIcon?: React.ReactNode;

  suffixIcon?: React.ReactNode;

  asChild?: boolean;
}

/**
 * @see https://v3.seed-design.io/docs/react/components/action-button
 */
export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(
  (
    {
      className,
      variant = "brandSolid",
      size = "medium",
      children,
      prefixIcon,
      suffixIcon,
      layout = "withText",
      asChild = false,
      ...otherProps
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const classNames = actionButton({ variant, layout, size });
    return (
      <Comp
        ref={ref}
        className={clsx(classNames.root, className)}
        {...otherProps}
      >
        {prefixIcon && (
          <Slot className={classNames.prefixIcon}>{prefixIcon}</Slot>
        )}
        {layout === "withText" ? (
          <span className={classNames.label}>{children}</span>
        ) : (
          <Slot className={classNames.icon}>{children}</Slot>
        )}
        {suffixIcon && (
          <Slot className={classNames.suffixIcon}>{suffixIcon}</Slot>
        )}
      </Comp>
    );
  },
);
ActionButton.displayName = "ActionButton";
