"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { ariaAttr, dataAttr, elementProps } from "@seed-design/dom-utils";
import * as React from "react";
import {
  addDays,
  addMonths,
  addYears,
  assertDateInYearRange,
  clampDateToYearRange,
  compareDates,
  CONTINUOUS_MONTH_GAP,
  CONTINUOUS_MONTH_LABEL_HEIGHT,
  CONTINUOUS_WEEKDAY_HEIGHT,
  dateKey,
  DEFAULT_DATE_CELL_HEIGHT,
  getDaysInMonth,
  getLocalToday,
  getMonthWeekStarts,
  getWeekEnd,
  getWeekStart,
  isSameDate,
  normalizeViewDate,
  startOfMonth,
  toCalendarDate,
} from "./date";
import type {
  DatePickerAriaLabels,
  DatePickerActions,
  DatePickerCell,
  DatePickerConstraintContext,
  DatePickerDate,
  DatePickerMonth,
  DatePickerRangeValue,
  DatePickerSelectionMode,
  DatePickerValue,
  DatePickerVisibleRange,
  DatePickerWeek,
  UseDatePickerProps,
} from "./types";

const CONTINUOUS_OVERSCAN_MONTHS = 2;
const RTL_LANGUAGES = new Set(["ar", "fa", "he", "ps", "ur"]);

const DEFAULT_ARIA_LABELS = {
  ko: {
    previousMonth: "이전 달",
    nextMonth: "다음 달",
    previousWeek: "이전 주",
    nextWeek: "다음 주",
    yearWheel: "연도",
    monthWheel: "월",
  },
  en: {
    previousMonth: "Previous month",
    nextMonth: "Next month",
    previousWeek: "Previous week",
    nextWeek: "Next week",
    yearWheel: "Year",
    monthWheel: "Month",
  },
} satisfies Record<string, DatePickerAriaLabels>;

interface MonthDescriptor {
  date: DatePickerDate;
  key: string;
  offset: number;
  height: number;
  weekCount: number;
}

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

function validateValue(
  mode: DatePickerSelectionMode,
  value: DatePickerValue,
  yearRange: { start: number; end: number },
  propName: "value" | "defaultValue",
) {
  if (value === undefined) return;

  if (mode === "single") {
    assertDateInYearRange(value as DatePickerDate, yearRange, propName);
    return;
  }

  if (mode === "range") {
    const range = value as DatePickerRangeValue;
    assertDateInYearRange(range.start, yearRange, `${propName}.start`);
    if (range.end !== undefined) {
      assertDateInYearRange(range.end, yearRange, `${propName}.end`);
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

function getMonthDescriptors(
  yearRange: { start: number; end: number },
  locale: string,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined,
  measuredHeights: ReadonlyMap<string, number>,
) {
  const result: MonthDescriptor[] = [];
  let offset = 0;

  for (let year = yearRange.start; year <= yearRange.end; year++) {
    for (let month = 1; month <= 12; month++) {
      const date = { year, month, day: 1 };
      const key = dateKey(date);
      const weekCount = getMonthWeekStarts(date, locale, weekStartsOn).length;
      const height =
        measuredHeights.get(key) ??
        CONTINUOUS_MONTH_LABEL_HEIGHT + weekCount * DEFAULT_DATE_CELL_HEIGHT + CONTINUOUS_MONTH_GAP;
      result.push({ date, key, offset, height, weekCount });
      offset += height;
    }
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

export type UseDatePickerReturn = ReturnType<typeof useDatePicker>;

export function useDatePicker(props: UseDatePickerProps) {
  const selectionMode = getSelectionMode(props);
  const visibleRange: DatePickerVisibleRange = props.visibleRange ?? "month";
  const locale = getCanonicalLocale(props.locale);
  const today = props.today ?? getLocalToday();
  const yearRange = props.yearRange ?? { start: today.year - 100, end: today.year + 100 };

  validateYearRange(yearRange);
  assertDateInYearRange(today, yearRange, "today");
  validateValue(selectionMode, props.value, yearRange, "value");
  validateValue(selectionMode, props.defaultValue, yearRange, "defaultValue");
  if (props.viewDate !== undefined) {
    assertDateInYearRange(props.viewDate, yearRange, "viewDate");
  }
  if (props.defaultViewDate !== undefined) {
    assertDateInYearRange(props.defaultViewDate, yearRange, "defaultViewDate");
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
  const initialViewSource = props.viewDate ?? props.defaultViewDate ?? initialSelectedDate ?? today;
  const normalizedViewProp =
    props.viewDate === undefined
      ? undefined
      : normalizeViewDate(props.viewDate, visibleRange, locale, props.weekStartsOn);
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
  const rootId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const shouldMoveDomFocusRef = React.useRef(false);
  const constraints = props.constraints ?? [];
  const defaultAriaLabels = getDefaultAriaLabels(locale);
  const ariaLabels = { ...defaultAriaLabels, ...props.ariaLabels };
  const disabled = props.disabled ?? false;
  const readOnly = props.readOnly ?? false;
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
      const action =
        multipleValue?.some((selectedDate) => isSameDate(selectedDate, candidate)) === true
          ? "deselect"
          : "select";
      return {
        selectionMode,
        value,
        rangeStart:
          selectionMode === "range"
            ? (value as DatePickerRangeValue | undefined)?.start
            : undefined,
        action,
      };
    },
    [selectionMode, value],
  );

  const isUnavailable = React.useCallback(
    (date: DatePickerDate) => {
      if (date.year < yearRange.start || date.year > yearRange.end) return true;
      const context = getConstraintContext(date);
      return constraints.some((constraint) => !constraint(date, context));
    },
    [constraints, getConstraintContext, yearRange.end, yearRange.start],
  );

  const setViewDate = React.useCallback(
    (date: DatePickerDate) => {
      const normalized = normalizeViewDate(date, visibleRange, locale, props.weekStartsOn);
      if (!isSameDate(normalized, viewDate)) setViewDateState(normalized);
    },
    [locale, props.weekStartsOn, setViewDateState, viewDate, visibleRange],
  );

  const navigateToDate = React.useCallback(
    (date: DatePickerDate) => {
      assertDateInYearRange(date, yearRange, "actions.navigateToDate(date)");
      shouldMoveDomFocusRef.current = false;
      setFocusedDate(date);
      setViewDate(date);
    },
    [setViewDate, yearRange],
  );

  const focusDate = React.useCallback(
    (date: DatePickerDate) => {
      assertDateInYearRange(date, yearRange, "actions.focusDate(date)");
      shouldMoveDomFocusRef.current = true;
      setFocusedDate(date);
      setViewDate(date);
    },
    [setViewDate, yearRange],
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
      if (range === undefined || range.end !== undefined) {
        setValue({ start: date });
      } else if (compareDates(date, range.start) < 0) {
        setValue({ start: date });
      } else {
        setValue({ start: range.start, end: date });
      }
    },
    [disabled, isUnavailable, readOnly, selectionMode, setValue, value],
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
      const clamped = clampDateToYearRange(nextDate, yearRange);
      shouldMoveDomFocusRef.current = true;
      setFocusedDate(clamped);

      if (visibleRange === "continuous") {
        setViewDate(startOfMonth(clamped));
        return;
      }

      if (visibleRange === "week") {
        const start = viewDate;
        const end = addDays(start, 6);
        if (compareDates(clamped, start) < 0 || compareDates(clamped, end) > 0) {
          setViewDate(clamped);
        }
        return;
      }

      const visibleStart = startOfMonth(viewDate);
      const visibleEndMonth =
        visibleRange === "twoMonths" ? addMonths(visibleStart, 1) : visibleStart;
      const visibleEnd = {
        ...visibleEndMonth,
        day: getDaysInMonth(visibleEndMonth),
      };
      if (compareDates(clamped, visibleStart) < 0 || compareDates(clamped, visibleEnd) > 0) {
        setViewDate(clamped);
      }
    },
    [setViewDate, viewDate, visibleRange, yearRange],
  );

  React.useEffect(() => {
    if (visibleRange === "continuous") return;

    const visibleStart = visibleRange === "week" ? viewDate : startOfMonth(viewDate);
    const visibleEnd =
      visibleRange === "week"
        ? addDays(visibleStart, 6)
        : (() => {
            const endMonth =
              visibleRange === "twoMonths" ? addMonths(visibleStart, 1) : visibleStart;
            return { ...endMonth, day: getDaysInMonth(endMonth) };
          })();

    if (compareDates(focusedDate, visibleStart) < 0 || compareDates(focusedDate, visibleEnd) > 0) {
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
      const stateProps = {
        "data-today": dataAttr(todayState),
        "data-selected": dataAttr(selectionState.isSelected),
        "data-range-start": dataAttr(selectionState.isRangeStart),
        "data-range-end": dataAttr(selectionState.isRangeEnd),
        "data-in-range": dataAttr(selectionState.isInRange),
        "data-range-complete": dataAttr(isRangeComplete),
        "data-unavailable": dataAttr(unavailable),
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
          "aria-label": formatFullDate(date),
          "aria-current": todayState ? "date" : undefined,
          "aria-disabled": ariaAttr(unavailable || disabled),
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
      locale,
      moveFocus,
      props.weekStartsOn,
      readOnly,
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
  const { descriptors, totalHeight } = React.useMemo(
    () => getMonthDescriptors(yearRange, locale, props.weekStartsOn, continuousMonthHeights),
    [continuousMonthHeights, locale, props.weekStartsOn, yearRange.end, yearRange.start],
  );
  const [continuousScrollElement, setContinuousScrollElement] =
    React.useState<HTMLDivElement | null>(null);
  const [continuousScrollTop, setContinuousScrollTop] = React.useState(0);
  const [continuousViewportHeight, setContinuousViewportHeight] = React.useState(0);
  const scrollFrameRef = React.useRef<number | null>(null);
  const scrollDrivenViewRef = React.useRef(false);
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
        const index = findMonthIndexAtOffset(descriptors, nextScrollTop);
        const nextViewDate = descriptors[index]?.date;
        if (nextViewDate && !isSameDate(nextViewDate, viewDate)) {
          scrollDrivenViewRef.current = true;
          setViewDateState(nextViewDate);
        }
      });
    },
    [descriptors, setViewDateState, viewDate],
  );

  useLayoutEffect(() => {
    if (!continuousScrollElement || visibleRange !== "continuous") return;
    if (scrollDrivenViewRef.current) {
      scrollDrivenViewRef.current = false;
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
      const next =
        visibleRange === "week" ? addDays(viewDate, direction * 7) : addMonths(viewDate, direction);
      const clamped = clampDateToYearRange(next, yearRange);
      setViewDate(clamped);
      setFocusedDate(clamped);
    },
    [setViewDate, viewDate, visibleRange, yearRange],
  );

  const headerLabel =
    visibleRange === "twoMonths"
      ? `${formatMonth(viewDate)} – ${formatMonth(addMonths(viewDate, 1))}`
      : formatMonth(viewDate);
  const previousLabel =
    visibleRange === "week" ? ariaLabels.previousWeek : ariaLabels.previousMonth;
  const nextLabel = visibleRange === "week" ? ariaLabels.nextWeek : ariaLabels.nextMonth;
  const canMovePrevious =
    visibleRange === "week"
      ? compareDates(viewDate, { year: yearRange.start, month: 1, day: 1 }) > 0
      : viewDate.year > yearRange.start || viewDate.month > 1;
  const canMoveNext =
    visibleRange === "week"
      ? compareDates(addDays(viewDate, 6), { year: yearRange.end, month: 12, day: 31 }) < 0
      : viewDate.year < yearRange.end || viewDate.month < 12;

  const yearOptions = React.useMemo(
    () =>
      Array.from({ length: yearRange.end - yearRange.start + 1 }, (_, index) => {
        const year = yearRange.start + index;
        const date = { year, month: 1, day: 1 };
        return {
          value: String(year),
          label: new Intl.DateTimeFormat(locale, {
            year: "numeric",
            timeZone: "UTC",
          }).format(toCalendarDate(date).toDate("UTC")),
        };
      }),
    [locale, yearRange.end, yearRange.start],
  );
  const monthOptions = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const date = { year: 2024, month, day: 1 };
        return {
          value: String(month),
          label: new Intl.DateTimeFormat(locale, {
            month: "long",
            timeZone: "UTC",
          }).format(toCalendarDate(date).toDate("UTC")),
        };
      }),
    [locale],
  );

  const changeWheelYear = React.useCallback(
    (yearValue: string) => {
      const target = getDateForMonthAndDay(Number(yearValue), viewDate.month, 1);
      setViewDate(target);
    },
    [setViewDate, viewDate.month],
  );
  const changeWheelMonth = React.useCallback(
    (monthValue: string) => {
      const target = getDateForMonthAndDay(viewDate.year, Number(monthValue), 1);
      setViewDate(target);
    },
    [setViewDate, viewDate.year],
  );

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
      yearValue: String(viewDate.year),
      monthValue: String(viewDate.month),
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
      disabled: disabled || !canMovePrevious,
      onClick: () => moveView(-1),
    },
    nextButtonProps: {
      type: "button" as const,
      "aria-label": nextLabel,
      disabled: disabled || !canMoveNext,
      onClick: () => moveView(1),
    },
    monthYearButtonProps: {
      type: "button" as const,
      "aria-expanded": isWheelOpen,
      "aria-controls": `${rootId}-wheel`,
      disabled,
      onClick: () => setIsWheelOpen((open) => !open),
    },
    wheelProps: elementProps({
      id: `${rootId}-wheel`,
    }),
    continuousScrollProps: {
      onScroll: handleContinuousScroll,
    },
    liveRegionProps: elementProps({
      "aria-live": "polite",
      "aria-atomic": true,
    }),
  };
}
