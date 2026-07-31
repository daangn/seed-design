import { compareDates, eachDateInclusive, inclusiveDayCount, isSameDate } from "./date";
import type { DatePickerConstraint, DatePickerDate, DatePickerMultipleProps } from "./types";

/** 양끝 날짜를 포함하여 `minDate` 이후 날짜만 선택할 수 있게 합니다. */
export function dateOnOrAfter(minDate: DatePickerDate): DatePickerConstraint {
  return (candidate) => compareDates(candidate, minDate) >= 0;
}

/** 양끝 날짜를 포함하여 `maxDate` 이전 날짜만 선택할 수 있게 합니다. */
export function dateOnOrBefore(maxDate: DatePickerDate): DatePickerConstraint {
  return (candidate) => compareDates(candidate, maxDate) <= 0;
}

/**
 * predicate가 `true`인 날짜를 제외합니다.
 *
 * Range의 기본 scope인 `"range"`는 시작일부터 후보 종료일까지 전체 구간을 검사합니다.
 * `"selection"`은 사용자가 직접 선택한 시작일과 종료일만 검사합니다.
 */
export function excludeDates(
  predicate: (date: DatePickerDate) => boolean,
  options: { scope?: "selection" | "range" } = {},
): DatePickerConstraint {
  const { scope = "range" } = options;

  return (candidate, context) => {
    if (predicate(candidate)) return false;
    if (
      scope !== "range" ||
      context.selectionMode !== "range" ||
      context.rangeStart === undefined ||
      compareDates(candidate, context.rangeStart) < 0
    ) {
      return true;
    }

    return !eachDateInclusive(context.rangeStart, candidate).some(predicate);
  };
}

/** 시작일과 종료일을 포함한 Range의 최소 날짜 수를 제한합니다. */
export function rangeDayCountAtLeast(count: number): DatePickerConstraint {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("DatePicker: rangeDayCountAtLeast의 count는 1 이상의 정수여야 합니다.");
  }

  return (candidate, context) => {
    if (
      context.selectionMode !== "range" ||
      context.rangeStart === undefined ||
      compareDates(candidate, context.rangeStart) < 0
    ) {
      return true;
    }
    return inclusiveDayCount(context.rangeStart, candidate) >= count;
  };
}

/** 시작일과 종료일을 포함한 Range의 최대 날짜 수를 제한합니다. */
export function rangeDayCountAtMost(count: number): DatePickerConstraint {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("DatePicker: rangeDayCountAtMost의 count는 1 이상의 정수여야 합니다.");
  }

  return (candidate, context) => {
    if (
      context.selectionMode !== "range" ||
      context.rangeStart === undefined ||
      compareDates(candidate, context.rangeStart) < 0
    ) {
      return true;
    }
    return inclusiveDayCount(context.rangeStart, candidate) <= count;
  };
}

/** Multiple에서 선택할 수 있는 최대 날짜 수를 제한합니다. 기존 날짜의 선택 해제는 허용합니다. */
export function maxSelectionCount(count: number): DatePickerConstraint {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("DatePicker: maxSelectionCount의 count는 1 이상의 정수여야 합니다.");
  }

  return (candidate, context) => {
    if (context.selectionMode !== "multiple") return true;
    const value = (context.value ?? []) as DatePickerMultipleProps["value"];
    if (context.action === "deselect" || value?.some((date) => isSameDate(date, candidate))) {
      return true;
    }
    return (value?.length ?? 0) < count;
  };
}
