"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";

const DEFAULT_VALUE: TimePickerValue = { hour: 0, minute: 0 };
const DEFAULT_LOCALE = "ko-KR";
const DEFAULT_MINUTE_STEP = 5;

export interface TimePickerValue {
  hour: number;
  minute: number;
}

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
  onValueChange: (value: string) => void;
}

export interface UseTimePickerProps {
  value?: TimePickerValue;
  defaultValue?: TimePickerValue;
  onValueChange?: (value: TimePickerValue) => void;
  minuteStep?: MinuteStep;
  locale?: string | string[];
  disabled?: boolean;
}

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

function getFormatDate(hour: number, minute = 0) {
  return new Date(Date.UTC(2020, 0, 1, hour, minute));
}

function getDayPeriodLabel(formatter: Intl.DateTimeFormat, hour: number, fallback: string) {
  return (
    formatter.formatToParts(getFormatDate(hour)).find((part) => part.type === "dayPeriod")?.value ??
    fallback
  );
}

function createFormatters(localeKey: string) {
  const canonicalLocales = localeKey === "" ? [] : localeKey.split(",");
  const dateTimeFormatter = new Intl.DateTimeFormat(canonicalLocales, {
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
    timeZone: "UTC",
  });
  const hourFormatter = new Intl.NumberFormat(canonicalLocales);
  const minuteFormatter = new Intl.NumberFormat(canonicalLocales, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return { canonicalLocales, dateTimeFormatter, hourFormatter, minuteFormatter };
}

function getColumnOrder(formatter: Intl.DateTimeFormat): TimePickerColumnType[] {
  const typeMap: Partial<Record<Intl.DateTimeFormatPartTypes, TimePickerColumnType>> = {
    dayPeriod: "period",
    hour: "hour",
    minute: "minute",
  };
  const order = formatter
    .formatToParts(getFormatDate(13, 5))
    .map((part) => typeMap[part.type])
    .filter((type): type is TimePickerColumnType => type !== undefined);

  const result = [...order];
  for (const type of ["period", "hour", "minute"] as const) {
    if (!result.includes(type)) result.push(type);
  }
  return result;
}

export type UseTimePickerReturn = ReturnType<typeof useTimePicker>;

export function useTimePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  minuteStep = DEFAULT_MINUTE_STEP,
  locale = DEFAULT_LOCALE,
  disabled = false,
}: UseTimePickerProps) {
  assertValidMinuteStep(minuteStep);
  if (valueProp !== undefined) assertValidValue(valueProp, "value");
  if (defaultValue !== undefined) assertValidValue(defaultValue, "defaultValue");

  const normalizedDefaultValue = normalizeValueToMinuteStep(
    defaultValue ?? DEFAULT_VALUE,
    minuteStep,
  );
  const normalizedValueProp =
    valueProp === undefined ? undefined : normalizeValueToMinuteStep(valueProp, minuteStep);
  const [value = normalizedDefaultValue, setValue] = useControllableState({
    prop: normalizedValueProp,
    defaultProp: normalizedDefaultValue,
    onChange: onValueChange,
  });
  const localeKey = Intl.getCanonicalLocales(locale).join(",");
  const { dateTimeFormatter, hourFormatter, minuteFormatter } = React.useMemo(
    () => createFormatters(localeKey),
    [localeKey],
  );

  const periodOptions = React.useMemo<readonly TimePickerOption[]>(
    () => [
      { value: "am", label: getDayPeriodLabel(dateTimeFormatter, 1, "AM") },
      { value: "pm", label: getDayPeriodLabel(dateTimeFormatter, 13, "PM") },
    ],
    [dateTimeFormatter],
  );
  const hourOptions = React.useMemo<readonly TimePickerOption[]>(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const hour = index + 1;
        return { value: String(hour), label: hourFormatter.format(hour) };
      }),
    [hourFormatter],
  );
  const minuteOptions = React.useMemo<readonly TimePickerOption[]>(() => {
    const minuteValues = Array.from({ length: 60 / minuteStep }, (_, index) => index * minuteStep);

    return minuteValues.map((minute) => ({
      value: String(minute),
      label: minuteFormatter.format(minute),
    }));
  }, [minuteFormatter, minuteStep]);
  const columnOrder = React.useMemo(() => getColumnOrder(dateTimeFormatter), [dateTimeFormatter]);
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
    onValueChange: (hour) => {
      if (!isInteractive) return;
      const nextHour = getHourFromPeriod(Number(hour), getPeriod(value.hour));
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
