import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "bun:test";
import { QuantityPicker } from "./index";

afterEach(() => {
  document.body.replaceChildren();
});

describe("QuantityPicker", () => {
  it("값 표시 슬롯 양옆에 divider DOM을 배치하고 action icon slot을 연결한다", () => {
    const { getByLabelText, getByText, container } = render(
      <QuantityPicker.Root min={0} max={5} aria-label="수량">
        <QuantityPicker.DecrementButton aria-label="줄이기" icon={<svg />} />
        <QuantityPicker.ValueDisplay />
        <QuantityPicker.IncrementButton aria-label="늘리기" icon={<svg />} />
        <QuantityPicker.HiddenInput name="quantity" />
      </QuantityPicker.Root>,
    );

    const valueDisplay = getByText("1").closest(".seed-quantity-picker__valueDisplay");
    if (!valueDisplay) throw new Error("값 표시를 찾을 수 없습니다.");
    const decrementButton = getByLabelText("줄이기");
    const incrementButton = getByLabelText("늘리기");

    expect(valueDisplay).toHaveClass("seed-quantity-picker__valueDisplay");
    expect(valueDisplay.previousElementSibling).toHaveClass("seed-quantity-picker__divider");
    expect(valueDisplay.nextElementSibling).toHaveClass("seed-quantity-picker__divider");
    expect(valueDisplay.previousElementSibling?.previousElementSibling).toBe(decrementButton);
    expect(valueDisplay.nextElementSibling?.nextElementSibling).toBe(incrementButton);
    expect(getByLabelText("줄이기").firstElementChild).toHaveClass(
      "seed-quantity-picker__decrementIcon",
    );
    expect(getByLabelText("늘리기").firstElementChild).toHaveClass(
      "seed-quantity-picker__incrementIcon",
    );
    expect(container.querySelectorAll(".seed-quantity-picker__divider")).toHaveLength(2);
  });

  it("직접 인접한 action과 값 표시 사이에만 divider를 삽입한다", () => {
    const { container } = render(
      <QuantityPicker.Root min={0} max={5} aria-label="수량">
        <QuantityPicker.DecrementButton aria-label="줄이기" icon={<svg />} />
        <QuantityPicker.ValueDisplay />
        <QuantityPicker.HiddenInput name="quantity" />
      </QuantityPicker.Root>,
    );

    expect(container.querySelectorAll(".seed-quantity-picker__divider")).toHaveLength(1);
  });

  it("최대값의 자릿수만큼 0으로 채운 숨김 요소로 값 표시 너비를 확보한다", () => {
    const { container } = render(
      <QuantityPicker.Root min={0} max={123} aria-label="수량">
        <QuantityPicker.DecrementButton aria-label="줄이기" icon={<svg />} />
        <QuantityPicker.ValueDisplay />
        <QuantityPicker.IncrementButton aria-label="늘리기" icon={<svg />} />
      </QuantityPicker.Root>,
    );

    const placeholder = container.querySelector(".seed-quantity-picker__valueDisplayPlaceholder");

    expect(placeholder).toHaveAttribute("aria-hidden", "true");
    expect(placeholder).toHaveTextContent("000");
  });

  it("범위 끝에서는 해당 action icon에도 disabled state를 전달한다", () => {
    const { getByLabelText } = render(
      <QuantityPicker.Root min={0} max={1} value={1} aria-label="수량">
        <QuantityPicker.DecrementButton aria-label="줄이기" icon={<svg />} />
        <QuantityPicker.ValueDisplay />
        <QuantityPicker.IncrementButton aria-label="늘리기" icon={<svg />} />
      </QuantityPicker.Root>,
    );

    expect(getByLabelText("늘리기").firstElementChild).toHaveAttribute("data-disabled");
  });
});
