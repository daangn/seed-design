import { Slot } from "@radix-ui/react-slot";
import {
  controlChip,
  type ControlChipVariantProps,
} from "@seed-design/recipe/controlChip";
import clsx from "clsx";
import * as React from "react";

import "@seed-design/stylesheet/controlChip.css";
import {
  type UseCheckboxProps,
  useCheckbox,
} from "@seed-design/react-checkbox";
import { visuallyHidden } from "../util/visuallyHidden";

export interface ControlChipToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    UseCheckboxProps,
    ControlChipVariantProps {
  prefixIcon?: React.ReactNode;

  suffixIcon?: React.ReactNode;
}

const ControlChipToggle = React.forwardRef<
  HTMLInputElement,
  ControlChipToggleProps
>(
  (
    {
      className,
      size = "medium",
      layout = "withText",
      children,
      prefixIcon,
      suffixIcon,
      ...otherProps
    },
    ref,
  ) => {
    const classNames = controlChip({ size, layout });
    const { rootProps, hiddenInputProps, stateProps, restProps } =
      useCheckbox(otherProps);
    return (
      <label {...rootProps} className={clsx(classNames.root, className)}>
        {prefixIcon && (
          <Slot {...stateProps} className={classNames.prefixIcon}>
            {prefixIcon}
          </Slot>
        )}
        {layout === "withText" ? (
          <span {...stateProps} className={classNames.label}>
            {children}
          </span>
        ) : (
          <Slot {...stateProps} className={classNames.icon}>
            {children}
          </Slot>
        )}
        {suffixIcon && (
          <Slot {...stateProps} className={classNames.suffixIcon}>
            {suffixIcon}
          </Slot>
        )}
        <input
          ref={ref}
          {...hiddenInputProps}
          {...restProps}
          style={visuallyHidden}
        />
      </label>
    );
  },
);
ControlChipToggle.displayName = "ControlChip.Toggle";

export const ControlChip = Object.assign(
  () => {
    console.warn(
      "ControlChip is a base component and should not be rendered. Use ControlChip.Toggle or ControlChip.Radio instead.",
    );
  },
  {
    Toggle: ControlChipToggle,
  },
);
