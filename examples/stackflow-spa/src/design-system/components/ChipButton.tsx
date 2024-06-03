import { Slot } from "@radix-ui/react-slot";
import { chip, ChipVariantProps } from "@seed-design/recipe/chip";
import clsx from "clsx";
import * as React from "react";

import "@seed-design/stylesheet/chip.css";

export interface ChipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ChipVariantProps {
  prefixIcon?: React.ReactNode;

  suffixIcon?: React.ReactNode;

  count?: React.ReactNode;
}

export const ChipButton = React.forwardRef<HTMLButtonElement, ChipButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "medium",
      children,
      prefixIcon,
      suffixIcon,
      count,
      ...otherProps
    },
    ref,
  ) => {
    const classNames = chip({ variant, size });
    return (
      <button
        ref={ref}
        className={clsx(classNames.root, className)}
        {...otherProps}
      >
        {prefixIcon && <Slot className={classNames.prefix}>{prefixIcon}</Slot>}
        <span className={classNames.label}>{children}</span>
        {count == null ? undefined : (
          <span className={classNames.count}>{count}</span>
        )}
        {suffixIcon && <Slot className={classNames.suffix}>{suffixIcon}</Slot>}
      </button>
    );
  },
);
ChipButton.displayName = "ChipButton";
