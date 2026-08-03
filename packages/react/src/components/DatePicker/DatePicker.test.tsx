import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";
import * as React from "react";
import {
  ContinuousDatePicker,
  DatePicker,
  type DatePickerActions,
  TwoMonthDatePicker,
  WeekDatePicker,
} from "./DatePicker";

const commonProps = {
  today: { year: 2026, month: 7, day: 30 },
  yearRange: { start: 2025, end: 2027 },
  defaultViewDate: { year: 2026, month: 7, day: 1 },
} as const;

describe("DatePicker", () => {
  it("날짜 grid와 locale에 맞는 기본 접근성 이름을 제공한다", () => {
    const { getByRole, getAllByRole, rerender } = render(<DatePicker {...commonProps} />);

    expect(getByRole("group")).toHaveAccessibleName("날짜 선택");
    expect(getByRole("grid")).toHaveAccessibleName("2026년 7월");
    expect(getAllByRole("columnheader")).toHaveLength(7);
    expect(getAllByRole("columnheader")[0]?.closest('[role="grid"]')).toBe(getByRole("grid"));

    rerender(<DatePicker {...commonProps} locale="en-US" />);
    expect(getByRole("group")).toHaveAccessibleName("Select date");

    rerender(<DatePicker {...commonProps} ariaLabels={{ root: "예약 날짜 선택" }} />);
    expect(getByRole("group")).toHaveAccessibleName("예약 날짜 선택");

    rerender(
      <DatePicker
        {...commonProps}
        aria-label="체크인 날짜 선택"
        ariaLabels={{ root: "예약 날짜 선택" }}
      />,
    );
    expect(getByRole("group")).toHaveAccessibleName("체크인 날짜 선택");
  });

  it("날짜를 선택하고 onValueChange를 호출한다", () => {
    const onValueChange = mock(() => {});
    const { getByRole } = render(<DatePicker {...commonProps} onValueChange={onValueChange} />);

    fireEvent.click(getByRole("button", { name: /2026년 7월 15일/ }));

    expect(onValueChange).toHaveBeenCalledWith({ year: 2026, month: 7, day: 15 });
  });

  it("renderDateCellContent는 SEED가 소유한 날짜 버튼 안의 콘텐츠만 교체한다", () => {
    const { getByRole } = render(
      <DatePicker
        {...commonProps}
        renderDateCellContent={({ formattedDay, date }) => (
          <>
            <span>{formattedDay}</span>
            <span>{date.day === 15 ? "12만원" : "예약 가능"}</span>
          </>
        )}
      />,
    );
    const dateButton = getByRole("button", { name: /2026년 7월 15일/ });

    expect(dateButton).toHaveTextContent("15");
    expect(dateButton).toHaveTextContent("12만원");
    expect(dateButton.closest('[role="gridcell"]')).not.toBeNull();
    expect(dateButton.querySelector("[data-date-picker-day]")).toBeNull();
  });

  it("renderDateCellSupplement는 기본 날짜 숫자 아래에 콘텐츠를 추가한다", () => {
    const { getByRole } = render(
      <DatePicker
        {...commonProps}
        renderDateCellSupplement={({ date }) => (
          <span>{date.day === 15 ? "12만원" : "예약 가능"}</span>
        )}
      />,
    );
    const dateButton = getByRole("button", { name: /2026년 7월 15일/ });

    expect(dateButton).toHaveTextContent("15");
    expect(dateButton).toHaveTextContent("12만원");
    expect(dateButton.querySelector("[data-date-picker-day]")).toHaveTextContent("15");
  });

  it("constraint에 실패한 날짜는 aria-disabled를 유지하며 클릭을 무시한다", () => {
    const onValueChange = mock(() => {});
    const { getByRole } = render(
      <DatePicker
        {...commonProps}
        constraints={[(date) => date.day >= 10]}
        onValueChange={onValueChange}
      />,
    );
    const unavailable = getByRole("button", { name: /2026년 7월 9일/ });

    expect(unavailable).toHaveAttribute("aria-disabled", "true");
    expect(unavailable).not.toBeDisabled();
    fireEvent.click(unavailable);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("월·연도 제목을 누르면 Wheel Picker로 전환한다", () => {
    const { getByRole, getAllByRole, queryByRole } = render(<DatePicker {...commonProps} />);

    expect(getByRole("grid")).toBeInTheDocument();
    fireEvent.click(getByRole("button", { name: "2026년 7월" }));

    expect(queryByRole("grid")).not.toBeInTheDocument();
    expect(getAllByRole("spinbutton")).toHaveLength(2);
    expect(getByRole("spinbutton", { name: "연도" })).toBeInTheDocument();
    expect(getByRole("spinbutton", { name: "월" })).toBeInTheDocument();

    const wheelRoot = getByRole("spinbutton", { name: "연도" }).closest('[role="group"]');
    expect(wheelRoot).toBeInstanceOf(HTMLElement);
    if (!(wheelRoot instanceof HTMLElement))
      throw new Error("Wheel Picker 루트를 찾지 못했습니다.");
    expect(wheelRoot.style.getPropertyValue("--seed-wheel-picker-item-size")).toBe("44px");
    expect(wheelRoot.style.getPropertyValue("--seed-wheel-picker-visible-item-count")).toBe("7");
    expect(wheelRoot.style.getPropertyValue("--seed-wheel-picker-viewport-size")).toBe("308px");
  });

  it("레이아웃별 공개 컴포넌트가 고정된 달력 범위를 렌더링한다", () => {
    const twoMonths = render(<TwoMonthDatePicker {...commonProps} />);
    expect(twoMonths.getAllByRole("grid")).toHaveLength(2);
    twoMonths.unmount();

    const week = render(<WeekDatePicker {...commonProps} />);
    expect(week.getByRole("grid").querySelectorAll('[role="row"]')).toHaveLength(2);
    week.unmount();

    const continuous = render(<ContinuousDatePicker {...commonProps} height="400px" />);
    expect(continuous.getByRole("group")).toHaveAttribute("data-visible-range", "continuous");
    const spacers = continuous.container.querySelectorAll<HTMLElement>(
      "[data-date-picker-continuous-spacer]",
    );
    expect(spacers).toHaveLength(2);
    for (const spacer of spacers) {
      expect(spacer.style.getPropertyValue("--seed-date-picker-continuous-spacer-height")).toMatch(
        /px$/,
      );
    }
  });

  it("navigateToDate는 외부 포커스를 유지하고 오늘을 다음 tab 진입점으로 지정한다", () => {
    const actionsRef = React.createRef<DatePickerActions>();
    const { getByRole } = render(
      <>
        <button type="button" onClick={() => actionsRef.current?.navigateToDate(commonProps.today)}>
          오늘로 이동
        </button>
        <DatePicker {...commonProps} actionsRef={actionsRef} />
      </>,
    );
    const todayButton = getByRole("button", { name: "오늘로 이동" });

    expect(actionsRef.current).not.toBeNull();
    todayButton.focus();
    fireEvent.click(todayButton);

    expect(document.activeElement).toBe(todayButton);
    expect(getByRole("button", { name: /2026년 7월 30일/ }).getAttribute("tabindex")).toBe("0");
  });

  it("focusDate는 다른 달로 이동한 뒤 대상 날짜 셀에 DOM 포커스를 둔다", async () => {
    const actionsRef = React.createRef<DatePickerActions>();
    const onViewDateChange = mock(() => {});
    const { getByRole } = render(
      <DatePicker {...commonProps} actionsRef={actionsRef} onViewDateChange={onViewDateChange} />,
    );

    expect(actionsRef.current).not.toBeNull();
    act(() => {
      actionsRef.current?.focusDate({ year: 2026, month: 8, day: 15 });
    });
    expect(onViewDateChange).toHaveBeenCalledWith({ year: 2026, month: 8, day: 1 });

    await waitFor(() => {
      expect(document.activeElement).toBe(getByRole("button", { name: /2026년 8월 15일/ }));
    });
  });

  it("focusDate는 표시 날짜와 roving focus 대상이 이미 같아도 DOM 포커스를 이동한다", async () => {
    const actionsRef = React.createRef<DatePickerActions>();
    const { getByRole } = render(
      <>
        <button type="button" onClick={() => actionsRef.current?.navigateToDate(commonProps.today)}>
          오늘로 이동
        </button>
        <button type="button" onClick={() => actionsRef.current?.focusDate(commonProps.today)}>
          오늘에 포커스
        </button>
        <DatePicker {...commonProps} actionsRef={actionsRef} />
      </>,
    );
    const navigateButton = getByRole("button", { name: "오늘로 이동" });
    const focusButton = getByRole("button", { name: "오늘에 포커스" });

    navigateButton.focus();
    fireEvent.click(navigateButton);
    expect(document.activeElement).toBe(navigateButton);

    focusButton.focus();
    fireEvent.click(focusButton);

    await waitFor(() => {
      expect(document.activeElement).toBe(getByRole("button", { name: /2026년 7월 30일/ }));
    });
  });
});
