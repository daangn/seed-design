"use client";

import { timePicker } from "@seed-design/css/recipes/time-picker";
import { useTimePicker, type UseTimePickerProps } from "@seed-design/react-time-picker";
import clsx from "clsx";
import * as React from "react";
import {
  InternalWheelPickerColumn,
  InternalWheelPickerRoot,
  type InternalWheelPickerRootProps,
} from "../private/WheelPicker";

const ITEM_SIZE = 44;
const VISIBLE_ITEM_COUNT = 5;
const DEFAULT_ARIA_LABEL = "시간 선택";
const DEFAULT_PERIOD_ARIA_LABEL = "오전/오후";
const DEFAULT_HOUR_ARIA_LABEL = "시";
const DEFAULT_MINUTE_ARIA_LABEL = "분";

const classNames = timePicker();

const columnClassNames = {
  period: classNames.periodColumn,
  hour: classNames.hourColumn,
  minute: classNames.minuteColumn,
};

export interface TimePickerProps
  extends UseTimePickerProps,
    Omit<
      InternalWheelPickerRootProps,
      | keyof UseTimePickerProps
      | "children"
      | "columnsClassName"
      | "fogSize"
      | "itemSize"
      | "readOnly"
      | "scrollFogClassName"
      | "selectionIndicatorClassName"
      | "visibleItemCount"
    > {
  periodAriaLabel?: string;
  hourAriaLabel?: string;
  minuteAriaLabel?: string;
}

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      minuteStep,
      locale,
      disabled,
      periodAriaLabel = DEFAULT_PERIOD_ARIA_LABEL,
      hourAriaLabel = DEFAULT_HOUR_ARIA_LABEL,
      minuteAriaLabel = DEFAULT_MINUTE_ARIA_LABEL,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const api = useTimePicker({
      value,
      defaultValue,
      onValueChange,
      minuteStep,
      locale,
      disabled,
    });
    const ariaLabels = {
      period: periodAriaLabel,
      hour: hourAriaLabel,
      minute: minuteAriaLabel,
    };

    return (
      <InternalWheelPickerRoot
        ref={ref}
        itemSize={ITEM_SIZE}
        visibleItemCount={VISIBLE_ITEM_COUNT}
        disabled={disabled}
        aria-label={ariaLabelledby ? ariaLabel : (ariaLabel ?? DEFAULT_ARIA_LABEL)}
        aria-labelledby={ariaLabelledby}
        className={clsx(classNames.root, className)}
        columnsClassName={classNames.columns}
        scrollFogClassName={classNames.scrollFog}
        selectionIndicatorClassName={classNames.selectionIndicator}
        {...props}
      >
        {api.columnOrder.map((type) => {
          const column = api.columns[type];

          return (
            <InternalWheelPickerColumn
              key={type}
              aria-label={ariaLabels[type]}
              className={columnClassNames[type]}
              itemClassName={classNames.item}
              options={column.options}
              value={column.value}
              onValueChange={column.onValueChange}
              loop={column.loop}
            />
          );
        })}
      </InternalWheelPickerRoot>
    );
  },
);
TimePicker.displayName = "TimePicker";

export type { MinuteStep, TimePickerValue } from "@seed-design/react-time-picker";
