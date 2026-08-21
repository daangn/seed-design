import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import type * as React from "react";
import { WheelPicker } from "./index";

const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

describe("WheelPicker", () => {
  it("공개 기본 geometry와 중립 스타일을 적용한다", () => {
    const { container, getByRole } = render(
      <WheelPicker.Root aria-label="휠 피커">
        <WheelPicker.Column aria-label="문자" options={options} defaultValue="a" />
      </WheelPicker.Root>,
    );

    expect(getByRole("group")).toHaveStyle({
      "--seed-wheel-picker-item-size": "44px",
      "--seed-wheel-picker-visible-item-count": "5",
      "--seed-wheel-picker-viewport-size": "220px",
      "--seed-wheel-picker-center-offset": "88px",
    });
    expect(getByRole("group")).toHaveClass("seed-wheel-picker__root--appearance_neutral");
    expect(getByRole("spinbutton")).toHaveClass("seed-wheel-picker__column--appearance_neutral");
    expect(container.querySelector("[data-wheel-picker-indicator]")).toHaveClass(
      "seed-wheel-picker__selectionIndicator--appearance_neutral",
    );
  });

  it("Root와 Column의 className을 허용한다", () => {
    const { getByRole } = render(
      <WheelPicker.Root aria-label="휠 피커" className="custom-root">
        <WheelPicker.Column aria-label="문자" options={options} className="custom-column" />
      </WheelPicker.Root>,
    );

    expect(getByRole("group")).toHaveClass("custom-root");
    expect(getByRole("spinbutton")).toHaveClass("custom-column");
  });

  it("지원하지 않는 readOnly 값이 런타임에 전달되어도 읽기 전용으로 동작하지 않는다", () => {
    const RootWithLegacyReadOnly = WheelPicker.Root as React.ComponentType<
      WheelPicker.RootProps & { readOnly?: boolean }
    >;
    const { getByRole } = render(
      <RootWithLegacyReadOnly aria-label="휠 피커" readOnly>
        <WheelPicker.Column aria-label="문자" options={options} defaultValue="a" />
      </RootWithLegacyReadOnly>,
    );

    expect(getByRole("group")).not.toHaveAttribute("data-readonly");
    expect(getByRole("spinbutton")).not.toHaveAttribute("aria-readonly");
  });
});
