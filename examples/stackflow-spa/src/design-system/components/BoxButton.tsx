import { Slot } from "@radix-ui/react-slot";
import {
  boxButton,
  BoxButtonVariantProps,
} from "@seed-design/recipe/boxButton";
import clsx from "clsx";
import * as React from "react";

import "@seed-design/stylesheet/boxButton.css";

export interface BoxButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BoxButtonVariantProps {
  prefixIcon?: React.ReactNode;
}

export const BoxButton = React.forwardRef<HTMLButtonElement, BoxButtonProps>(
  (
    {
      className,
      variant = "brand",
      size = "medium",
      children,
      prefixIcon,
      ...otherProps
    },
    ref,
  ) => {
    const classNames = boxButton({ variant, size });
    return (
      <button
        ref={ref}
        className={clsx(classNames.root, className)}
        {...otherProps}
      >
        {prefixIcon && <Slot className={classNames.prefix}>{prefixIcon}</Slot>}
        <span className={classNames.label}>{children}</span>
      </button>
    );
  },
);
BoxButton.displayName = "BoxButton";