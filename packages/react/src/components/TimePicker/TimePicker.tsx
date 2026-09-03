"use client";

import { timePicker } from "@seed-design/css/recipes/time-picker";
import { useTimePicker, type UseTimePickerProps } from "@seed-design/react-time-picker";
import { clsx } from "cn";
import * as React from "react";
import {
  InternalWheelPickerColumn,
  InternalWheelPickerRoot,
  type InternalWheelPickerRootProps,
} from "../private/WheelPicker";

const ITEM_SIZE = 44;
const VISIBLE_ITEM_COUNT = 5;
const DEFAULT_ARIA_LABELS = {
  ko: {
    root: "시간 선택",
    period: "오전/오후",
    hour: "시",
    minute: "분",
  },
  en: {
    root: "Select time",
    period: "AM/PM",
    hour: "Hour",
    minute: "Minute",
  },
  ja: {
    root: "時刻を選択",
    period: "午前/午後",
    hour: "時",
    minute: "分",
  },
} as const;

function getDefaultAriaLabels(locale: string | string[] | undefined) {
  const [canonicalLocale = "ko-KR"] = Intl.getCanonicalLocales(locale ?? "ko-KR");
  const language = new Intl.Locale(canonicalLocale).language;

  if (language === "ko") return DEFAULT_ARIA_LABELS.ko;
  if (language === "ja") return DEFAULT_ARIA_LABELS.ja;
  return DEFAULT_ARIA_LABELS.en;
}

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
      | "asChild"
      | "children"
      | "columnsClassName"
      | "fogSize"
      | "itemSize"
      | "readOnly"
      | "scrollFogClassName"
      | "selectionIndicatorClassName"
      | "visibleItemCount"
    > {
  /**
   * 오전·오후 컬럼의 접근성 이름입니다.
   * 지정하지 않으면 `locale`에 맞는 기본값을 사용합니다.
   */
  periodAriaLabel?: string;

  /**
   * 시 컬럼의 접근성 이름입니다.
   * 지정하지 않으면 `locale`에 맞는 기본값을 사용합니다.
   */
  hourAriaLabel?: string;

  /**
   * 분 컬럼의 접근성 이름입니다.
   * 지정하지 않으면 `locale`에 맞는 기본값을 사용합니다.
   */
  minuteAriaLabel?: string;
}

/**
 * 휠을 스크롤하여 오전·오후, 시, 분을 선택하는 12시간제 시간 선택 컴포넌트입니다.
 *
 * 값은 오전·오후를 별도 필드로 나누지 않고 24시간 형식의 `TimePickerValue`로 주고받습니다.
 */
export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      minuteStep,
      locale,
      disabled,
      periodAriaLabel,
      hourAriaLabel,
      minuteAriaLabel,
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
    const defaultAriaLabels = getDefaultAriaLabels(locale);
    const ariaLabels = {
      period: periodAriaLabel ?? defaultAriaLabels.period,
      hour: hourAriaLabel ?? defaultAriaLabels.hour,
      minute: minuteAriaLabel ?? defaultAriaLabels.minute,
    };

    return (
      <InternalWheelPickerRoot
        ref={ref}
        itemSize={ITEM_SIZE}
        visibleItemCount={VISIBLE_ITEM_COUNT}
        disabled={disabled}
        aria-label={ariaLabelledby ? ariaLabel : (ariaLabel ?? defaultAriaLabels.root)}
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
              valueChangeBehavior={type === "period" ? "smooth" : "auto"}
            />
          );
        })}
      </InternalWheelPickerRoot>
    );
  },
);
TimePicker.displayName = "TimePicker";

export type { MinuteStep, TimePickerValue } from "@seed-design/react-time-picker";
