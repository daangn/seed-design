import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";
import {
  dateOnOrAfter,
  excludeDates,
  maxSelectionCount,
  rangeDayCountAtLeast,
  rangeDayCountAtMost,
} from "./constraints";
import { useDatePicker } from "./useDatePicker";
import type { DatePickerCell, UseDatePickerProps } from "./types";

const today = { year: 2026, month: 7, day: 30 };
const yearRange = { start: 2025, end: 2027 };

function renderDatePicker(props: UseDatePickerProps = {}) {
  return renderHook((currentProps: UseDatePickerProps) => useDatePicker(currentProps), {
    initialProps: {
      today,
      yearRange,
      defaultViewDate: { year: 2026, month: 7, day: 1 },
      ...props,
    } as UseDatePickerProps,
  });
}

function getCell(result: ReturnType<typeof renderDatePicker>["result"], day: number) {
  const cell = result.current.months
    .flatMap((month) => month.weeks)
    .flatMap((week) => week.cells)
    .find((candidate): candidate is DatePickerCell => candidate?.date.day === day);

  if (!cell) throw new Error(`${day}일 셀을 찾지 못했습니다.`);
  return cell;
}

function clickCell(cell: DatePickerCell) {
  cell.buttonProps.onClick?.({ defaultPrevented: false } as React.MouseEvent<HTMLButtonElement>);
}

describe("useDatePicker", () => {
  it("locale의 주 시작일과 월의 실제 주 수를 사용한다", () => {
    const ko = renderDatePicker({ locale: "ko-KR" });
    const en = renderDatePicker({ locale: "en-US" });

    expect(ko.result.current.weekdayLabels[0]?.long).toBe("일요일");
    expect(en.result.current.weekdayLabels[0]?.long).toBe("Sunday");
    expect(ko.result.current.wheel.yearOptions[1]?.label).toBe("2026년");
    expect(en.result.current.wheel.yearOptions[1]?.label).toBe("2026");
    expect(ko.result.current.months[0]?.weeks).toHaveLength(5);
  });

  it("single 모드에서 날짜를 선택한다", () => {
    const onValueChange = mock(() => {});
    const { result } = renderDatePicker({ onValueChange });

    act(() => clickCell(getCell(result, 15)));

    expect(result.current.value).toEqual({ year: 2026, month: 7, day: 15 });
    expect(onValueChange).toHaveBeenCalledWith({ year: 2026, month: 7, day: 15 });
    expect(getCell(result, 15).cellProps["aria-selected"]).toBe("true");
  });

  it("range 모드에서 시작일과 종료일을 순서대로 선택한다", () => {
    const { result } = renderDatePicker({ selectionMode: "range" });

    act(() => clickCell(getCell(result, 10)));
    expect(result.current.value).toEqual({ start: { year: 2026, month: 7, day: 10 } });
    expect(getCell(result, 10).cellProps["data-range-complete"]).toBeUndefined();

    act(() => clickCell(getCell(result, 13)));
    expect(result.current.value).toEqual({
      start: { year: 2026, month: 7, day: 10 },
      end: { year: 2026, month: 7, day: 13 },
    });
    expect(getCell(result, 11).isInRange).toBe(true);
    expect(getCell(result, 10).cellProps["data-range-complete"]).toBe("");
    expect(getCell(result, 13).cellProps["data-range-complete"]).toBe("");
  });

  it("최소 1일 Range는 같은 날짜를 체크인·체크아웃으로 선택할 수 있다", () => {
    const { result } = renderDatePicker({
      selectionMode: "range",
      constraints: [rangeDayCountAtLeast(1)],
    });

    act(() => clickCell(getCell(result, 10)));
    act(() => clickCell(getCell(result, 10)));

    expect(result.current.value).toEqual({
      start: { year: 2026, month: 7, day: 10 },
      end: { year: 2026, month: 7, day: 10 },
    });
  });

  it("multiple 모드에서 값을 날짜순으로 정렬하고 선택 해제를 허용한다", () => {
    const { result } = renderDatePicker({ selectionMode: "multiple" });

    act(() => clickCell(getCell(result, 20)));
    act(() => clickCell(getCell(result, 10)));
    expect(result.current.value).toEqual([
      { year: 2026, month: 7, day: 10 },
      { year: 2026, month: 7, day: 20 },
    ]);

    act(() => clickCell(getCell(result, 20)));
    expect(result.current.value).toEqual([{ year: 2026, month: 7, day: 10 }]);
  });

  it("constraint에 실패한 날짜는 포커스할 수 있지만 선택할 수 없다", () => {
    const onValueChange = mock(() => {});
    const { result } = renderDatePicker({
      constraints: [dateOnOrAfter({ year: 2026, month: 7, day: 10 })],
      onValueChange,
    });
    const unavailable = getCell(result, 9);

    expect(unavailable.buttonProps.disabled).toBe(false);
    expect(unavailable.buttonProps["aria-disabled"]).toBe("true");

    act(() => clickCell(unavailable));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("range helper는 숙박일 수와 제외일을 전체 구간에 적용한다", () => {
    const { result } = renderDatePicker({
      selectionMode: "range",
      defaultValue: { start: { year: 2026, month: 7, day: 10 } },
      constraints: [
        rangeDayCountAtLeast(2),
        rangeDayCountAtMost(5),
        excludeDates((date) => date.day === 12),
      ],
    });

    expect(getCell(result, 10).isUnavailable).toBe(true);
    expect(getCell(result, 11).isUnavailable).toBe(false);
    expect(getCell(result, 12).isUnavailable).toBe(true);
    expect(getCell(result, 13).isUnavailable).toBe(true);
    expect(getCell(result, 15).isUnavailable).toBe(true);
  });

  it("완료된 range 이후에는 이전 시작일의 제약 없이 새 range를 시작한다", () => {
    const { result } = renderDatePicker({
      selectionMode: "range",
      constraints: [rangeDayCountAtMost(5)],
    });

    act(() => clickCell(getCell(result, 10)));
    act(() => clickCell(getCell(result, 13)));

    expect(getCell(result, 15).isUnavailable).toBe(false);
    act(() => clickCell(getCell(result, 15)));
    expect(result.current.value).toEqual({ start: { year: 2026, month: 7, day: 15 } });
  });

  it("maxSelectionCount에 도달해도 기존 날짜는 선택 해제할 수 있다", () => {
    const { result } = renderDatePicker({
      selectionMode: "multiple",
      defaultValue: [{ year: 2026, month: 7, day: 10 }],
      constraints: [maxSelectionCount(1)],
    });

    expect(getCell(result, 11).isUnavailable).toBe(true);
    expect(getCell(result, 10).isUnavailable).toBe(false);

    act(() => clickCell(getCell(result, 10)));
    expect(result.current.value).toEqual([]);
  });

  it("키보드 탐색은 roving tabindex와 현재 표시 범위를 함께 갱신한다", () => {
    const { result } = renderDatePicker({
      defaultViewDate: { year: 2026, month: 7, day: 1 },
    });
    const julyFirst = getCell(result, 1);

    act(() => {
      julyFirst.buttonProps.onFocus?.({} as React.FocusEvent<HTMLButtonElement>);
    });
    expect(getCell(result, 1).buttonProps.tabIndex).toBe(0);

    act(() => {
      getCell(result, 1).buttonProps.onKeyDown?.({
        key: "ArrowLeft",
        shiftKey: false,
        defaultPrevented: false,
        nativeEvent: { isComposing: false },
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLButtonElement>);
    });

    expect(result.current.focusedDate).toEqual({ year: 2026, month: 6, day: 30 });
    expect(result.current.viewDate).toEqual({ year: 2026, month: 6, day: 1 });
  });

  it("Continuous 키보드 탐색은 월 경계를 넘으면 표시 기준 월도 갱신한다", () => {
    const { result } = renderDatePicker({
      visibleRange: "continuous",
      yearRange: { start: 2026, end: 2027 },
      defaultViewDate: { year: 2026, month: 1, day: 1 },
    });
    const januaryLastDay = result.current.months
      .flatMap((month) => month.weeks)
      .flatMap((week) => week.cells)
      .find(
        (cell): cell is DatePickerCell =>
          cell?.date.year === 2026 && cell.date.month === 1 && cell.date.day === 31,
      );
    expect(januaryLastDay).toBeDefined();

    act(() => {
      januaryLastDay?.buttonProps.onKeyDown?.({
        key: "ArrowRight",
        shiftKey: false,
        defaultPrevented: false,
        nativeEvent: { isComposing: false },
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLButtonElement>);
    });

    expect(result.current.focusedDate).toEqual({ year: 2026, month: 2, day: 1 });
    expect(result.current.viewDate).toEqual({ year: 2026, month: 2, day: 1 });
  });

  it("twoMonths는 두 달을 렌더링하지만 이전·다음 버튼은 한 달씩 이동한다", () => {
    const { result } = renderDatePicker({ visibleRange: "twoMonths" });

    expect(result.current.months.map((month) => month.date.month)).toEqual([7, 8]);
    act(() => result.current.nextButtonProps.onClick());
    expect(result.current.viewDate).toEqual({ year: 2026, month: 8, day: 1 });
  });

  it("yearRange 밖으로 이어지는 Week와 Two Months의 날짜는 선택할 수 없다", () => {
    const week = renderDatePicker({
      visibleRange: "week",
      yearRange: { start: 2026, end: 2026 },
      defaultViewDate: { year: 2026, month: 12, day: 31 },
    });
    const nextYearCell = week.result.current.months[0]?.weeks[0]?.cells.find(
      (cell) => cell?.date.year === 2027,
    );

    expect(nextYearCell?.isUnavailable).toBe(true);
    expect(nextYearCell?.buttonProps["aria-disabled"]).toBe("true");

    const twoMonths = renderDatePicker({
      visibleRange: "twoMonths",
      yearRange: { start: 2026, end: 2026 },
      defaultViewDate: { year: 2026, month: 12, day: 1 },
    });
    expect(
      twoMonths.result.current.months[1]?.weeks
        .flatMap((weekRow) => weekRow.cells)
        .filter((cell) => cell !== null)
        .every((cell) => cell.isUnavailable),
    ).toBe(true);
  });

  it("외부에서 viewDate가 바뀌면 표시 범위 안에 roving focus를 복구한다", () => {
    const { result, rerender } = renderDatePicker({
      viewDate: { year: 2026, month: 7, day: 1 },
    });

    rerender({
      today,
      yearRange,
      viewDate: { year: 2026, month: 8, day: 1 },
    });

    expect(result.current.focusedDate).toEqual({ year: 2026, month: 8, day: 1 });
    expect(getCell(result, 1).buttonProps.tabIndex).toBe(0);
  });

  it("navigateToDate는 표시 범위와 roving focus 대상을 함께 갱신한다", () => {
    const { result } = renderDatePicker();

    act(() => {
      result.current.actions.navigateToDate({ year: 2026, month: 8, day: 15 });
    });

    expect(result.current.viewDate).toEqual({ year: 2026, month: 8, day: 1 });
    expect(result.current.focusedDate).toEqual({ year: 2026, month: 8, day: 15 });
    expect(getCell(result, 15).buttonProps.tabIndex).toBe(0);
  });

  it("날짜 이동 action은 yearRange 밖의 날짜를 거부한다", () => {
    const { result } = renderDatePicker();

    expect(() => result.current.actions.navigateToDate({ year: 2028, month: 1, day: 1 })).toThrow(
      "actions.navigateToDate(date).year",
    );
    expect(() => result.current.actions.focusDate({ year: 2024, month: 1, day: 1 })).toThrow(
      "actions.focusDate(date).year",
    );
  });

  it("Continuous는 현재 월의 라벨이 고정 요일 행 아래에 오도록 스크롤한다", () => {
    const { result } = renderDatePicker({
      visibleRange: "continuous",
      yearRange: { start: 2026, end: 2027 },
    });
    const scrollElement = document.createElement("div");
    Object.defineProperty(scrollElement, "clientHeight", { value: 420 });

    act(() => result.current.refs.continuousScroll(scrollElement));

    const currentMonth = result.current.months.find(
      (month) => month.date.year === 2026 && month.date.month === 7,
    );
    expect(currentMonth).toBeDefined();
    expect(scrollElement.scrollTop).toBe(currentMonth?.offset);
  });

  it("Continuous는 렌더링된 월의 실제 콘텐츠 높이로 가상 스크롤 크기를 갱신한다", () => {
    const { result } = renderDatePicker({
      visibleRange: "continuous",
      yearRange: { start: 2026, end: 2027 },
    });
    const measuredMonth = result.current.months[0];
    const element = document.createElement("div");
    element.getBoundingClientRect = () =>
      ({
        width: 358,
        height: 400,
        top: 0,
        right: 358,
        bottom: 400,
        left: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }) satisfies DOMRect;

    act(() => result.current.refs.continuousMonth(measuredMonth?.key ?? "")(element));

    expect(result.current.months.find((month) => month.key === measuredMonth?.key)?.height).toBe(
      400,
    );

    act(() => result.current.refs.continuousMonth(measuredMonth?.key ?? "")(null));
  });

  it("유효하지 않은 날짜와 범위를 엄격하게 거부한다", () => {
    expect(() => renderDatePicker({ value: { year: 2026, month: 2, day: 30 } })).toThrow(
      "유효한 Gregorian 날짜",
    );
    expect(() =>
      renderDatePicker({
        selectionMode: "range",
        value: {
          start: { year: 2026, month: 7, day: 20 },
          end: { year: 2026, month: 7, day: 10 },
        },
      }),
    ).toThrow("start는 end보다 늦을 수 없습니다");
  });
});
