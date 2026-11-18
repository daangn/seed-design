import * as React from "@lynx-js/react";
import {
  TimePicker as SeedTimePicker,
  type TimePickerColumnType,
  type UseTimePickerProps,
  useTimePicker,
} from "@seed-design/lynx-react";
import {
  WheelPicker,
  type WheelPickerColumn,
  type WheelPickerOption,
  type WheelPickerProps,
} from "./wheel-picker";

const DEFAULT_ACCESSIBILITY_LABELS = {
  ko: { period: "오전/오후", hour: "시", minute: "분" },
  en: { period: "AM/PM", hour: "Hour", minute: "Minute" },
  ja: { period: "午前/午後", hour: "時", minute: "分" },
} as const;

// Lynx에는 `Intl`이 없어 locale의 언어 하위 태그만 비교합니다.
function getDefaultAccessibilityLabels(locale: string | string[] = "ko-KR") {
  for (const tag of Array.isArray(locale) ? locale : [locale]) {
    const language = tag.split(/[-_]/)[0]?.toLowerCase();
    if (language === "ko" || language === "ja" || language === "en") {
      return DEFAULT_ACCESSIBILITY_LABELS[language];
    }
  }
  return DEFAULT_ACCESSIBILITY_LABELS.en;
}

// renderLabel이 매 렌더 바뀌면 WheelPicker 컬럼의 memo가 무효화되므로 모듈에서 한 번 만듭니다.
const renderLabels: Record<TimePickerColumnType, (option: WheelPickerOption) => React.ReactNode> = {
  period: (option) => (
    <SeedTimePicker.ItemLabel columnType="period">{option.label}</SeedTimePicker.ItemLabel>
  ),
  hour: (option) => (
    <SeedTimePicker.ItemLabel columnType="hour">{option.label}</SeedTimePicker.ItemLabel>
  ),
  minute: (option) => (
    <SeedTimePicker.ItemLabel columnType="minute">{option.label}</SeedTimePicker.ItemLabel>
  ),
};

export interface TimePickerProps
  extends UseTimePickerProps,
    Omit<
      WheelPickerProps,
      | keyof UseTimePickerProps
      | "columns"
      | "itemSize"
      | "readOnly"
      | "scrollFogSize"
      | "size"
      | "visibleItemCount"
    > {
  /**
   * 오전·오후 컬럼의 접근성 이름입니다.
   * 지정하지 않으면 `locale`에 맞는 기본값을 사용합니다.
   */
  periodAccessibilityLabel?: string;

  /**
   * 시 컬럼의 접근성 이름입니다.
   * 지정하지 않으면 `locale`에 맞는 기본값을 사용합니다.
   */
  hourAccessibilityLabel?: string;

  /**
   * 분 컬럼의 접근성 이름입니다.
   * 지정하지 않으면 `locale`에 맞는 기본값을 사용합니다.
   */
  minuteAccessibilityLabel?: string;
}

/**
 * 휠을 스크롤하여 오전·오후, 시, 분을 선택하는 12시간제 시간 선택 컴포넌트입니다.
 *
 * 값은 오전·오후를 별도 필드로 나누지 않고 24시간 형식의 `TimePickerValue`로 주고받습니다.
 *
 * @see https://seed-design.io/lynx/components/time-picker
 */
export const TimePicker = React.forwardRef<React.ComponentRef<typeof WheelPicker>, TimePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      minuteStep,
      locale,
      disabled,
      periodAccessibilityLabel,
      hourAccessibilityLabel,
      minuteAccessibilityLabel,
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
    const defaultLabels = getDefaultAccessibilityLabels(locale);
    const accessibilityLabels = {
      period: periodAccessibilityLabel ?? defaultLabels.period,
      hour: hourAccessibilityLabel ?? defaultLabels.hour,
      minute: minuteAccessibilityLabel ?? defaultLabels.minute,
    };

    const columns: readonly WheelPickerColumn[] = api.columnOrder.map((type) => {
      const column = api.columns[type];

      return {
        id: type,
        "accessibility-label": accessibilityLabels[type],
        options: column.options,
        value: column.value,
        onValueChange: column.onValueChange,
        loop: column.loop,
        valueChangeBehavior: type === "period" ? "smooth" : "auto",
        renderLabel: renderLabels[type],
      };
    });

    return (
      <WheelPicker {...(ref ? { ref } : {})} columns={columns} disabled={disabled} {...props} />
    );
  },
);
TimePicker.displayName = "TimePicker";
