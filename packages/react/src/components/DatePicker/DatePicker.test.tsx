import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";
import { DatePicker } from "./DatePicker";

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
  });
});
