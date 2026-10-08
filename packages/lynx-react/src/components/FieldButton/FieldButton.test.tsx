import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { runOnBackground } from "@lynx-js/react";
import {
  fireEvent,
  getQueriesForElement,
  render,
  waitSchedule,
} from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { FieldButton } from "./index";
import type { LynxIconElementProps } from "../../types";
import type { MainThread } from "@lynx-js/types";

const MockIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => (
  <image {...props} {...(ref ? { "main-thread:ref": ref as React.Ref<MainThread.Element> } : {})} />
));
MockIcon.displayName = "MockIcon";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("FieldButton", () => {
  it("renders slots with size and invalid state classes", () => {
    render(
      <FieldButton.Root size="medium" invalid className="custom-field-button">
        <FieldButton.Button accessibility-label="지역 선택" />
        <FieldButton.PrefixText>지역</FieldButton.PrefixText>
        <FieldButton.Value>판교동</FieldButton.Value>
        <FieldButton.SuffixText>선택됨</FieldButton.SuffixText>
      </FieldButton.Root>,
    );

    const root = getRenderedRoot();
    const queries = getQueriesForElement(root);
    const fieldButtonRoot = root.querySelector(".seed-field-button__root");
    const button = root.querySelector(".seed-field-button__button");

    expect(fieldButtonRoot).toHaveClass("custom-field-button");
    expect(fieldButtonRoot).toHaveClass("seed-field-button__root--size_medium");
    expect(button).toHaveAttribute("accessibility-label", "지역 선택");
    expect(button).toHaveAttribute("accessibility-traits", "button");
    expect(root.querySelector(".seed-field-button__stroke")).toHaveClass(
      "seed-field-button__stroke--invalid_true",
    );
    expect(queries.getByText("판교동")).toHaveClass("seed-field-button__value");
    expect(queries.getByText("지역")).toHaveClass("seed-field-button__prefixText");
    expect(queries.getByText("선택됨")).toHaveClass("seed-field-button__suffixText");
  });

  it("tracks pressed state and blocks taps when disabled", () => {
    const onTap = vi.fn();
    const { rerender } = render(
      <FieldButton.Root>
        <FieldButton.Button accessibility-label="지역 선택" bindtap={onTap} />
        <FieldButton.Placeholder>지역을 선택하세요</FieldButton.Placeholder>
      </FieldButton.Root>,
    );

    let button = getRenderedRoot().querySelector(".seed-field-button__button") as HTMLElement;

    fireEvent.touchstart(button, {});
    expect(button).toHaveClass("seed-field-button__button--pressed_true");

    fireEvent.tap(button);
    expect(onTap).toHaveBeenCalledTimes(1);

    rerender(
      <FieldButton.Root disabled>
        <FieldButton.Button accessibility-label="지역 선택" bindtap={onTap} />
        <FieldButton.Placeholder>지역을 선택하세요</FieldButton.Placeholder>
      </FieldButton.Root>,
    );

    button = getRenderedRoot().querySelector(".seed-field-button__button") as HTMLElement;
    fireEvent.tap(button);

    expect(onTap).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("accessibility-traits", "disabled");
    expect(getQueriesForElement(getRenderedRoot()).getByText("지역을 선택하세요")).toHaveClass(
      "seed-field-button__placeholder--disabled_true",
    );
  });

  it("groups fragment content while leaving the button and strokes outside the scale target", () => {
    render(
      <FieldButton.Root>
        <React.Fragment key="fragment-slots">
          <FieldButton.Button accessibility-label="Select" />
          <FieldButton.PrefixText>Prefix</FieldButton.PrefixText>
          <FieldButton.Value>Value</FieldButton.Value>
          <FieldButton.SuffixText>Suffix</FieldButton.SuffixText>
        </React.Fragment>
      </FieldButton.Root>,
    );

    const root = getRenderedRoot();
    const content = root.querySelector(".seed-field-button__content");
    const button = root.querySelector(".seed-field-button__button");
    expect(content).toHaveAttribute("flatten", "false");
    expect(content?.contains(button)).toBe(false);
    expect(button?.querySelector(".seed-field-button__baseStroke")).toBeTruthy();
    expect(button?.querySelector(".seed-field-button__stroke")).toBeTruthy();
    expect(Array.from(content?.children ?? []).map((child) => child.textContent)).toEqual([
      "Prefix",
      "Value",
      "Suffix",
    ]);
  });

  it("preserves custom wrapped Button composition without moving or dropping children", () => {
    const CustomButton = () => <FieldButton.Button accessibility-label="Custom" />;
    render(
      <FieldButton.Root>
        <CustomButton />
        <FieldButton.Value>Value</FieldButton.Value>
      </FieldButton.Root>,
    );

    const root = getRenderedRoot();
    expect(root.querySelector(".seed-field-button__button")).toHaveAttribute(
      "accessibility-label",
      "Custom",
    );
    expect(root.querySelector(".seed-field-button__content")).toBeNull();
  });

  it("keeps the clear action independent and hides it in readonly mode", () => {
    const onOpen = vi.fn();
    const onClear = vi.fn();
    const onValuesChange = vi.fn();
    const { rerender } = render(
      <FieldButton.Root values={["Value"]} onValuesChange={onValuesChange}>
        <FieldButton.Button accessibility-label="Select" bindtap={onOpen} />
        <FieldButton.Value>Value</FieldButton.Value>
        <FieldButton.ClearButton
          icon={<MockIcon />}
          accessibility-label="Clear"
          bindtap={onClear}
        />
      </FieldButton.Root>,
    );
    const root = getRenderedRoot();
    const clear = root.querySelector(".seed-field-button__clearButton") as HTMLElement;
    expect(clear).toHaveAttribute("flatten", "false");
    expect(clear).toHaveAttribute("accessibility-traits", "button");
    fireEvent.tap(clear);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onValuesChange).toHaveBeenCalledExactlyOnceWith([]);
    expect(onOpen).not.toHaveBeenCalled();
    expect(root.querySelector(".seed-field-button__button")).not.toHaveClass(
      "seed-field-button__button--pressed_true",
    );

    rerender(
      <FieldButton.Root readOnly>
        <FieldButton.Button accessibility-label="Select" bindtap={onOpen} />
        <FieldButton.ClearButton
          icon={<MockIcon />}
          accessibility-label="Clear"
          bindtap={onClear}
        />
      </FieldButton.Root>,
    );
    expect(getRenderedRoot().querySelector(".seed-field-button__clearButton")).toBeNull();
  });

  it("bridges Main Thread presses while preserving the consumer Main Thread handler", async () => {
    function Example({ report }: { report: () => void }) {
      function handleTouch() {
        "main thread";
        runOnBackground(report)();
      }
      return (
        <FieldButton.Root>
          <FieldButton.Button
            accessibility-label="Select"
            main-thread:bindtouchstart={handleTouch}
          />
          <FieldButton.Value>Value</FieldButton.Value>
        </FieldButton.Root>
      );
    }
    const report = vi.fn();
    const { container } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const button = container.querySelector(".seed-field-button__button");
    if (!button) throw new Error("Expected button");
    fireEvent.touchstart(button, {});
    await waitSchedule();
    expect(report).toHaveBeenCalledTimes(1);
    expect(button.className).toContain("pressed_true");
    fireEvent.touchcancel(button, {});
    await waitSchedule();
    expect(button.className).not.toContain("pressed_true");
  });

  it("throws when a slot is rendered outside FieldButton.Root", () => {
    expect(() => render(<FieldButton.Value>값</FieldButton.Value>)).toThrow();
  });
});
