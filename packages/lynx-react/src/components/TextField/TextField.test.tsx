import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { Field } from "../Field";
import { TextField } from "./index";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getTextFieldRoot() {
  const root = getRenderedRoot();
  const textFieldRoot = root.classList.contains("seed-text-input__root")
    ? root
    : root.querySelector<HTMLElement>(".seed-text-input__root");

  if (!textFieldRoot) {
    throw new Error("Expected TextField root to exist.");
  }

  return textFieldRoot;
}

describe("TextField", () => {
  it("renders root and text adornment slots with default classes", () => {
    render(
      <TextField.Root className="custom-text-field">
        <TextField.PrefixText>₩</TextField.PrefixText>
        <TextField.SuffixText>원</TextField.SuffixText>
      </TextField.Root>,
    );

    const root = getTextFieldRoot();
    const { getByText } = getRenderedQueries();

    expect(root).toHaveClass("custom-text-field");
    expect(root).toHaveClass("seed-text-input__root--variant_outline");
    expect(root).toHaveClass("seed-text-input__root--size_large");
    expect(getByText("₩")).toHaveClass("seed-text-input__prefixText");
    expect(getByText("원")).toHaveClass("seed-text-input__suffixText");
  });

  it("applies explicit visual and state variants", () => {
    render(
      <TextField.Root variant="underline" size="medium" invalid disabled>
        <TextField.PrefixText>앞</TextField.PrefixText>
        <TextField.SuffixText>뒤</TextField.SuffixText>
      </TextField.Root>,
    );

    const root = getTextFieldRoot();
    const { getByText } = getRenderedQueries();

    expect(root).toHaveClass("seed-text-input__root--variant_underline");
    expect(root).toHaveClass("seed-text-input__root--size_medium");
    expect(root).toHaveClass("seed-text-input__root--invalid_true");
    expect(getByText("앞")).toHaveClass("seed-text-input__prefixText--disabled_true");
    expect(getByText("뒤")).toHaveClass("seed-text-input__suffixText--disabled_true");
  });

  it("inherits field states when TextField.Root does not override them", () => {
    render(
      <Field.Root invalid disabled readOnly required>
        <TextField.Root>
          <TextField.PrefixText>상태</TextField.PrefixText>
        </TextField.Root>
      </Field.Root>,
    );

    const root = getTextFieldRoot();
    const { getByText } = getRenderedQueries();

    expect(root).toHaveClass("seed-text-input__root--invalid_true");
    expect(root).toHaveClass("seed-text-input__root--readOnly_true");
    expect(root).toHaveClass("seed-text-input__root--disabled_true");
    expect(getByText("상태")).toHaveClass("seed-text-input__prefixText--disabled_true");
  });

  it("throws when an adornment is rendered outside TextField.Root", () => {
    expect(() => render(<TextField.PrefixText>앞</TextField.PrefixText>)).toThrow(
      /ClassNamesProvider/,
    );
  });
});
