import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";
import { useTimePicker, type UseTimePickerProps } from "./useTimePicker";

function renderTimePicker(props: UseTimePickerProps = {}) {
  return renderHook((currentProps: UseTimePickerProps) => useTimePicker(currentProps), {
    initialProps: props,
  });
}

describe("useTimePicker", () => {
  it("값이 없으면 00:00을 사용한다", () => {
    const { result } = renderTimePicker();

    expect(result.current.value).toEqual({ hour: 0, minute: 0 });
    expect(result.current.columns.period.value).toBe("am");
    expect(result.current.columns.hour.value).toBe("12");
    expect(result.current.columns.minute.value).toBe("0");
  });

  it("defaultValue를 가장 가까운 minuteStep으로 반올림한다", () => {
    const { result: roundedUp } = renderTimePicker({
      defaultValue: { hour: 10, minute: 13 },
      minuteStep: 5,
    });
    const { result: wrapped } = renderTimePicker({
      defaultValue: { hour: 23, minute: 59 },
      minuteStep: 5,
    });

    expect(roundedUp.current.value).toEqual({ hour: 10, minute: 15 });
    expect(wrapped.current.value).toEqual({ hour: 0, minute: 0 });
  });

  it("controlled minute도 가장 가까운 minuteStep으로 반올림한다", () => {
    const { result } = renderTimePicker({
      value: { hour: 9, minute: 13 },
      minuteStep: 5,
    });

    expect(result.current.value).toEqual({ hour: 9, minute: 15 });
    expect(result.current.columns.minute.value).toBe("15");
    expect(result.current.columns.minute.options.some((option) => option.value === "13")).toBe(
      false,
    );
  });

  it("uncontrolled 상태에서 minuteStep이 변경되면 값을 다시 반올림한다", () => {
    const { result, rerender } = renderTimePicker({
      defaultValue: { hour: 10, minute: 15 },
      minuteStep: 5,
    });

    rerender({
      defaultValue: { hour: 10, minute: 15 },
      minuteStep: 30,
    });

    expect(result.current.value).toEqual({ hour: 10, minute: 30 });
    expect(result.current.columns.minute.value).toBe("30");
  });

  it("Period와 Hour 변경은 정규화된 minute 값을 보존한다", () => {
    const onValueChange = mock(() => {});
    const { result } = renderTimePicker({
      value: { hour: 10, minute: 13 },
      minuteStep: 10,
      onValueChange,
    });

    act(() => result.current.columns.hour.onValueChange("11"));
    expect(onValueChange).toHaveBeenLastCalledWith({ hour: 11, minute: 10 });

    act(() => result.current.columns.period.onValueChange("pm"));
    expect(onValueChange).toHaveBeenLastCalledWith({ hour: 22, minute: 10 });

    act(() => result.current.columns.minute.onValueChange("20"));
    expect(onValueChange).toHaveBeenLastCalledWith({ hour: 10, minute: 20 });
  });

  it("0시, 12시, 23시를 12시간제 값으로 변환한다", () => {
    const midnight = renderTimePicker({ value: { hour: 0, minute: 0 } });
    const noon = renderTimePicker({ value: { hour: 12, minute: 0 } });
    const lateNight = renderTimePicker({ value: { hour: 23, minute: 0 } });

    expect(midnight.result.current.columns.period.value).toBe("am");
    expect(midnight.result.current.columns.hour.value).toBe("12");
    expect(noon.result.current.columns.period.value).toBe("pm");
    expect(noon.result.current.columns.hour.value).toBe("12");
    expect(lateNight.result.current.columns.period.value).toBe("pm");
    expect(lateNight.result.current.columns.hour.value).toBe("11");
  });

  it("locale에 따라 option label과 column 순서를 구성한다", () => {
    const ko = renderTimePicker({ locale: "ko-KR" });
    const en = renderTimePicker({ locale: "en-US" });

    expect(ko.result.current.columns.period.options.map((option) => option.label)).toEqual([
      "오전",
      "오후",
    ]);
    expect(ko.result.current.columnOrder).toEqual(["period", "hour", "minute"]);
    expect(en.result.current.columns.period.options.map((option) => option.label)).toEqual([
      "AM",
      "PM",
    ]);
    expect(en.result.current.columnOrder).toEqual(["hour", "minute", "period"]);
  });

  it("disabled에서는 변경하지 않는다", () => {
    const onValueChange = mock(() => {});
    const disabled = renderTimePicker({
      defaultValue: { hour: 10, minute: 0 },
      onValueChange,
      disabled: true,
    });

    act(() => disabled.result.current.columns.hour.onValueChange("11"));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("범위를 벗어나거나 정수가 아닌 값이면 error를 throw한다", () => {
    expect(() => renderTimePicker({ value: { hour: 24, minute: 0 } })).toThrow(
      "value.hour는 0 이상 23 이하의 정수여야 합니다.",
    );
    expect(() => renderTimePicker({ defaultValue: { hour: 10, minute: -1 } })).toThrow(
      "defaultValue.minute은 0 이상 59 이하의 정수여야 합니다.",
    );
    expect(() => renderTimePicker({ value: { hour: 10.5, minute: 0 } })).toThrow(
      "value.hour는 0 이상 23 이하의 정수여야 합니다.",
    );
  });

  it("유효하지 않은 minuteStep이면 error를 throw한다", () => {
    expect(() =>
      renderTimePicker({
        minuteStep: 3 as UseTimePickerProps["minuteStep"],
      }),
    ).toThrow("minuteStep은 1, 5, 10, 15, 30 중 하나여야 합니다.");
  });
});
