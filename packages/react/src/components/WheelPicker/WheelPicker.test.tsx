import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, mock, spyOn } from "bun:test";
import type * as React from "react";
import { BottomSheet } from "../BottomSheet";
import { WheelPicker } from "./index";

const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

function fireTouchPointer(type: string, element: HTMLElement, y: number) {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: "touch",
    clientX: 50,
    clientY: y,
  });
  Object.defineProperty(event, "pageX", { value: 50 });
  Object.defineProperty(event, "pageY", { value: y });
  fireEvent(element, event);
}

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
      "--seed-wheel-picker-public-scroll-fog-max-height": "132px",
    });
    expect(getByRole("group")).toHaveClass(
      "seed-wheel-picker-public__root",
      "seed-wheel-picker-public__root--size_medium",
    );
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
    const scrollFog = container.querySelector<HTMLElement>("[data-wheel-picker-scroll-fog]");
    expect(scrollFog?.style.getPropertyValue("--scroll-fog-size-top")).toBe(
      "var(--seed-wheel-picker-public-scroll-fog-size)",
    );
    expect(scrollFog?.style.getPropertyValue("--scroll-fog-size-bottom")).toBe(
      "var(--seed-wheel-picker-public-scroll-fog-size)",
    );
  });

  it("Small 크기의 geometry와 타이포그래피 Variant를 적용한다", () => {
    const { container, getByRole } = render(
      <WheelPicker.Root aria-label="작은 휠 피커" size="small">
        <WheelPicker.Column aria-label="문자" options={options} defaultValue="a" />
      </WheelPicker.Root>,
    );

    expect(getByRole("group")).toHaveStyle({
      "--seed-wheel-picker-public-item-size": "36px",
      "--seed-wheel-picker-public-visible-item-count": "5",
      "--seed-wheel-picker-public-viewport-size": "180px",
      "--seed-wheel-picker-public-center-offset": "72px",
      "--seed-wheel-picker-public-scroll-fog-max-height": "108px",
    });
    expect(getByRole("group")).toHaveClass("seed-wheel-picker-public__root--size_small");
    expect(container.querySelector("[data-wheel-picker-item-label]")).toHaveClass(
      "seed-wheel-picker-public__itemLabel--size_small",
    );
  });

  it("itemSize를 지정하면 Size의 Item 높이와 Scroll Fog 최대 높이만 덮어쓴다", () => {
    const { container, getByRole } = render(
      <WheelPicker.Root
        aria-label="사용자 지정 휠 피커"
        size="small"
        itemSize={56}
        visibleItemCount={7}
      >
        <WheelPicker.Column aria-label="문자" options={options} defaultValue="a" />
      </WheelPicker.Root>,
    );

    expect(getByRole("group")).toHaveStyle({
      "--seed-wheel-picker-public-item-size": "56px",
      "--seed-wheel-picker-public-visible-item-count": "7",
      "--seed-wheel-picker-public-viewport-size": "392px",
      "--seed-wheel-picker-public-center-offset": "168px",
      "--seed-wheel-picker-public-scroll-fog-max-height": "168px",
    });
    expect(container.querySelector("[data-wheel-picker-item-label]")).toHaveClass(
      "seed-wheel-picker-public__itemLabel--size_small",
    );
  });

  it("Item을 9개 표시해도 Scroll Fog 최대 높이는 Item 3개 높이로 유지한다", () => {
    const { getByRole } = render(
      <WheelPicker.Root aria-label="긴 휠 피커" visibleItemCount={9}>
        <WheelPicker.Column aria-label="문자" options={options} defaultValue="a" />
      </WheelPicker.Root>,
    );

    expect(getByRole("group")).toHaveStyle({
      "--seed-wheel-picker-public-viewport-size": "396px",
      "--seed-wheel-picker-public-scroll-fog-max-height": "132px",
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

  it("option의 ariaLabel을 기본 접근성 텍스트로 사용한다", () => {
    const { getByRole } = render(
      <WheelPicker.Root aria-label="배지 선택">
        <WheelPicker.Column
          aria-label="배지"
          options={[{ value: "popular", label: <span>◆ 인기</span>, ariaLabel: "인기" }]}
        />
      </WheelPicker.Root>,
    );

    expect(getByRole("spinbutton", { name: "배지" })).toHaveAttribute("aria-valuetext", "인기");
  });

  it("숫자 label을 기본 접근성 텍스트로 변환한다", () => {
    const { getByRole } = render(
      <WheelPicker.Root aria-label="수량 선택">
        <WheelPicker.Column aria-label="수량" options={[{ value: "one", label: 1 }]} />
      </WheelPicker.Root>,
    );

    expect(getByRole("spinbutton", { name: "수량" })).toHaveAttribute("aria-valuetext", "1");
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

  it("BottomSheet 안에서 컬럼을 스크롤할 때 시트 드래그를 시작하지 않는다", () => {
    const originalSetPointerCapture = HTMLElement.prototype.setPointerCapture;
    HTMLElement.prototype.setPointerCapture = mock(() => {});

    try {
      const { container, getByRole } = render(
        <BottomSheet.Root defaultOpen modal={false} autoFocus={false} skipAnimation>
          <BottomSheet.Content>
            <BottomSheet.Title>값 선택</BottomSheet.Title>
            <BottomSheet.Description>원하는 값을 선택하세요.</BottomSheet.Description>
            <WheelPicker.Root aria-label="휠 피커">
              <WheelPicker.Column aria-label="문자" options={options} defaultValue="b" />
            </WheelPicker.Root>
          </BottomSheet.Content>
        </BottomSheet.Root>,
      );
      const content = container.ownerDocument.querySelector("[data-drawer]") as HTMLElement;
      const column = getByRole("spinbutton");

      content.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
      spyOn(content, "getBoundingClientRect").mockReturnValue({
        x: 0,
        y: 0,
        width: 320,
        height: 400,
        top: 0,
        left: 0,
        right: 320,
        bottom: 400,
        toJSON: () => {},
      });
      Object.defineProperties(column, {
        clientHeight: { value: 220, configurable: true },
        scrollHeight: { value: 440, configurable: true },
      });
      column.scrollTop = 44;

      fireTouchPointer("pointerdown", column, 100);
      fireTouchPointer("pointermove", column, 130);

      expect(content.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
    } finally {
      HTMLElement.prototype.setPointerCapture = originalSetPointerCapture;
    }
  });
});
