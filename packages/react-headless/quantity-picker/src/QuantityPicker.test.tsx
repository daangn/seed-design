import { fireEvent, render, type RenderResult } from "@testing-library/react";
import { afterEach, describe, expect, it, mock } from "bun:test";
import {
  QuantityPickerDecrementButton,
  QuantityPickerHiddenInput,
  QuantityPickerIncrementButton,
  QuantityPickerRoot,
  QuantityPickerValueDisplay,
  type QuantityPickerRootProps,
} from "./QuantityPicker";

afterEach(() => {
  document.body.replaceChildren();
});

function renderQuantityPicker(props: Partial<QuantityPickerRootProps> = {}): RenderResult {
  return render(
    <QuantityPickerRoot min={0} max={5} aria-label="수량" {...props}>
      <QuantityPickerDecrementButton aria-label="줄이기" />
      <QuantityPickerValueDisplay />
      <QuantityPickerIncrementButton aria-label="늘리기" />
      <QuantityPickerHiddenInput name="quantity" />
    </QuantityPickerRoot>,
  );
}

describe("QuantityPicker", () => {
  it("value와 defaultValue가 없으면 min으로 초기화한다", () => {
    const { getByLabelText, getByText } = renderQuantityPicker();

    expect(getByText("0")).toHaveAttribute("aria-live", "polite");
    expect(getByLabelText("수량")).toHaveAttribute("data-min");
  });

  it("min이 1보다 커도 value와 defaultValue 없이 초기화한다", () => {
    const { getByText } = renderQuantityPicker({ min: 2, max: 5 });

    expect(getByText("2")).toBeInTheDocument();
  });

  it("비제어 값은 increment와 decrement로 변경한다", () => {
    const { getByLabelText, getByText } = renderQuantityPicker({ defaultValue: 2 });

    fireEvent.click(getByLabelText("늘리기"));
    expect(getByText("3")).toBeInTheDocument();

    fireEvent.click(getByLabelText("줄이기"));
    expect(getByText("2")).toBeInTheDocument();
  });

  it("제어 값은 onValueChange로 변경을 전달한다", () => {
    const onValueChange = mock(() => {});
    const { getByLabelText, getByText } = renderQuantityPicker({ value: 2, onValueChange });

    fireEvent.click(getByLabelText("늘리기"));

    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(getByText("2")).toBeInTheDocument();
  });

  it("범위 끝에서는 clamp하고 해당 action을 native disabled로 만든다", () => {
    const { getByLabelText, getByText } = renderQuantityPicker({ defaultValue: 5 });

    expect(getByLabelText("늘리기")).toBeDisabled();
    fireEvent.click(getByLabelText("늘리기"));
    expect(getByText("5")).toBeInTheDocument();
  });

  it("step 정렬 여부와 관계없이 현재 값에서 step만큼 이동한다", () => {
    const { getByLabelText, getByText } = renderQuantityPicker({ defaultValue: 3, step: 2 });

    fireEvent.click(getByLabelText("늘리기"));

    expect(getByText("5")).toBeInTheDocument();
  });

  it("removable의 최소값에서는 decrement가 remove로 전환된다", () => {
    const onRemove = mock(() => {});
    const onValueChange = mock(() => {});
    const { getByLabelText, getByText } = renderQuantityPicker({
      defaultValue: 1,
      min: 1,
      onRemove,
      onValueChange,
      removable: true,
      removeAriaLabel: "상품 삭제",
    });

    fireEvent.click(getByLabelText("상품 삭제"));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(getByText("1")).toBeInTheDocument();
  });

  it("loading action은 focus를 유지하면서 실행을 막는다", () => {
    const onValueChange = mock(() => {});
    const { getByLabelText } = renderQuantityPicker({
      defaultValue: 2,
      loading: { increment: true },
      onValueChange,
    });
    const increment = getByLabelText("늘리기");

    increment.focus();
    fireEvent.click(increment);

    expect(increment).not.toBeDisabled();
    expect(increment).toHaveAttribute("aria-busy", "true");
    expect(increment).toHaveAttribute("aria-disabled", "true");
    expect(document.activeElement).toBe(increment);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("readOnly는 action을 막지만 hidden input 값은 제출 가능하게 유지한다", () => {
    const { getByLabelText, getByDisplayValue } = renderQuantityPicker({
      defaultValue: 2,
      readOnly: true,
    });
    const increment = getByLabelText("늘리기");

    fireEvent.click(increment);

    expect(increment).not.toBeDisabled();
    expect(increment).toHaveAttribute("aria-disabled", "true");
    expect(getByDisplayValue("2")).not.toBeDisabled();
    expect(getByDisplayValue("2")).toHaveProperty("readOnly", true);
  });

  it("disabled는 action과 hidden input을 모두 제출에서 제외한다", () => {
    const { getByLabelText, getByDisplayValue } = renderQuantityPicker({ disabled: true });

    expect(getByLabelText("수량")).toHaveAttribute("data-disabled");
    expect(getByLabelText("늘리기")).toBeDisabled();
    expect(getByDisplayValue("0")).toBeDisabled();
  });

  it("HiddenInput은 name과 form으로 raw integer를 제출한다", () => {
    const { getByTestId } = render(
      <>
        <form data-testid="form" id="quantity-form" />
        <QuantityPickerRoot defaultValue={2} min={0} max={5}>
          <QuantityPickerHiddenInput form="quantity-form" name="quantity" />
        </QuantityPickerRoot>
      </>,
    );

    expect(new FormData(getByTestId("form") as HTMLFormElement).get("quantity")).toBe("2");
  });

  it("disabled HiddenInput은 form 제출에서 제외한다", () => {
    const { getByTestId } = render(
      <form data-testid="form">
        <QuantityPickerRoot defaultValue={2} disabled min={0} max={5}>
          <QuantityPickerHiddenInput name="quantity" />
        </QuantityPickerRoot>
      </form>,
    );

    expect(new FormData(getByTestId("form") as HTMLFormElement).has("quantity")).toBe(false);
  });

  it("getValueText는 표시값에만 적용하고 hidden input에는 raw integer를 유지한다", () => {
    const { getByText, getByDisplayValue } = renderQuantityPicker({
      defaultValue: 2,
      getValueText: (value) => `${value}개`,
    });

    expect(getByText("2개")).toBeInTheDocument();
    expect(getByDisplayValue("2")).toHaveAttribute("name", "quantity");
  });

  it("RTL에서는 DOM과 Tab 순서가 increment부터 시작한다", () => {
    const { getByLabelText } = renderQuantityPicker({ dir: "rtl" });
    const root = getByLabelText("수량");

    expect(root.children[0]).toHaveAttribute("aria-label", "늘리기");
    expect(root.children[2]).toHaveAttribute("aria-label", "줄이기");
    expect(root.children[3]).toHaveAttribute("type", "hidden");
  });

  it.each([
    [{ min: 0.5, max: 5 }, "min"],
    [{ min: 0, max: 5.5 }, "max"],
    [{ min: 0, max: 5, step: 0 }, "step"],
    [{ min: 5, max: 0 }, "min must be less than or equal to max"],
    [{ min: 0, max: 5, value: 6 }, "value must be between min and max"],
    [{ min: 0, max: 5, defaultValue: -1 }, "defaultValue must be between min and max"],
  ] as const)("유효하지 않은 숫자와 논리 규칙은 Error를 던진다: %o", (props, message) => {
    expect(() => renderQuantityPicker(props)).toThrow(`QuantityPicker: ${message}`);
  });
});
