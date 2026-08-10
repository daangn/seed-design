import { CalendarDate, endOfWeek, startOfWeek } from "@internationalized/date";
import type { DatePickerDate, DatePickerVisibleRange } from "./types";

export const DEFAULT_DATE_CELL_HEIGHT = 48;
export const CONTINUOUS_WEEKDAY_HEIGHT = 48;
export const CONTINUOUS_MONTH_LABEL_HEIGHT = 48;
export const CONTINUOUS_MONTH_GAP = 16;

export function toCalendarDate(date: DatePickerDate) {
  return new CalendarDate(date.year, date.month, date.day);
}

export function fromCalendarDate(date: CalendarDate): DatePickerDate {
  return { year: date.year, month: date.month, day: date.day };
}

export function compareDates(a: DatePickerDate, b: DatePickerDate) {
  return toCalendarDate(a).compare(toCalendarDate(b));
}

export function isSameDate(a: DatePickerDate | undefined, b: DatePickerDate | undefined) {
  return a !== undefined && b !== undefined && compareDates(a, b) === 0;
}

export function dateKey(date: DatePickerDate) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

export function addDays(date: DatePickerDate, days: number) {
  return fromCalendarDate(toCalendarDate(date).add({ days }));
}

export function addMonths(date: DatePickerDate, months: number) {
  return fromCalendarDate(toCalendarDate(date).add({ months }));
}

export function addYears(date: DatePickerDate, years: number) {
  return fromCalendarDate(toCalendarDate(date).add({ years }));
}

export function startOfMonth(date: DatePickerDate): DatePickerDate {
  return { year: date.year, month: date.month, day: 1 };
}

export function getDaysInMonth(date: DatePickerDate) {
  const calendarDate = toCalendarDate(date);
  return calendarDate.calendar.getDaysInMonth(calendarDate);
}

export function getWeekStart(
  date: DatePickerDate,
  locale: string,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
) {
  const calendarDate = toCalendarDate(date);
  if (weekStartsOn === undefined) {
    return fromCalendarDate(startOfWeek(calendarDate, locale));
  }

  const day = calendarDate.toDate("UTC").getUTCDay();
  const distance = (day - weekStartsOn + 7) % 7;
  return addDays(date, -distance);
}

export function getWeekEnd(
  date: DatePickerDate,
  locale: string,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
) {
  if (weekStartsOn === undefined) {
    return fromCalendarDate(endOfWeek(toCalendarDate(date), locale));
  }
  return addDays(getWeekStart(date, locale, weekStartsOn), 6);
}

export function getMonthWeekStarts(
  month: DatePickerDate,
  locale: string,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
) {
  const first = startOfMonth(month);
  const last = { ...first, day: getDaysInMonth(first) };
  const firstWeek = getWeekStart(first, locale, weekStartsOn);
  const lastWeek = getWeekStart(last, locale, weekStartsOn);
  const result: DatePickerDate[] = [];

  for (let cursor = firstWeek; compareDates(cursor, lastWeek) <= 0; cursor = addDays(cursor, 7)) {
    result.push(cursor);
  }
  return result;
}

export function resolveWeekStartsOn(locale: string, weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
  if (weekStartsOn !== undefined) return weekStartsOn;

  const knownSunday = { year: 2000, month: 1, day: 2 };
  const localeWeekStart = getWeekStart(knownSunday, locale);
  return toCalendarDate(localeWeekStart).toDate("UTC").getUTCDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export function getMonthWeekCount(month: DatePickerDate, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
  const first = startOfMonth(month);
  const firstDay = toCalendarDate(first).toDate("UTC").getUTCDay();
  const leadingDays = (firstDay - weekStartsOn + 7) % 7;
  return Math.ceil((leadingDays + getDaysInMonth(first)) / 7);
}

export function normalizeViewDate(
  date: DatePickerDate,
  visibleRange: DatePickerVisibleRange,
  locale: string,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
) {
  return visibleRange === "week" ? getWeekStart(date, locale, weekStartsOn) : startOfMonth(date);
}

export function getLocalToday(): DatePickerDate {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export function assertValidDate(date: DatePickerDate, propName: string) {
  if (
    !Number.isInteger(date.year) ||
    !Number.isInteger(date.month) ||
    !Number.isInteger(date.day)
  ) {
    throw new RangeError(`DatePicker: ${propName}은 정수 year, month, day를 가져야 합니다.`);
  }

  let calendarDate: CalendarDate;
  try {
    calendarDate = toCalendarDate(date);
  } catch {
    throw new RangeError(`DatePicker: ${propName}은 유효한 Gregorian 날짜여야 합니다.`);
  }

  if (
    calendarDate.year !== date.year ||
    calendarDate.month !== date.month ||
    calendarDate.day !== date.day
  ) {
    throw new RangeError(`DatePicker: ${propName}은 유효한 Gregorian 날짜여야 합니다.`);
  }
}

export function assertDateInYearRange(
  date: DatePickerDate,
  yearRange: { start: number; end: number },
  propName: string,
) {
  assertValidDate(date, propName);
  if (date.year < yearRange.start || date.year > yearRange.end) {
    throw new RangeError(
      `DatePicker: ${propName}.year는 ${yearRange.start} 이상 ${yearRange.end} 이하여야 합니다.`,
    );
  }
}

export function eachDateInclusive(start: DatePickerDate, end: DatePickerDate) {
  const result: DatePickerDate[] = [];
  for (let cursor = start; compareDates(cursor, end) <= 0; cursor = addDays(cursor, 1)) {
    result.push(cursor);
  }
  return result;
}

export function inclusiveDayCount(start: DatePickerDate, end: DatePickerDate) {
  const startDate = toCalendarDate(start);
  const endDate = toCalendarDate(end);
  const difference =
    endDate.calendar.toJulianDay(endDate) - startDate.calendar.toJulianDay(startDate);
  return Math.max(difference + 1, 0);
}

export function clampDateToYearRange(
  date: DatePickerDate,
  yearRange: { start: number; end: number },
) {
  if (date.year < yearRange.start) return { year: yearRange.start, month: 1, day: 1 };
  if (date.year > yearRange.end) return { year: yearRange.end, month: 12, day: 31 };
  return date;
}
