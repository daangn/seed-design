"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { ariaAttr, dataAttr, elementProps } from "@seed-design/dom-utils";
import * as React from "react";
import {
  addDays,
  addMonths,
  addYears,
  assertDateInMonthRange,
  assertDateInYearRange,
  assertValidYearMonth,
  clampDateToMonthRange,
  compareDates,
  compareYearMonths,
  CONTINUOUS_MONTH_GAP,
  CONTINUOUS_MONTH_LABEL_HEIGHT,
  CONTINUOUS_WEEKDAY_HEIGHT,
  dateKey,
  DEFAULT_DATE_CELL_HEIGHT,
  getDaysInMonth,
  getLocalToday,
  getMonthWeekCount,
  getMonthWeekStarts,
  getWeekEnd,
  getWeekStart,
  isSameDate,
  normalizeViewDate,
  resolveWeekStartsOn,
  startOfMonth,
  toCalendarDate,
} from "./date";
import type {
  DatePickerAriaLabels,
  DatePickerActions,
  DatePickerCell,
  DatePickerConstraint,
  DatePickerConstraintContext,
  DatePickerDate,
  DatePickerMonth,
  DatePickerMonthRange,
  DatePickerRangeValue,
  DatePickerSelectionMode,
  DatePickerValue,
  DatePickerVisibleRange,
  DatePickerWeek,
  UseDatePickerProps,
} from "./types";

const CONTINUOUS_OVERSCAN_MONTHS = 2;
const EMPTY_CONSTRAINTS: readonly DatePickerConstraint[] = [];
const RTL_LANGUAGES = new Set(["ar", "fa", "he", "ps", "ur"]);

const DEFAULT_ARIA_LABELS = {
  ko: {
    root: "날짜 선택",
    previousMonth: "이전 달",
    nextMonth: "다음 달",
    previousWeek: "이전 주",
    nextWeek: "다음 주",
    yearWheel: "연도",
    monthWheel: "월",
    readOnlyRangeStart: "읽기 전용 시작일",
  },
  en: {
    root: "Select date",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    previousWeek: "Previous week",
    nextWeek: "Next week",
    yearWheel: "Year",
    monthWheel: "Month",
    readOnlyRangeStart: "read-only start date",
  },
} satisfies Record<string, DatePickerAriaLabels>;

interface MonthDescriptor {
  date: DatePickerDate;
  key: string;
  offset: number;
  height: number;
  weekCount: number;
}

type MonthDescriptorBase = Pick<MonthDescriptor, "date" | "key" | "weekCount">;

const MONTH_DESCRIPTOR_BASES_CACHE_LIMIT = 10;
const monthDescriptorBasesCache = new Map<string, readonly MonthDescriptorBase[]>();

function getSelectionMode(props: UseDatePickerProps): DatePickerSelectionMode {
  return props.selectionMode ?? "single";
}

function getInitialSelectedDate(mode: DatePickerSelectionMode, value: DatePickerValue) {
  if (mode === "single") return value as DatePickerDate | undefined;
  if (mode === "range") return (value as DatePickerRangeValue | undefined)?.start;
  return [...((value as readonly DatePickerDate[] | undefined) ?? [])].sort(compareDates)[0];
}

function validateYearRange(yearRange: { start: number; end: number }) {
  if (
    !Number.isInteger(yearRange.start) ||
    !Number.isInteger(yearRange.end) ||
    yearRange.start > yearRange.end
  ) {
    throw new RangeError(
      "DatePicker: yearRange.start와 yearRange.end는 start <= end인 정수여야 합니다.",
    );
  }
}

function resolveMonthRange(
  yearRange: { start: number; end: number },
  monthRange: DatePickerMonthRange | undefined,
): DatePickerMonthRange {
  const resolved =
    monthRange ??
    ({
      start: { year: yearRange.start, month: 1 },
      end: { year: yearRange.end, month: 12 },
    } satisfies DatePickerMonthRange);

  assertValidYearMonth(resolved.start, "monthRange.start");
  assertValidYearMonth(resolved.end, "monthRange.end");
  if (compareYearMonths(resolved.start, resolved.end) > 0) {
    throw new RangeError("DatePicker: monthRange.start는 monthRange.end보다 늦을 수 없습니다.");
  }
  if (resolved.start.year < yearRange.start || resolved.end.year > yearRange.end) {
    throw new RangeError("DatePicker: monthRange는 yearRange 안에 있어야 합니다.");
  }
  return resolved;
}

function validateValue(
  mode: DatePickerSelectionMode,
  value: DatePickerValue,
  yearRange: { start: number; end: number },
  monthRange: DatePickerMonthRange,
  propName: "value" | "defaultValue",
) {
  if (value === undefined) return;

  if (mode === "single") {
    assertDateInYearRange(value as DatePickerDate, yearRange, propName);
    assertDateInMonthRange(value as DatePickerDate, monthRange, propName);
    return;
  }

  if (mode === "range") {
    const range = value as DatePickerRangeValue;
    assertDateInYearRange(range.start, yearRange, `${propName}.start`);
    assertDateInMonthRange(range.start, monthRange, `${propName}.start`);
    if (range.end !== undefined) {
      assertDateInYearRange(range.end, yearRange, `${propName}.end`);
      assertDateInMonthRange(range.end, monthRange, `${propName}.end`);
      if (compareDates(range.start, range.end) > 0) {
        throw new RangeError(`DatePicker: ${propName}.start는 end보다 늦을 수 없습니다.`);
      }
    }
    return;
  }

  const dates = value as readonly DatePickerDate[];
  const keys = new Set<string>();
  dates.forEach((date, index) => {
    assertDateInYearRange(date, yearRange, `${propName}[${index}]`);
    assertDateInMonthRange(date, monthRange, `${propName}[${index}]`);
    const key = dateKey(date);
    if (keys.has(key)) {
      throw new RangeError(`DatePicker: ${propName}에는 중복 날짜를 전달할 수 없습니다.`);
    }
    keys.add(key);
  });
}

function getDefaultAriaLabels(locale: string): DatePickerAriaLabels {
  return new Intl.Locale(locale).language === "ko"
    ? DEFAULT_ARIA_LABELS.ko
    : DEFAULT_ARIA_LABELS.en;
}

function getCanonicalLocale(locale: string | string[] | undefined) {
  return Intl.getCanonicalLocales(locale ?? "ko-KR")[0] ?? "ko-KR";
}

function isRtlLocale(locale: string) {
  return RTL_LANGUAGES.has(new Intl.Locale(locale).language);
}

function getMonthDescriptorBases(
  monthRange: DatePickerMonthRange,
  locale: string,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined,
) {
  const cacheKey = `${monthRange.start.year}:${monthRange.start.month}:${monthRange.end.year}:${monthRange.end.month}:${locale}:${weekStartsOn ?? "locale"}`;
  const cached = monthDescriptorBasesCache.get(cacheKey);
  if (cached) {
    monthDescriptorBasesCache.delete(cacheKey);
    monthDescriptorBasesCache.set(cacheKey, cached);
    return cached;
  }

  const result: MonthDescriptorBase[] = [];
  const resolvedWeekStartsOn = resolveWeekStartsOn(locale, weekStartsOn);

  const start = { ...monthRange.start, day: 1 };
  const end = { ...monthRange.end, day: 1 };
  for (let date = start; compareDates(date, end) <= 0; date = addMonths(date, 1)) {
    const key = dateKey(date);
    const weekCount = getMonthWeekCount(date, resolvedWeekStartsOn);
    result.push({ date, key, weekCount });
  }

  if (monthDescriptorBasesCache.size >= MONTH_DESCRIPTOR_BASES_CACHE_LIMIT) {
    const oldestKey = monthDescriptorBasesCache.keys().next().value;
    if (oldestKey !== undefined) monthDescriptorBasesCache.delete(oldestKey);
  }
  monthDescriptorBasesCache.set(cacheKey, result);
  return result;
}

function getMonthDescriptors(
  bases: readonly MonthDescriptorBase[],
  measuredHeights: ReadonlyMap<string, number>,
) {
  const result: MonthDescriptor[] = [];
  let offset = 0;

  for (const base of bases) {
    const height =
      measuredHeights.get(base.key) ??
      CONTINUOUS_MONTH_LABEL_HEIGHT +
        base.weekCount * DEFAULT_DATE_CELL_HEIGHT +
        CONTINUOUS_MONTH_GAP;
    result.push({ ...base, offset, height });
    offset += height;
  }

  return { descriptors: result, totalHeight: offset };
}

function findMonthIndexAtOffset(descriptors: readonly MonthDescriptor[], offset: number) {
  let low = 0;
  let high = descriptors.length - 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const descriptor = descriptors[middle];
    if (offset < descriptor.offset) {
      high = middle - 1;
    } else if (offset >= descriptor.offset + descriptor.height) {
      low = middle + 1;
    } else {
      return middle;
    }
  }
  return Math.min(Math.max(low, 0), Math.max(descriptors.length - 1, 0));
}

function getDateForMonthAndDay(year: number, month: number, preferredDay: number) {
  const first = { year, month, day: 1 };
  return { ...first, day: Math.min(preferredDay, getDaysInMonth(first)) };
}

function getVisibleDateBounds(
  viewDate: DatePickerDate,
  visibleRange: DatePickerVisibleRange,
): { start: DatePickerDate; end: DatePickerDate } | undefined {
  if (visibleRange === "continuous") return undefined;
  if (visibleRange === "week") return { start: viewDate, end: addDays(viewDate, 6) };

  const start = startOfMonth(viewDate);
  const endMonth = visibleRange === "twoMonths" ? addMonths(start, 1) : start;
  return { start, end: { ...endMonth, day: getDaysInMonth(endMonth) } };
}

export type UseDatePickerReturn = ReturnType<typeof useDatePicker>;

export function useDatePicker(props: UseDatePickerProps) {
  const selectionMode = getSelectionMode(props);
  const visibleRange: DatePickerVisibleRange = props.visibleRange ?? "month";
  const locale = getCanonicalLocale(props.locale);
  const today = props.today ?? getLocalToday();
  const yearRangeStart = props.yearRange?.start ?? today.year - 100;
  const yearRangeEnd = props.yearRange?.end ?? today.year + 100;
  const yearRange = React.useMemo(
    () => ({ start: yearRangeStart, end: yearRangeEnd }),
    [yearRangeEnd, yearRangeStart],
  );
  validateYearRange(yearRange);

  const monthRangeStartYear = props.monthRange?.start.year;
  const monthRangeStartMonth = props.monthRange?.start.month;
  const monthRangeEndYear = props.monthRange?.end.year;
  const monthRangeEndMonth = props.monthRange?.end.month;
  const monthRange = React.useMemo(
    () =>
      resolveMonthRange(
        yearRange,
        monthRangeStartYear === undefined ||
          monthRangeStartMonth === undefined ||
          monthRangeEndYear === undefined ||
          monthRangeEndMonth === undefined
          ? undefined
          : {
              start: { year: monthRangeStartYear, month: monthRangeStartMonth },
              end: { year: monthRangeEndYear, month: monthRangeEndMonth },
            },
      ),
    [monthRangeEndMonth, monthRangeEndYear, monthRangeStartMonth, monthRangeStartYear, yearRange],
  );

  assertDateInYearRange(today, yearRange, "today");
  validateValue(selectionMode, props.value, yearRange, monthRange, "value");
  validateValue(selectionMode, props.defaultValue, yearRange, monthRange, "defaultValue");
  if (
    selectionMode === "range" &&
    props.rangeStartReadOnly === true &&
    props.value === undefined &&
    props.defaultValue === undefined
  ) {
    throw new Error(
      "DatePicker: rangeStartReadOnly가 true이면 value 또는 defaultValue가 필요합니다.",
    );
  }
  if (props.viewDate !== undefined) {
    assertDateInYearRange(props.viewDate, yearRange, "viewDate");
    assertDateInMonthRange(props.viewDate, monthRange, "viewDate");
  }
  if (props.defaultViewDate !== undefined) {
    assertDateInYearRange(props.defaultViewDate, yearRange, "defaultViewDate");
    assertDateInMonthRange(props.defaultViewDate, monthRange, "defaultViewDate");
  }

  const defaultSelection = selectionMode === "multiple" ? [] : undefined;
  const [value = defaultSelection, setValue] = useControllableState<DatePickerValue>({
    prop: props.value,
    defaultProp: props.defaultValue ?? defaultSelection,
    onChange: props.onValueChange as ((value: DatePickerValue) => void) | undefined,
  });

  const initialSelectedDate = getInitialSelectedDate(
    selectionMode,
    props.value ?? props.defaultValue,
  );
  const initialViewSource = clampDateToMonthRange(
    props.viewDate ?? props.defaultViewDate ?? initialSelectedDate ?? today,
    monthRange,
  );
  const viewDateYear = props.viewDate?.year;
  const viewDateMonth = props.viewDate?.month;
  const viewDateDay = props.viewDate?.day;
  const normalizedViewProp = React.useMemo(() => {
    if (viewDateYear === undefined || viewDateMonth === undefined || viewDateDay === undefined) {
      return undefined;
    }
    return normalizeViewDate(
      { year: viewDateYear, month: viewDateMonth, day: viewDateDay },
      visibleRange,
      locale,
      props.weekStartsOn,
    );
  }, [locale, props.weekStartsOn, viewDateDay, viewDateMonth, viewDateYear, visibleRange]);
  const normalizedDefaultView = normalizeViewDate(
    initialViewSource,
    visibleRange,
    locale,
    props.weekStartsOn,
  );
  const [viewDate = normalizedDefaultView, setViewDateState] = useControllableState<DatePickerDate>(
    {
      prop: normalizedViewProp,
      defaultProp: normalizedDefaultView,
      onChange: props.onViewDateChange,
    },
  );
  const [focusedDate, setFocusedDate] = React.useState<DatePickerDate>(
    initialSelectedDate ?? viewDate,
  );
  const [isWheelOpen, setIsWheelOpen] = React.useState(false);
  const [wheelViewDate, setWheelViewDate] = React.useState<DatePickerDate>(viewDate);
  const rootId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const shouldMoveDomFocusRef = React.useRef(false);
  // 같은 날짜를 다시 요청해도 layout effect가 DOM 포커스를 이동하도록 commit을 보장합니다.
  const [, requestDomFocusCommit] = React.useReducer((request) => request + 1, 0);
  const constraints = props.constraints ?? EMPTY_CONSTRAINTS;
  const ariaLabels = React.useMemo(
    () => ({ ...getDefaultAriaLabels(locale), ...props.ariaLabels }),
    [locale, props.ariaLabels],
  );
  const disabled = props.disabled ?? false;
  const readOnly = props.readOnly ?? false;
  const rangeStartReadOnly = selectionMode === "range" && props.rangeStartReadOnly === true;
  const isRtl = isRtlLocale(locale);

  const dayFormatter = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const monthFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        timeZone: "UTC",
      }),
    [locale],
  );
  const fullDateFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "full", timeZone: "UTC" }),
    [locale],
  );
  const weekdayShortFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }),
    [locale],
  );
  const weekdayLongFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }),
    [locale],
  );

  const formatMonth = React.useCallback(
    (date: DatePickerDate) => monthFormatter.format(toCalendarDate(date).toDate("UTC")),
    [monthFormatter],
  );
  const formatFullDate = React.useCallback(
    (date: DatePickerDate) => fullDateFormatter.format(toCalendarDate(date).toDate("UTC")),
    [fullDateFormatter],
  );

  const weekdayLabels = React.useMemo(() => {
    const anchor = getWeekStart({ year: 2024, month: 1, day: 7 }, locale, props.weekStartsOn);
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(anchor, index);
      const nativeDate = toCalendarDate(date).toDate("UTC");
      return {
        key: dateKey(date),
        short: weekdayShortFormatter.format(nativeDate),
        long: weekdayLongFormatter.format(nativeDate),
      };
    });
  }, [locale, props.weekStartsOn, weekdayLongFormatter, weekdayShortFormatter]);

  const getConstraintContext = React.useCallback(
    (candidate: DatePickerDate): DatePickerConstraintContext => {
      const multipleValue =
        selectionMode === "multiple" ? (value as readonly DatePickerDate[]) : undefined;
      const rangeValue =
        selectionMode === "range" ? (value as DatePickerRangeValue | undefined) : undefined;
      const action =
        multipleValue?.some((selectedDate) => isSameDate(selectedDate, candidate)) === true
          ? "deselect"
          : "select";
      return {
        selectionMode,
        value,
        rangeStart:
          rangeStartReadOnly || rangeValue?.end === undefined ? rangeValue?.start : undefined,
        action,
      };
    },
    [rangeStartReadOnly, selectionMode, value],
  );

  const isUnavailable = React.useCallback(
    (date: DatePickerDate) => {
      if (
        compareYearMonths(date, monthRange.start) < 0 ||
        compareYearMonths(date, monthRange.end) > 0
      ) {
        return true;
      }
      const rangeValue =
        selectionMode === "range" ? (value as DatePickerRangeValue | undefined) : undefined;
      if (rangeStartReadOnly && isSameDate(date, rangeValue?.start)) return false;
      if (
        rangeStartReadOnly &&
        rangeValue?.start !== undefined &&
        compareDates(date, rangeValue.start) < 0
      ) {
        return true;
      }
      const context = getConstraintContext(date);
      return constraints.some((constraint) => !constraint(date, context));
    },
    [
      constraints,
      getConstraintContext,
      rangeStartReadOnly,
      selectionMode,
      value,
      monthRange.end,
      monthRange.start,
    ],
  );

  const setViewDate = React.useCallback(
    (date: DatePickerDate) => {
      const clamped = clampDateToMonthRange(date, monthRange);
      const normalized = normalizeViewDate(clamped, visibleRange, locale, props.weekStartsOn);
      if (!isSameDate(normalized, viewDate)) setViewDateState(normalized);
    },
    [locale, monthRange, props.weekStartsOn, setViewDateState, viewDate, visibleRange],
  );

  useLayoutEffect(() => {
    if (props.viewDate !== undefined) return;
    const clampedViewDate = clampDateToMonthRange(viewDate, monthRange);
    if (!isSameDate(clampedViewDate, viewDate)) setViewDate(clampedViewDate);
    setFocusedDate((current) => clampDateToMonthRange(current, monthRange));
  }, [monthRange, props.viewDate, setViewDate, viewDate]);

  const navigateToDate = React.useCallback(
    (date: DatePickerDate) => {
      assertDateInYearRange(date, yearRange, "actions.navigateToDate(date)");
      assertDateInMonthRange(date, monthRange, "actions.navigateToDate(date)");
      shouldMoveDomFocusRef.current = false;
      setFocusedDate(date);
      setViewDate(date);
    },
    [monthRange, setViewDate, yearRange],
  );

  const focusDate = React.useCallback(
    (date: DatePickerDate) => {
      assertDateInYearRange(date, yearRange, "actions.focusDate(date)");
      assertDateInMonthRange(date, monthRange, "actions.focusDate(date)");
      shouldMoveDomFocusRef.current = true;
      setFocusedDate(date);
      setViewDate(date);
      requestDomFocusCommit();
    },
    [monthRange, setViewDate, yearRange],
  );

  const actions: DatePickerActions = React.useMemo(
    () => ({ navigateToDate, focusDate }),
    [focusDate, navigateToDate],
  );

  const selectDate = React.useCallback(
    (date: DatePickerDate) => {
      if (disabled || readOnly || isUnavailable(date)) return;

      if (selectionMode === "single") {
        if (!isSameDate(value as DatePickerDate | undefined, date)) {
          setValue(date);
        }
        return;
      }

      if (selectionMode === "multiple") {
        const current = [...((value as readonly DatePickerDate[] | undefined) ?? [])];
        const selectedIndex = current.findIndex((selectedDate) => isSameDate(selectedDate, date));
        if (selectedIndex >= 0) current.splice(selectedIndex, 1);
        else current.push(date);
        current.sort(compareDates);
        setValue(current);
        return;
      }

      const range = value as DatePickerRangeValue | undefined;
      if (rangeStartReadOnly) {
        if (range === undefined || compareDates(date, range.start) <= 0) return;
        if (isSameDate(date, range.end)) return;
        setValue({ start: range.start, end: date });
        return;
      }
      if (range === undefined || range.end !== undefined) {
        setValue({ start: date });
      } else if (compareDates(date, range.start) < 0) {
        setValue({ start: date });
      } else {
        setValue({ start: range.start, end: date });
      }
    },
    [disabled, isUnavailable, rangeStartReadOnly, readOnly, selectionMode, setValue, value],
  );

  const getCellSelectionState = React.useCallback(
    (date: DatePickerDate) => {
      if (selectionMode === "single") {
        const selected = isSameDate(value as DatePickerDate | undefined, date);
        return {
          isSelected: selected,
          isRangeStart: false,
          isRangeEnd: false,
          isInRange: false,
        };
      }

      if (selectionMode === "multiple") {
        const selected = ((value as readonly DatePickerDate[] | undefined) ?? []).some(
          (selectedDate) => isSameDate(selectedDate, date),
        );
        return {
          isSelected: selected,
          isRangeStart: false,
          isRangeEnd: false,
          isInRange: false,
        };
      }

      const range = value as DatePickerRangeValue | undefined;
      const isRangeStart = isSameDate(range?.start, date);
      const isRangeEnd = isSameDate(range?.end, date);
      const isInRange =
        range?.end !== undefined &&
        compareDates(date, range.start) > 0 &&
        compareDates(date, range.end) < 0;
      const isSelected =
        range !== undefined &&
        (range.end === undefined
          ? isRangeStart
          : compareDates(date, range.start) >= 0 && compareDates(date, range.end) <= 0);
      return { isSelected, isRangeStart, isRangeEnd, isInRange };
    },
    [selectionMode, value],
  );

  const moveFocus = React.useCallback(
    (nextDate: DatePickerDate) => {
      const clamped = clampDateToMonthRange(nextDate, monthRange);
      shouldMoveDomFocusRef.current = true;
      setFocusedDate(clamped);

      const visibleBounds = getVisibleDateBounds(viewDate, visibleRange);
      if (visibleBounds === undefined) {
        setViewDate(startOfMonth(clamped));
        return;
      }

      if (
        compareDates(clamped, visibleBounds.start) < 0 ||
        compareDates(clamped, visibleBounds.end) > 0
      ) {
        setViewDate(clamped);
      }
    },
    [monthRange, setViewDate, viewDate, visibleRange],
  );

  React.useEffect(() => {
    const visibleBounds = getVisibleDateBounds(viewDate, visibleRange);
    if (visibleBounds === undefined) return;

    if (
      compareDates(focusedDate, visibleBounds.start) < 0 ||
      compareDates(focusedDate, visibleBounds.end) > 0
    ) {
      setFocusedDate(viewDate);
    }
  }, [focusedDate, viewDate, visibleRange]);

  useLayoutEffect(() => {
    if (!shouldMoveDomFocusRef.current) return;
    const button = rootRef.current?.querySelector<HTMLElement>(
      `[data-date-picker-date="${dateKey(focusedDate)}"]`,
    );
    if (!button) return;
    shouldMoveDomFocusRef.current = false;
    button.focus();
  });

  const getDateCell = React.useCallback(
    (date: DatePickerDate): DatePickerCell => {
      const selectionState = getCellSelectionState(date);
      const unavailable = isUnavailable(date);
      const focused = isSameDate(focusedDate, date);
      const todayState = isSameDate(today, date);
      const key = dateKey(date);
      const isRangeComplete =
        selectionMode === "range" && (value as DatePickerRangeValue | undefined)?.end !== undefined;
      const isRangeStartReadOnly = rangeStartReadOnly && selectionState.isRangeStart;
      const stateProps = {
        "data-today": dataAttr(todayState),
        "data-selected": dataAttr(selectionState.isSelected),
        "data-range-start": dataAttr(selectionState.isRangeStart),
        "data-range-end": dataAttr(selectionState.isRangeEnd),
        "data-in-range": dataAttr(selectionState.isInRange),
        "data-range-complete": dataAttr(isRangeComplete),
        "data-unavailable": dataAttr(unavailable),
        "data-range-start-readonly": dataAttr(isRangeStartReadOnly),
        "data-focused": dataAttr(focused),
        "data-disabled": dataAttr(disabled),
        "data-readonly": dataAttr(readOnly),
      };

      return {
        date,
        key,
        formattedDay: dayFormatter.format(date.day),
        isToday: todayState,
        ...selectionState,
        isUnavailable: unavailable,
        isRangeStartReadOnly,
        isFocused: focused,
        cellProps: elementProps({
          role: "gridcell",
          "aria-selected": ariaAttr(selectionState.isSelected),
          ...stateProps,
        }),
        buttonProps: {
          type: "button",
          tabIndex: disabled ? -1 : focused ? 0 : -1,
          disabled,
          "aria-label": isRangeStartReadOnly
            ? `${formatFullDate(date)}, ${ariaLabels.readOnlyRangeStart}`
            : formatFullDate(date),
          "aria-current": todayState ? "date" : undefined,
          "aria-disabled": ariaAttr(unavailable || disabled || isRangeStartReadOnly),
          "data-date-picker-date": key,
          ...stateProps,
          onClick(event) {
            if (event.defaultPrevented) return;
            setFocusedDate(date);
            selectDate(date);
          },
          onFocus() {
            setFocusedDate(date);
          },
          onKeyDown(event) {
            if (event.defaultPrevented || event.nativeEvent.isComposing) return;
            let nextDate: DatePickerDate | undefined;

            switch (event.key) {
              case "ArrowLeft":
                nextDate = addDays(date, isRtl ? 1 : -1);
                break;
              case "ArrowRight":
                nextDate = addDays(date, isRtl ? -1 : 1);
                break;
              case "ArrowUp":
                nextDate = addDays(date, -7);
                break;
              case "ArrowDown":
                nextDate = addDays(date, 7);
                break;
              case "Home":
                nextDate = getWeekStart(date, locale, props.weekStartsOn);
                break;
              case "End":
                nextDate = getWeekEnd(date, locale, props.weekStartsOn);
                break;
              case "PageUp":
                nextDate = event.shiftKey
                  ? addYears(date, -1)
                  : visibleRange === "week"
                    ? addDays(date, -7)
                    : addMonths(date, visibleRange === "twoMonths" ? -2 : -1);
                break;
              case "PageDown":
                nextDate = event.shiftKey
                  ? addYears(date, 1)
                  : visibleRange === "week"
                    ? addDays(date, 7)
                    : addMonths(date, visibleRange === "twoMonths" ? 2 : 1);
                break;
              case "Enter":
              case " ":
                event.preventDefault();
                selectDate(date);
                return;
              default:
                return;
            }

            event.preventDefault();
            moveFocus(nextDate);
          },
        },
      };
    },
    [
      dayFormatter,
      disabled,
      focusedDate,
      formatFullDate,
      getCellSelectionState,
      isRtl,
      isUnavailable,
      ariaLabels.readOnlyRangeStart,
      locale,
      moveFocus,
      props.weekStartsOn,
      readOnly,
      rangeStartReadOnly,
      selectionMode,
      selectDate,
      today,
      value,
      visibleRange,
    ],
  );

  const createMonth = React.useCallback(
    (monthDate: DatePickerDate, descriptor?: MonthDescriptor): DatePickerMonth => {
      const month = startOfMonth(monthDate);
      const weeks = getMonthWeekStarts(month, locale, props.weekStartsOn).map<DatePickerWeek>(
        (weekStart) => {
          const cells = Array.from({ length: 7 }, (_, dayIndex) => {
            const date = addDays(weekStart, dayIndex);
            return date.month === month.month && date.year === month.year
              ? getDateCell(date)
              : null;
          });
          return { key: dateKey(weekStart), cells };
        },
      );
      return {
        key: dateKey(month),
        date: month,
        label: formatMonth(month),
        weeks,
        offset: descriptor?.offset,
        height: descriptor?.height,
      };
    },
    [formatMonth, getDateCell, locale, props.weekStartsOn],
  );

  const standardMonths = React.useMemo(() => {
    if (visibleRange === "continuous" || visibleRange === "week") return [];
    const months = [createMonth(viewDate)];
    if (visibleRange === "twoMonths") months.push(createMonth(addMonths(viewDate, 1)));
    return months;
  }, [createMonth, viewDate, visibleRange]);

  const weekMonth = React.useMemo<DatePickerMonth | undefined>(() => {
    if (visibleRange !== "week") return undefined;
    const weekStart = getWeekStart(viewDate, locale, props.weekStartsOn);
    const cells = Array.from({ length: 7 }, (_, index) => getDateCell(addDays(weekStart, index)));
    return {
      key: dateKey(weekStart),
      date: weekStart,
      label: formatMonth(weekStart),
      weeks: [{ key: dateKey(weekStart), cells }],
    };
  }, [formatMonth, getDateCell, locale, props.weekStartsOn, viewDate, visibleRange]);

  const [continuousMonthHeights, setContinuousMonthHeights] = React.useState<
    ReadonlyMap<string, number>
  >(() => new Map());
  const continuousMonthDescriptorBases = React.useMemo(
    () =>
      visibleRange === "continuous"
        ? getMonthDescriptorBases(monthRange, locale, props.weekStartsOn)
        : [],
    [locale, monthRange, props.weekStartsOn, visibleRange],
  );
  const { descriptors, totalHeight } = React.useMemo(
    () =>
      visibleRange === "continuous"
        ? getMonthDescriptors(continuousMonthDescriptorBases, continuousMonthHeights)
        : { descriptors: [], totalHeight: 0 },
    [continuousMonthDescriptorBases, continuousMonthHeights, visibleRange],
  );
  const [continuousScrollElement, setContinuousScrollElement] =
    React.useState<HTMLDivElement | null>(null);
  const [continuousScrollTop, setContinuousScrollTop] = React.useState(0);
  const [continuousViewportHeight, setContinuousViewportHeight] = React.useState(0);
  const scrollFrameRef = React.useRef<number | null>(null);
  const scrollDrivenViewKeyRef = React.useRef<string | null>(null);
  const continuousUserScrolledRef = React.useRef(false);
  const continuousSyncRef = React.useRef<{
    element: HTMLDivElement;
    viewKey: string;
  } | null>(null);
  const continuousMonthObserversRef = React.useRef(new Map<string, ResizeObserver>());
  const continuousMonthRefsRef = React.useRef(
    new Map<string, (element: HTMLDivElement | null) => void>(),
  );

  const getContinuousMonthRef = React.useCallback((key: string) => {
    const existing = continuousMonthRefsRef.current.get(key);
    if (existing) return existing;

    const ref = (element: HTMLDivElement | null) => {
      continuousMonthObserversRef.current.get(key)?.disconnect();
      continuousMonthObserversRef.current.delete(key);
      if (!element) return;

      const updateHeight = () => {
        const height = element.getBoundingClientRect().height;
        if (height <= 0) return;
        setContinuousMonthHeights((current) => {
          if (Math.abs((current.get(key) ?? 0) - height) < 0.5) return current;
          const next = new Map(current);
          next.set(key, height);
          return next;
        });
      };

      updateHeight();
      const observer = new ResizeObserver(updateHeight);
      observer.observe(element);
      continuousMonthObserversRef.current.set(key, observer);
    };

    continuousMonthRefsRef.current.set(key, ref);
    return ref;
  }, []);

  React.useEffect(() => {
    if (!continuousScrollElement || visibleRange !== "continuous") return;
    const updateSize = () => setContinuousViewportHeight(continuousScrollElement.clientHeight);
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(continuousScrollElement);
    return () => observer.disconnect();
  }, [continuousScrollElement, visibleRange]);

  const currentContinuousIndex = React.useMemo(() => {
    if (visibleRange !== "continuous") return 0;
    return findMonthIndexAtOffset(descriptors, continuousScrollTop);
  }, [continuousScrollTop, descriptors, visibleRange]);
  const continuousEndIndex = React.useMemo(() => {
    if (visibleRange !== "continuous") return 0;
    return findMonthIndexAtOffset(
      descriptors,
      Math.max(
        continuousScrollTop +
          Math.max(continuousViewportHeight, DEFAULT_DATE_CELL_HEIGHT * 6) -
          CONTINUOUS_WEEKDAY_HEIGHT,
        0,
      ),
    );
  }, [continuousScrollTop, continuousViewportHeight, descriptors, visibleRange]);
  const virtualStartIndex = Math.max(currentContinuousIndex - CONTINUOUS_OVERSCAN_MONTHS, 0);
  const virtualEndIndex = Math.min(
    continuousEndIndex + CONTINUOUS_OVERSCAN_MONTHS,
    descriptors.length - 1,
  );
  const continuousMonths = React.useMemo(
    () =>
      visibleRange === "continuous"
        ? descriptors
            .slice(virtualStartIndex, virtualEndIndex + 1)
            .map((descriptor) => createMonth(descriptor.date, descriptor))
        : [],
    [createMonth, descriptors, virtualEndIndex, virtualStartIndex, visibleRange],
  );
  const virtualTopHeight = descriptors[virtualStartIndex]?.offset ?? 0;
  const lastVirtualDescriptor = descriptors[virtualEndIndex];
  const virtualBottomHeight =
    lastVirtualDescriptor === undefined
      ? 0
      : Math.max(totalHeight - lastVirtualDescriptor.offset - lastVirtualDescriptor.height, 0);

  const handleContinuousScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const element = event.currentTarget;
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        const nextScrollTop = element.scrollTop;
        setContinuousScrollTop(nextScrollTop);
        if (!continuousUserScrolledRef.current) return;
        const index = findMonthIndexAtOffset(descriptors, nextScrollTop);
        const nextViewDate = descriptors[index]?.date;
        if (nextViewDate && !isSameDate(nextViewDate, viewDate)) {
          scrollDrivenViewKeyRef.current = dateKey(nextViewDate);
          setViewDateState(nextViewDate);
          setFocusedDate(nextViewDate);
        }
      });
    },
    [descriptors, setViewDateState, viewDate],
  );
  const handleContinuousUserScroll = React.useCallback(() => {
    continuousUserScrolledRef.current = true;
  }, []);

  useLayoutEffect(() => {
    if (!continuousScrollElement || visibleRange !== "continuous") return;
    const viewKey = dateKey(startOfMonth(viewDate));
    const previousSync = continuousSyncRef.current;
    const shouldSync =
      previousSync?.element !== continuousScrollElement || previousSync.viewKey !== viewKey;
    if (shouldSync) {
      continuousSyncRef.current = { element: continuousScrollElement, viewKey };
      if (scrollDrivenViewKeyRef.current === viewKey) {
        scrollDrivenViewKeyRef.current = null;
        return;
      }
      scrollDrivenViewKeyRef.current = null;
      continuousUserScrolledRef.current = false;
    } else if (continuousUserScrolledRef.current) {
      return;
    }
    const index = Math.max(
      descriptors.findIndex(
        (descriptor) =>
          descriptor.date.year === viewDate.year && descriptor.date.month === viewDate.month,
      ),
      0,
    );
    const target = descriptors[index]?.offset ?? 0;

    if (Math.abs(continuousScrollElement.scrollTop - target) > 1) {
      continuousScrollElement.scrollTop = target;
      setContinuousScrollTop(target);
    }
  }, [continuousScrollElement, descriptors, viewDate, visibleRange]);

  React.useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
      continuousMonthObserversRef.current.forEach((observer) => observer.disconnect());
    },
    [],
  );

  const moveView = React.useCallback(
    (direction: -1 | 1) => {
      if (isWheelOpen) return;
      const next =
        visibleRange === "week" ? addDays(viewDate, direction * 7) : addMonths(viewDate, direction);
      const clamped = clampDateToMonthRange(next, monthRange);
      setViewDate(clamped);
      setFocusedDate(clamped);
    },
    [isWheelOpen, monthRange, setViewDate, viewDate, visibleRange],
  );

  const headerLabel =
    visibleRange === "twoMonths"
      ? `${formatMonth(viewDate)} – ${formatMonth(addMonths(viewDate, 1))}`
      : formatMonth(viewDate);
  const previousLabel =
    visibleRange === "week" ? ariaLabels.previousWeek : ariaLabels.previousMonth;
  const nextLabel = visibleRange === "week" ? ariaLabels.nextWeek : ariaLabels.nextMonth;
  const monthRangeStartDate = { ...monthRange.start, day: 1 };
  const monthRangeEndStartDate = { ...monthRange.end, day: 1 };
  const monthRangeEndDate = {
    ...monthRange.end,
    day: getDaysInMonth(monthRangeEndStartDate),
  };
  const canMovePrevious =
    visibleRange === "week"
      ? compareDates(viewDate, monthRangeStartDate) > 0
      : compareYearMonths(viewDate, monthRange.start) > 0;
  const canMoveNext =
    visibleRange === "week"
      ? compareDates(addDays(viewDate, 6), monthRangeEndDate) < 0
      : compareYearMonths(viewDate, monthRange.end) < 0;

  const yearOptions = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      timeZone: "UTC",
    });
    return Array.from({ length: yearRange.end - yearRange.start + 1 }, (_, index) => {
      const year = yearRange.start + index;
      const date = { year, month: 1, day: 1 };
      return {
        value: String(year),
        label: formatter.format(toCalendarDate(date).toDate("UTC")),
      };
    });
  }, [locale, yearRange.end, yearRange.start]);
  const monthOptions = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      month: "long",
      timeZone: "UTC",
    });
    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const date = { year: 2024, month, day: 1 };
      return {
        value: String(month),
        label: formatter.format(toCalendarDate(date).toDate("UTC")),
      };
    });
  }, [locale]);

  const changeWheelYear = React.useCallback((yearValue: string) => {
    setWheelViewDate((current) => getDateForMonthAndDay(Number(yearValue), current.month, 1));
  }, []);
  const changeWheelMonth = React.useCallback((monthValue: string) => {
    setWheelViewDate((current) => getDateForMonthAndDay(current.year, Number(monthValue), 1));
  }, []);
  const toggleWheel = React.useCallback(() => {
    if (isWheelOpen) {
      setIsWheelOpen(false);
      setViewDate(wheelViewDate);
      return;
    }

    setWheelViewDate(viewDate);
    setIsWheelOpen(true);
  }, [isWheelOpen, setViewDate, viewDate, wheelViewDate]);

  return {
    selectionMode,
    visibleRange,
    value,
    viewDate,
    focusedDate,
    today,
    locale,
    isRtl,
    disabled,
    readOnly,
    weekdayLabels,
    months:
      visibleRange === "continuous"
        ? continuousMonths
        : weekMonth === undefined
          ? standardMonths
          : [weekMonth],
    headerLabel,
    isWheelOpen,
    ariaLabels,
    actions,
    wheel: {
      yearOptions,
      monthOptions,
      yearValue: String(wheelViewDate.year),
      monthValue: String(wheelViewDate.month),
      onYearValueChange: changeWheelYear,
      onMonthValueChange: changeWheelMonth,
    },
    virtual: {
      totalHeight,
      topHeight: virtualTopHeight,
      bottomHeight: virtualBottomHeight,
    },
    refs: {
      root: (element: HTMLDivElement | null) => {
        rootRef.current = element;
      },
      continuousScroll: setContinuousScrollElement,
      continuousMonth: getContinuousMonthRef,
    },
    rootProps: elementProps({
      id: rootId,
      role: "group",
      dir: isRtl ? "rtl" : "ltr",
      "data-disabled": dataAttr(disabled),
      "data-readonly": dataAttr(readOnly),
      "data-selection-mode": selectionMode,
      "data-visible-range": visibleRange,
    }),
    gridProps: elementProps({
      role: "grid",
      "aria-multiselectable": selectionMode === "single" ? undefined : ariaAttr(true),
      "aria-disabled": ariaAttr(disabled),
      "aria-readonly": ariaAttr(readOnly),
    }),
    previousButtonProps: {
      type: "button" as const,
      "aria-label": previousLabel,
      disabled: disabled || isWheelOpen || !canMovePrevious,
      onClick: () => moveView(-1),
    },
    nextButtonProps: {
      type: "button" as const,
      "aria-label": nextLabel,
      disabled: disabled || isWheelOpen || !canMoveNext,
      onClick: () => moveView(1),
    },
    monthYearButtonProps: {
      type: "button" as const,
      "aria-expanded": isWheelOpen,
      "aria-controls": `${rootId}-wheel`,
      disabled,
      onClick: toggleWheel,
    },
    wheelProps: elementProps({
      id: `${rootId}-wheel`,
    }),
    continuousScrollProps: {
      onScroll: handleContinuousScroll,
      onWheel: handleContinuousUserScroll,
      onPointerDown: handleContinuousUserScroll,
      onTouchStart: handleContinuousUserScroll,
    },
    liveRegionProps: elementProps({
      "aria-live": "polite",
      "aria-atomic": true,
    }),
  };
}
