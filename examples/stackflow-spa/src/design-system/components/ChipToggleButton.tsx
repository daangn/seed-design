import { Slot } from "@radix-ui/react-slot";
import { useCheckbox, type UseCheckboxProps } from "@seed-design/react-checkbox";
import { chip, type ChipVariantProps } from "@seed-design/recipe/chip";
import clsx from "clsx";
import * as React from "react";
import type { Assign } from "../util/types";
import { visuallyHidden } from "../util/visuallyHidden";

import "@seed-design/stylesheet/chip.css";

export interface ChipToggleButtonProps
  extends Assign<React.HTMLAttributes<HTMLInputElement>, UseCheckboxProps>,
    ChipVariantProps {
  prefixIcon?: React.ReactNode;

  suffixIcon?: React.ReactNode;

  count?: React.ReactNode;
}

export const ChipToggleButton = React.forwardRef<HTMLInputElement, ChipToggleButtonProps>(
  ({ className, size = "medium", children, prefixIcon, suffixIcon, count, ...otherProps }, ref) => {
    const { stateProps, restProps, hiddenInputProps, rootProps, isChecked } =
      useCheckbox(otherProps);
    const classNames = chip({
      variant: isChecked ? "inverted" : "default",
      size,
    });

    return (
      <label {...rootProps} className={clsx(classNames.root, className)}>
        {prefixIcon && (
          <Slot {...stateProps} className={classNames.prefix}>
            {prefixIcon}
          </Slot>
        )}
        <span {...stateProps} className={classNames.label}>
          {children}
        </span>
        {count == null ? undefined : <span className={classNames.count}>{count}</span>}
        {suffixIcon && (
          <Slot {...stateProps} className={classNames.suffix}>
            {suffixIcon}
          </Slot>
        )}
        <input ref={ref} {...hiddenInputProps} {...restProps} style={visuallyHidden} />
      </label>
    );
  },
);
ChipToggleButton.displayName = "ChipToggleButton";
