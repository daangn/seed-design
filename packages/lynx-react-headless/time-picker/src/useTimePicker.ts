import { useMemo } from "@lynx-js/react";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

const DEFAULT_VALUE: TimePickerValue = { hour: 0, minute: 0 };
const DEFAULT_LOCALE = "ko-KR";
const DEFAULT_MINUTE_STEP = 5;

export interface TimePickerValue {
  /**
   * 24시간 형식의 시입니다.
   *
   * @minimum 0
   * @maximum 23
   */
  hour: number;

  /**
   * 분입니다.
   *
   * @minimum 0
   * @maximum 59
   */
  minute: number;
}

/**
 * 분 컬럼에서 선택할 수 있는 값의 간격입니다.
 */
export type MinuteStep = 1 | 5 | 10 | 15 | 30;

export type TimePickerColumnType = "period" | "hour" | "minute";

export interface TimePickerOption {
  value: string;
  label: string;
}

export interface TimePickerColumn {
  type: TimePickerColumnType;
  options: readonly TimePickerOption[];
  value: string;
  loop: boolean;
  onValueChange: (value: string, details?: TimePickerColumnValueChangeDetails) => void;
}

export interface TimePickerColumnValueChangeDetails {
  stepDelta: number;
}

export interface UseTimePickerProps {
  /**
   * 제어할 시간 값입니다. 24시간 형식으로 전달합니다.
   */
  value?: TimePickerValue;

  /**
   * 제어하지 않는 방식으로 사용할 때의 초기 시간 값입니다.
   *
   * @default { hour: 0, minute: 0 }
   */
  defaultValue?: TimePickerValue;

  /**
   * 휠 스크롤이 선택 항목에 정착하여 값이 확정될 때 호출됩니다.
   */
  onValueChange?: (value: TimePickerValue) => void;

  /**
   * 분 컬럼의 선택 간격입니다. 간격에 맞지 않는 값은 가장 가까운 값으로 반올림합니다.
   *
   * @default 5
   */
  minuteStep?: MinuteStep;

  /**
   * 오전·오후 표기와 컬럼 순서를 결정할 locale입니다.
   * Lynx에는 `Intl`이 없어 언어 하위 태그가 `ko`, `ja`, `en`인 locale만 구분합니다.
   * 배열이면 지원하는 첫 locale을 쓰고, 지원하는 locale이 없으면 `en`을 씁니다.
   *
   * @default "ko-KR"
   */
  locale?: string | string[];

  /**
   * 모든 컬럼의 조작을 비활성화합니다.
   *
   * @default false
   */
  disabled?: boolean;
}

type TimePickerLanguage = "ko" | "ja" | "en";

interface TimePickerLocaleData {
  periodLabels: readonly [am: string, pm: string];
  columnOrder: readonly TimePickerColumnType[];
}

// `Intl.DateTimeFormat`의 h12 형식("오후 1:05", "午後1:05", "1:05 PM")에서 옮긴 값이다.
const LOCALE_DATA: Record<TimePickerLanguage, TimePickerLocaleData> = {
  ko: { periodLabels: ["오전", "오후"], columnOrder: ["period", "hour", "minute"] },
  ja: { periodLabels: ["午前", "午後"], columnOrder: ["period", "hour", "minute"] },
  en: { periodLabels: ["AM", "PM"], columnOrder: ["hour", "minute", "period"] },
};

const VALID_MINUTE_STEPS: readonly MinuteStep[] = [1, 5, 10, 15, 30];

function assertValidMinuteStep(minuteStep: number): asserts minuteStep is MinuteStep {
  if (!VALID_MINUTE_STEPS.includes(minuteStep as MinuteStep)) {
    throw new RangeError(
      `TimePicker: minuteStep은 ${VALID_MINUTE_STEPS.join(", ")} 중 하나여야 합니다.`,
    );
  }
}

function assertValidValue(value: TimePickerValue, propName: "value" | "defaultValue") {
  if (!Number.isInteger(value.hour) || value.hour < 0 || value.hour > 23) {
    throw new RangeError(`TimePicker: ${propName}.hour는 0 이상 23 이하의 정수여야 합니다.`);
  }
  if (!Number.isInteger(value.minute) || value.minute < 0 || value.minute > 59) {
    throw new RangeError(`TimePicker: ${propName}.minute은 0 이상 59 이하의 정수여야 합니다.`);
  }
}

function normalizeValueToMinuteStep(value: TimePickerValue, minuteStep: MinuteStep) {
  if (value.minute % minuteStep === 0) return value;

  const minutesInDay = 24 * 60;
  const totalMinutes = value.hour * 60 + value.minute;
  const roundedMinutes = Math.round(totalMinutes / minuteStep) * minuteStep;
  const normalizedMinutes = roundedMinutes % minutesInDay;

  return {
    hour: Math.floor(normalizedMinutes / 60),
    minute: normalizedMinutes % 60,
  };
}

function getPeriod(hour: number) {
  return hour < 12 ? "am" : "pm";
}

function getDisplayHour(hour: number) {
  const hourInPeriod = hour % 12;
  return hourInPeriod === 0 ? 12 : hourInPeriod;
}

function getHourFromPeriod(displayHour: number, period: string) {
  if (displayHour === 12) return period === "am" ? 0 : 12;
  return period === "am" ? displayHour : displayHour + 12;
}

function addHours(hour: number, amount: number) {
  return (hour + (amount % 24) + 24) % 24;
}

function resolveLanguage(locale: string | string[]): TimePickerLanguage {
  const locales = Array.isArray(locale) ? locale : [locale];

  for (const tag of locales) {
    const language = tag.split(/[-_]/)[0]?.toLowerCase();
    if (language === "ko" || language === "ja" || language === "en") return language;
  }
  return "en";
}

export type UseTimePickerReturn = ReturnType<typeof useTimePicker>;

export function useTimePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  minuteStep = DEFAULT_MINUTE_STEP,
  locale = DEFAULT_LOCALE,
  disabled = false,
}: UseTimePickerProps = {}) {
  assertValidMinuteStep(minuteStep);
  if (valueProp !== undefined) assertValidValue(valueProp, "value");
  if (defaultValue !== undefined) assertValidValue(defaultValue, "defaultValue");

  const normalizedDefaultValue = normalizeValueToMinuteStep(
    defaultValue ?? DEFAULT_VALUE,
    minuteStep,
  );
  const normalizedValueProp =
    valueProp === undefined ? undefined : normalizeValueToMinuteStep(valueProp, minuteStep);
  const [rawValue, setValue] = useControllableState({
    value: normalizedValueProp,
    defaultValue: normalizedDefaultValue,
    onChange: onValueChange,
  });
  const value = normalizeValueToMinuteStep(rawValue, minuteStep);
  const { periodLabels, columnOrder } = LOCALE_DATA[resolveLanguage(locale)];

  const periodOptions = useMemo<readonly TimePickerOption[]>(
    () => [
      { value: "am", label: periodLabels[0] },
      { value: "pm", label: periodLabels[1] },
    ],
    [periodLabels],
  );
  const hourOptions = useMemo<readonly TimePickerOption[]>(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const hour = String(index + 1);
        return { value: hour, label: hour };
      }),
    [],
  );
  const minuteOptions = useMemo<readonly TimePickerOption[]>(
    () =>
      Array.from({ length: 60 / minuteStep }, (_, index) => {
        const minute = index * minuteStep;
        return { value: String(minute), label: String(minute).padStart(2, "0") };
      }),
    [minuteStep],
  );
  const isInteractive = !disabled;

  const periodColumn: TimePickerColumn = {
    type: "period",
    options: periodOptions,
    value: getPeriod(value.hour),
    loop: false,
    onValueChange: (period) => {
      if (!isInteractive || period === getPeriod(value.hour)) return;
      setValue({
        hour: period === "am" ? value.hour - 12 : value.hour + 12,
        minute: value.minute,
      });
    },
  };
  const hourColumn: TimePickerColumn = {
    type: "hour",
    options: hourOptions,
    value: String(getDisplayHour(value.hour)),
    loop: true,
    onValueChange: (hour, details) => {
      if (!isInteractive) return;
      const nextHour = details
        ? addHours(value.hour, details.stepDelta)
        : getHourFromPeriod(Number(hour), getPeriod(value.hour));
      if (nextHour === value.hour) return;
      setValue({ hour: nextHour, minute: value.minute });
    },
  };
  const minuteColumn: TimePickerColumn = {
    type: "minute",
    options: minuteOptions,
    value: String(value.minute),
    loop: true,
    onValueChange: (minute) => {
      if (!isInteractive) return;
      const nextMinute = Number(minute);
      if (nextMinute === value.minute) return;
      setValue({ hour: value.hour, minute: nextMinute });
    },
  };

  return {
    value,
    columnOrder,
    columns: {
      period: periodColumn,
      hour: hourColumn,
      minute: minuteColumn,
    },
  };
}
