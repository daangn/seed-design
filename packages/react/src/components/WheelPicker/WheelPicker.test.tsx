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
      "--seed-wheel-picker-public-item-size": "44px",
      "--seed-wheel-picker-public-visible-item-count": "5",
      "--seed-wheel-picker-public-viewport-size": "220px",
      "--seed-wheel-picker-public-center-offset": "88px",
    });
    expect(getByRole("group")).toHaveClass("seed-wheel-picker-public__root");
    expect(getByRole("group")).not.toHaveClass("seed-wheel-picker__root");
    expect(container.querySelector("[data-wheel-picker-scroll-fog]")).toHaveClass(
      "seed-wheel-picker-public__scrollFog",
    );
    expect(container.querySelector("[data-wheel-picker-columns]")).toHaveClass(
      "seed-wheel-picker-public__columns",
    );
    expect(getByRole("spinbutton")).toHaveClass("seed-wheel-picker-public__column");
    expect(container.querySelector('[data-wheel-picker-value="a"]')).toHaveClass(
      "seed-wheel-picker-public__item",
    );
    expect(container.querySelector("[data-wheel-picker-item-label]")).toHaveClass(
      "seed-wheel-picker-public__itemLabel",
    );
    expect(container.querySelector("[data-wheel-picker-indicator]")).toHaveClass(
      "seed-wheel-picker-public__selectionIndicator",
    );
    expect(container.querySelector("[data-wheel-picker-scroll-fog]")).toHaveStyle({
      "--scroll-fog-size-top": "88px",
      "--scroll-fog-size-bottom": "88px",
    });
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

  it("renderLabel로 기본 ItemLabel을 대체한다", () => {
    const { container, getByText } = render(
      <WheelPicker.Root aria-label="휠 피커" itemSize={56}>
        <WheelPicker.Column
          aria-label="문자"
          options={options}
          renderLabel={(option) => <span data-custom-label="">{option.label}</span>}
        />
      </WheelPicker.Root>,
    );

    expect(getByText("A")).toHaveAttribute("data-custom-label");
    expect(getByText("A").parentElement).toHaveClass("seed-wheel-picker-public__item");
    expect(container.querySelector("[data-wheel-picker-item-label]")).not.toBeInTheDocument();
  });

  it("renderLabel에서 공개 ItemLabel을 재사용한다", () => {
    const { getByText } = render(
      <WheelPicker.Root aria-label="휠 피커">
        <WheelPicker.Column
          aria-label="문자"
          options={options}
          renderLabel={(option) => (
            <WheelPicker.ItemLabel data-reused-label="">{option.label}</WheelPicker.ItemLabel>
          )}
        />
      </WheelPicker.Root>,
    );

    expect(getByText("A")).toHaveClass("seed-wheel-picker-public__itemLabel");
    expect(getByText("A")).toHaveAttribute("data-wheel-picker-item-label");
    expect(getByText("A")).toHaveAttribute("data-reused-label");
  });

  it("Root의 disabled 상태를 Column과 Item에 전파한다", () => {
    const { container, getByRole } = render(
      <WheelPicker.Root aria-label="비활성 휠 피커" disabled>
        <WheelPicker.Column aria-label="문자" options={options} defaultValue="a" />
      </WheelPicker.Root>,
    );

    expect(getByRole("group")).toHaveAttribute("data-disabled");
    expect(getByRole("spinbutton")).toHaveAttribute("data-disabled");
    expect(getByRole("spinbutton")).toHaveAttribute("aria-disabled", "true");
    expect(container.querySelector('[data-wheel-picker-value="a"]')).toHaveAttribute(
      "data-selected",
    );
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
