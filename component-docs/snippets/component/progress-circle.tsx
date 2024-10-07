"use client";

import "@seed-design/stylesheet/progressCircle.css";

import * as React from "react";
import { progressCircle, type ProgressCircleVariant } from "@seed-design/recipe/progressCircle";
import clsx from "clsx";

export interface ProgressCircleProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    ProgressCircleVariant {
  /**
   * The current value (controlled).
   * @default 0
   */
  value?: number;

  /**
   * The smallest value allowed for the input.
   * @default 0
   */
  minValue?: number;

  /**
   * The largest value allowed for the input.
   * @default 100
   */
  maxValue?: number;
}

/**
 * @see https://component.seed-design.io/components/progress-circle
 */
export const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
  (
    { className, children, size, value = 0, maxValue = 100, minValue = 0, variant, ...otherProps },
    ref,
  ) => {
    const classNames = progressCircle({ size, variant });

    // 110 is max value of strokeDasharray
    const percent = ((value - minValue) / (maxValue - minValue)) * 110;

    const indicatorPathStyle: React.CSSProperties = {
      strokeDasharray: variant === "determinate" ? `${percent}, 200` : undefined,
    };

    return (
      <div ref={ref} data-size={size} className={clsx(classNames.root, className)} {...otherProps}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classNames.track}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20 5.12821C11.7865 5.12821 5.12821 11.7865 5.12821 20C5.12821 28.2135 11.7865 34.8718 20 34.8718C28.2135 34.8718 34.8718 28.2135 34.8718 20C34.8718 11.7865 28.2135 5.12821 20 5.12821ZM0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
          />
        </svg>

        <svg
          viewBox="20 20 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classNames.indicator}
          aria-hidden="true"
        >
          <circle
            cx="40"
            cy="40"
            r="17.5"
            fill="none"
            className={classNames["indicator-path"]}
            style={indicatorPathStyle}
          />
        </svg>
      </div>
    );
  },
);
