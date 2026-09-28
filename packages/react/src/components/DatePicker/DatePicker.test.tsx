import { act, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

// Popover는 layer 등록과 focus 이동·복귀를 다음 tick 이후에 처리합니다.
const settle = () =>
  act(async () => {
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, 50);
    await promise;
  });

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

  it("week는 달력을 유지한 채 제목에 붙은 popover에 small wheel을 열고, 닫으면 고른 연도를 반영한다", async () => {
    const user = userEvent.setup();
    let wheelRenderProps: DatePicker.WheelRenderProps | undefined;
    const { getByRole } = render(
      <DatePicker.Root {...commonProps} visibleRange="week">
        <DatePicker.Header leftIcon={leftIcon} rightIcon={rightIcon} headerIcon={headerIcon} />
        <DatePicker.Wheel>
          {(props) => {
            wheelRenderProps = props;
            return <button type="button" data-wheel-adapter="" />;
          }}
        </DatePicker.Wheel>
        <DatePicker.Calendar leftIcon={leftIcon} rightIcon={rightIcon} />
      </DatePicker.Root>,
    );
    const label = getByRole("button", { expanded: false });
    await settle();

    await user.click(label);
    await settle();

    expect(getByRole("grid")).toBeInTheDocument();
    expect(wheelRenderProps?.rootProps.size).toBe("small");
    const dialog = getByRole("dialog");
    expect(dialog).toHaveAccessibleName(label.textContent ?? "");
    expect(dialog).toContainElement(document.querySelector("[data-wheel-adapter]"));
    expect(dialog).toHaveFocus();

    act(() => wheelRenderProps?.columns[0]?.onValueChange("2027"));
    await user.keyboard("{Escape}");
    await settle();

    expect(document.querySelector("[data-wheel-adapter]")).not.toBeInTheDocument();
    expect(label).toHaveTextContent("2027년");
    expect(label).toHaveFocus();

    await user.click(label);
    await settle();
    expect(label).toHaveAttribute("aria-expanded", "true");
    await user.click(document.body);
    await settle();
    expect(label).toHaveAttribute("aria-expanded", "false");
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
