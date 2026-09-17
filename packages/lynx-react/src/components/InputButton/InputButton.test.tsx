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

import { InputButton } from "./index";
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

describe("InputButton", () => {
  it("renders slots with size and invalid state classes", () => {
    render(
      <InputButton.Root size="medium" invalid className="custom-input-button">
        <InputButton.Button accessibility-label="지역 선택" />
        <InputButton.PrefixText>지역</InputButton.PrefixText>
        <InputButton.Value>판교동</InputButton.Value>
        <InputButton.SuffixText>선택됨</InputButton.SuffixText>
      </InputButton.Root>,
    );

    const root = getRenderedRoot();
    const queries = getQueriesForElement(root);
    const inputButtonRoot = root.querySelector(".seed-input-button__root");
    const button = root.querySelector(".seed-input-button__button");

    expect(inputButtonRoot).toHaveClass("custom-input-button");
    expect(inputButtonRoot).toHaveClass("seed-input-button__root--size_medium");
    expect(button).toHaveAttribute("accessibility-label", "지역 선택");
    expect(button).toHaveAttribute("accessibility-traits", "button");
    expect(root.querySelector(".seed-input-button__stroke")).toHaveClass(
      "seed-input-button__stroke--invalid_true",
    );
    expect(queries.getByText("판교동")).toHaveClass("seed-input-button__value");
    expect(queries.getByText("지역")).toHaveClass("seed-input-button__prefixText");
    expect(queries.getByText("선택됨")).toHaveClass("seed-input-button__suffixText");
  });

  it("tracks pressed state and blocks taps when disabled", () => {
    const onTap = vi.fn();
    const { rerender } = render(
      <InputButton.Root>
        <InputButton.Button accessibility-label="지역 선택" bindtap={onTap} />
        <InputButton.Placeholder>지역을 선택하세요</InputButton.Placeholder>
      </InputButton.Root>,
    );

    let button = getRenderedRoot().querySelector(".seed-input-button__button") as HTMLElement;

    fireEvent.touchstart(button, {});
    expect(button).toHaveClass("seed-input-button__button--pressed_true");

    fireEvent.tap(button);
    expect(onTap).toHaveBeenCalledTimes(1);

    rerender(
      <InputButton.Root disabled>
        <InputButton.Button accessibility-label="지역 선택" bindtap={onTap} />
        <InputButton.Placeholder>지역을 선택하세요</InputButton.Placeholder>
      </InputButton.Root>,
    );

    button = getRenderedRoot().querySelector(".seed-input-button__button") as HTMLElement;
    fireEvent.tap(button);

    expect(onTap).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("accessibility-traits", "disabled");
    expect(getQueriesForElement(getRenderedRoot()).getByText("지역을 선택하세요")).toHaveClass(
      "seed-input-button__placeholder--disabled_true",
    );
  });

  it("groups fragment content while leaving the button and strokes outside the scale target", () => {
    render(
      <InputButton.Root>
        <React.Fragment key="fragment-slots">
          <InputButton.Button accessibility-label="Select" />
          <InputButton.PrefixText>Prefix</InputButton.PrefixText>
          <InputButton.Value>Value</InputButton.Value>
          <InputButton.SuffixText>Suffix</InputButton.SuffixText>
        </React.Fragment>
      </InputButton.Root>,
    );

    const root = getRenderedRoot();
    const content = root.querySelector(".seed-input-button__content");
    const button = root.querySelector(".seed-input-button__button");
    expect(content).toHaveAttribute("flatten", "false");
    expect(content?.contains(button)).toBe(false);
    expect(button?.querySelector(".seed-input-button__baseStroke")).toBeTruthy();
    expect(button?.querySelector(".seed-input-button__stroke")).toBeTruthy();
    expect(Array.from(content?.children ?? []).map((child) => child.textContent)).toEqual([
      "Prefix",
      "Value",
      "Suffix",
    ]);
  });

  it("preserves custom wrapped Button composition without moving or dropping children", () => {
    const CustomButton = () => <InputButton.Button accessibility-label="Custom" />;
    render(
      <InputButton.Root>
        <CustomButton />
        <InputButton.Value>Value</InputButton.Value>
      </InputButton.Root>,
    );

    const root = getRenderedRoot();
    expect(root.querySelector(".seed-input-button__button")).toHaveAttribute(
      "accessibility-label",
      "Custom",
    );
    expect(root.querySelector(".seed-input-button__content")).toBeNull();
  });

  it("keeps the clear action independent and hides it in readonly mode", () => {
    const onOpen = vi.fn();
    const onClear = vi.fn();
    const { rerender } = render(
      <InputButton.Root>
        <InputButton.Button accessibility-label="Select" bindtap={onOpen} />
        <InputButton.Value>Value</InputButton.Value>
        <InputButton.ClearButton
          icon={<MockIcon />}
          accessibility-label="Clear"
          bindtap={onClear}
        />
      </InputButton.Root>,
    );
    const root = getRenderedRoot();
    const clear = root.querySelector(".seed-input-button__clearButton") as HTMLElement;
    expect(clear).toHaveAttribute("flatten", "false");
    fireEvent.tap(clear);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();
    expect(root.querySelector(".seed-input-button__button")).not.toHaveClass(
      "seed-input-button__button--pressed_true",
    );

    rerender(
      <InputButton.Root readOnly>
        <InputButton.Button accessibility-label="Select" bindtap={onOpen} />
        <InputButton.ClearButton
          icon={<MockIcon />}
          accessibility-label="Clear"
          bindtap={onClear}
        />
      </InputButton.Root>,
    );
    expect(getRenderedRoot().querySelector(".seed-input-button__clearButton")).toBeNull();
  });

  it("bridges Main Thread presses while preserving the consumer Main Thread handler", async () => {
    function Example({ report }: { report: () => void }) {
      function handleTouch() {
        "main thread";
        runOnBackground(report)();
      }
      return (
        <InputButton.Root>
          <InputButton.Button
            accessibility-label="Select"
            main-thread:bindtouchstart={handleTouch}
          />
          <InputButton.Value>Value</InputButton.Value>
        </InputButton.Root>
      );
    }
    const report = vi.fn();
    const { container } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const button = container.querySelector(".seed-input-button__button");
    if (!button) throw new Error("Expected button");
    fireEvent.touchstart(button, {});
    await waitSchedule();
    expect(report).toHaveBeenCalledTimes(1);
    expect(button.className).toContain("pressed_true");
    fireEvent.touchcancel(button, {});
    await waitSchedule();
    expect(button.className).not.toContain("pressed_true");
  });

  it("throws when a slot is rendered outside InputButton.Root", () => {
    expect(() => render(<InputButton.Value>값</InputButton.Value>)).toThrow(/InputButton\.Value/);
  });
});
