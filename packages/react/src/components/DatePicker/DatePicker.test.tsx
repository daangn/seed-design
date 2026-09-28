import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { DatePicker } from "./index";

const commonProps = {
  today: { year: 2026, month: 7, day: 30 },
  yearRange: { start: 2025, end: 2027 },
  defaultViewDate: { year: 2026, month: 7, day: 1 },
} as const;

const leftIcon = <svg data-icon="left" />;
const rightIcon = <svg data-icon="right" />;
const headerIcon = <svg data-icon="down" />;

describe("DatePicker compound components", () => {
  it("package compound가 달력 DOM과 wheel adapter contract를 소유한다", () => {
    let wheelRenderProps: DatePicker.WheelRenderProps | undefined;
    const { getByRole, queryByRole } = render(
      <DatePicker.Root {...commonProps} visibleRange="month">
        <DatePicker.Header leftIcon={leftIcon} rightIcon={rightIcon} headerIcon={headerIcon} />
        <DatePicker.Calendar leftIcon={leftIcon} rightIcon={rightIcon} />
        <DatePicker.Wheel>
          {(props) => {
            wheelRenderProps = props;
            return <div data-wheel-adapter="" />;
          }}
        </DatePicker.Wheel>
      </DatePicker.Root>,
    );

    expect(getByRole("grid")).toHaveAccessibleName("2026년 7월");
    expect(
      getByRole("button", { name: "이전 달" }).querySelector('[data-icon="left"]'),
    ).not.toBeNull();

    fireEvent.click(getByRole("button", { name: "2026년 7월" }));

    expect(queryByRole("grid")).not.toBeInTheDocument();
    expect(document.querySelector("[data-wheel-adapter]")).toBeInTheDocument();
    expect(wheelRenderProps?.columns.map((column) => column.id)).toEqual(["year", "month"]);
    expect(wheelRenderProps?.rootProps).toMatchObject({
      itemSize: 44,
      visibleItemCount: 7,
      scrollFogSize: 102,
    });
  });

  it("RTL에서는 semantic navigation에 맞춰 좌우 아이콘을 바꾼다", () => {
    const { getByRole } = render(
      <DatePicker.Root {...commonProps} locale="ar" visibleRange="month">
        <DatePicker.Header leftIcon={leftIcon} rightIcon={rightIcon} headerIcon={headerIcon} />
        <DatePicker.Calendar leftIcon={leftIcon} rightIcon={rightIcon} />
      </DatePicker.Root>,
    );

    expect(
      getByRole("button", { name: "Previous month" }).querySelector('[data-icon="right"]'),
    ).not.toBeNull();
  });
});
