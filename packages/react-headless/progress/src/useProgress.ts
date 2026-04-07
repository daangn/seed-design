import { elementProps } from "@ride-developer/dom-utils";

export interface UseProgressProps {
  /**
   * The current value of the progress. if undefined, it will be indeterminate.
   */
  value?: number;
  /**
   * The minimum value allowed of the progress.
   * @default 0
   */
  minValue?: number;
  /**
   * The maximum value allowed of the progress.
   * @default 100
   */
  maxValue?: number;
}

export type UseProgressReturn = ReturnType<typeof useProgress>;

export function useProgress(props: UseProgressProps) {
  const { value, minValue = 0, maxValue = 100 } = props;
  const indeterminate = typeof value !== "number";

  const stateProps = elementProps({
    "data-progress-state":
      value === maxValue ? "complete" : indeterminate ? "indeterminate" : "loading",
  });
  const percent = indeterminate ? -1 : ((value - minValue) / (maxValue - minValue)) * 100;

  return {
    value,
    indeterminate,
    percent,
    stateProps,
    progressProps: elementProps({
      role: "progressbar",
      "aria-valuenow": indeterminate ? undefined : value,
      "aria-valuemin": minValue,
      "aria-valuemax": maxValue,
      // TODO: provide translation api for aria-valuetext
      "aria-valuetext": indeterminate ? "loading..." : `${percent} percent`,
      ...stateProps,
    }),
  };
}

export type UseProgressCircleReturn = ReturnType<typeof useProgressCircle>;

// referenced from zag-js/progress
export function useProgressCircle(props: UseProgressReturn) {
  const progress = useProgress(props);

  const circleStyle = {
    "--radius": "calc(var(--size) / 2 - var(--thickness) / 2)",
    cx: "calc(var(--size) / 2)",
    cy: "calc(var(--size) / 2)",
    r: "var(--radius)",
    fill: "transparent",
    strokeWidth: "var(--thickness)",
  };

  return {
    ...progress,
    rootProps: elementProps({
      ...progress.progressProps,
      style: {
        width: "var(--size)",
        height: "var(--size)",
      },
    }),
    trackProps: elementProps({ ...progress.stateProps, style: circleStyle }),
    rangeProps: elementProps({
      ...progress.stateProps,
      style: {
        ...circleStyle,
        "--percent": progress.percent,
        "--circumference": "calc(2 * 3.14159 * var(--radius))",
        "--offset": "calc(var(--circumference) * (100 - var(--percent)) / 100)",
        strokeDashoffset: "calc(var(--circumference) * ((100 - var(--percent)) / 100))",
        strokeDasharray: progress.indeterminate ? undefined : "var(--circumference)",
        transformOrigin: "center",
        transform: "rotate(-90deg)",
        opacity: progress.value === 0 ? 0 : undefined,
      } as React.CSSProperties,
    }),
  };
}
