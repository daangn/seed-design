import { act, fireEvent, render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, jest, mock } from "bun:test";
import { TimePicker } from "./TimePicker";

describe("TimePicker", () => {
  const originalScrollTo = HTMLElement.prototype.scrollTo;
  const originalMatchMedia = window.matchMedia;
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;

  beforeAll(() => {
    HTMLElement.prototype.scrollTo = function scrollTo(options) {
      if (typeof options === "object" && options.top !== undefined) {
        this.scrollTop = options.top;
      }
    };
    window.matchMedia = mock(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));
    window.requestAnimationFrame = (callback) => {
      callback(0);
      return 1;
    };
    window.cancelAnimationFrame = () => {};
  });

  afterAll(() => {
    HTMLElement.prototype.scrollTo = originalScrollTo;
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it("기본 접근성 이름과 12시간제 컬럼을 제공한다", () => {
    const { getByRole, getAllByRole } = render(
      <TimePicker defaultValue={{ hour: 10, minute: 5 }} />,
    );

    expect(getByRole("group")).toHaveAccessibleName("시간 선택");
    const columns = getAllByRole("spinbutton");
    expect(columns.map((column) => column.getAttribute("aria-label"))).toEqual([
      "오전/오후",
      "시",
      "분",
    ]);
    expect(columns.map((column) => column.getAttribute("aria-valuetext"))).toEqual([
      "오전",
      "10",
      "05",
    ]);
  });

  it("locale에 따라 컬럼 순서를 변경한다", () => {
    const { getAllByRole, getByRole } = render(<TimePicker locale="en-US" />);

    expect(getByRole("group")).toHaveAccessibleName("Select time");
    expect(getAllByRole("spinbutton").map((column) => column.getAttribute("aria-label"))).toEqual([
      "Hour",
      "Minute",
      "AM/PM",
    ]);
  });

  it("일본어 locale에 맞는 기본 접근성 이름을 제공한다", () => {
    const { getAllByRole, getByRole } = render(<TimePicker locale="ja-JP" />);

    expect(getByRole("group")).toHaveAccessibleName("時刻を選択");
    expect(getAllByRole("spinbutton").map((column) => column.getAttribute("aria-label"))).toEqual([
      "午前/午後",
      "時",
      "分",
    ]);
  });

  it("기본 접근성 이름을 명시적인 값으로 재정의한다", () => {
    const { getAllByRole, getByRole } = render(
      <TimePicker
        locale="en-US"
        aria-label="Appointment time"
        periodAriaLabel="Period"
        hourAriaLabel="Hours"
        minuteAriaLabel="Minutes"
      />,
    );

    expect(getByRole("group")).toHaveAccessibleName("Appointment time");
    expect(getAllByRole("spinbutton").map((column) => column.getAttribute("aria-label"))).toEqual([
      "Hours",
      "Minutes",
      "Period",
    ]);
  });

  it("controlled minute도 가장 가까운 minuteStep으로 반올림한다", () => {
    const { getAllByRole } = render(<TimePicker value={{ hour: 9, minute: 13 }} minuteStep={5} />);
    const minuteColumn = getAllByRole("spinbutton")[2];

    expect(minuteColumn).toHaveAttribute("aria-valuetext", "15");
    expect(minuteColumn.querySelector('[data-wheel-picker-value="13"]')).toBeNull();
  });

  it("Wheel 정착 후 TimePickerValue를 전달한다", () => {
    jest.useFakeTimers();
    const onValueChange = mock(() => {});
    const { getAllByRole } = render(
      <TimePicker value={{ hour: 10, minute: 13 }} minuteStep={10} onValueChange={onValueChange} />,
    );
    const hourColumn = getAllByRole("spinbutton")[1];

    fireEvent.keyDown(hourColumn, { key: "ArrowDown" });
    act(() => jest.advanceTimersByTime(120));

    expect(onValueChange).toHaveBeenCalledWith({ hour: 11, minute: 10 });
    jest.useRealTimers();
  });

  it("Hour가 12시 경계를 지나면 Period를 부드럽게 전환한다", () => {
    jest.useFakeTimers();
    const previousScrollTo = HTMLElement.prototype.scrollTo;
    const smoothScrolls: Array<{ element: HTMLElement; top: number }> = [];
    HTMLElement.prototype.scrollTo = function scrollTo(options) {
      if (typeof options !== "object" || options.top === undefined) return;

      this.scrollTop = options.top;
      if (options.behavior === "smooth") {
        smoothScrolls.push({ element: this, top: options.top });
      }
    };
    const { getAllByRole } = render(<TimePicker defaultValue={{ hour: 11, minute: 0 }} />);
    const [periodColumn, hourColumn] = getAllByRole("spinbutton");

    fireEvent.keyDown(hourColumn, { key: "ArrowDown" });
    act(() => jest.advanceTimersByTime(120));

    expect(periodColumn).toHaveAttribute("aria-valuetext", "오후");
    expect(smoothScrolls).toContainEqual({ element: periodColumn, top: 44 });

    HTMLElement.prototype.scrollTo = previousScrollTo;
    jest.useRealTimers();
  });

  it("disabled는 컬럼을 tab 순서에서 제외한다", () => {
    const { getAllByRole } = render(<TimePicker disabled />);

    for (const column of getAllByRole("spinbutton")) {
      expect(column).toHaveAttribute("aria-disabled", "true");
      expect(column).toHaveAttribute("tabindex", "-1");
    }
  });
});
