"use client";

import { type UseCheckboxProps, useCheckbox } from "@seed-design/react-checkbox";
import { type CheckboxVariantProps, checkbox } from "@seed-design/recipe/checkbox";
import clsx from "clsx";
import * as React from "react";
import type { CSSProperties } from "react";

import "@seed-design/stylesheet/checkbox.css";

type Assign<T, U> = Omit<T, keyof U> & U;

const visuallyHidden: CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
};

const Checkmark = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    aria-hidden="true"
    ref={ref}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5179 6.98877C17.9658 7.3118 18.0671 7.93681 17.7441 8.38478L11.7108 16.7515C11.5351 16.9952 11.2591 17.1469 10.9592 17.1648C10.6593 17.1827 10.3672 17.0647 10.1638 16.8436L6.33048 12.677C5.95655 12.2705 5.98291 11.6379 6.38935 11.264C6.7958 10.89 7.42841 10.9164 7.80234 11.3228L10.8056 14.5873L16.1219 7.21498C16.4449 6.76702 17.0699 6.66574 17.5179 6.98877Z"
      fill="currentColor"
    />
  </svg>
));

export interface CheckboxProps
  extends Assign<React.HTMLAttributes<HTMLInputElement>, UseCheckboxProps>,
    CheckboxVariantProps {
  label: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = "medium", label, ...otherProps }, ref) => {
    const { stateProps, restProps, controlProps, hiddenInputProps, rootProps } =
      useCheckbox(otherProps);

    const classNames = checkbox({ size });
    return (
      <label className={clsx(classNames.root, className)} {...rootProps}>
        <div {...controlProps} className={classNames.control}>
          <Checkmark {...stateProps} className={classNames.icon} />
        </div>
        <input ref={ref} {...hiddenInputProps} {...restProps} style={visuallyHidden} />
        <span {...stateProps} className={classNames.label}>
          {label}
        </span>
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
