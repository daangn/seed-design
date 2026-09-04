import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { InputButton } from "./index";

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

  it("throws when a slot is rendered outside InputButton.Root", () => {
    expect(() => render(<InputButton.Value>값</InputButton.Value>)).toThrow(/InputButton\.Value/);
  });
});
