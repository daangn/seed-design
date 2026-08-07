import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { Field } from "./index";

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

describe("Field", () => {
  it("renders the complete field composition with recipe slot classes", () => {
    render(
      <Field.Root className="custom-field" required>
        <Field.Header>
          <Field.Label weight="bold">
            제목
            <Field.RequiredIndicator />
            <Field.IndicatorText>필수</Field.IndicatorText>
          </Field.Label>
        </Field.Header>
        <Field.Footer>
          <Field.Description>설명</Field.Description>
          <Field.CharacterCount current={3} max={10} />
        </Field.Footer>
      </Field.Root>,
    );

    const root = getRenderedRoot();
    const { getByText } = getRenderedQueries();
    const fieldRoot = root.querySelector(".seed-field__root");

    expect(fieldRoot).toHaveClass("custom-field");
    expect(root.querySelector(".seed-field__header")).toBeInTheDocument();
    expect(root.querySelector(".seed-field__footer")).toBeInTheDocument();
    expect(getByText("제목")).toHaveClass("seed-field-label__root--weight_bold");
    expect(getByText("필수")).toHaveClass("seed-field-label__indicatorText");
    expect(getByText("필수").textContent).toBe("\u00a0필수");
    expect(getByText("*")).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(getByText("*").textContent).toBe("\u200a*");
    expect(getByText("설명")).toHaveClass("seed-field__description");
    expect(root.querySelector(".seed-field__characterCount")).toHaveTextContent("3");
    expect(root.querySelector(".seed-field__maxCharacterCount")).toHaveTextContent("/10");
  });

  it("applies invalid and empty character count variants", () => {
    render(
      <Field.Root invalid>
        <Field.Footer>
          <Field.ErrorMessage>오류</Field.ErrorMessage>
          <Field.CharacterCount current={0} max={10} />
        </Field.Footer>
      </Field.Root>,
    );

    const { getByText } = getRenderedQueries();

    expect(getByText("오류")).toHaveClass("seed-field__errorMessage");
    const root = getRenderedRoot();
    const current = root.querySelector(".seed-field__characterCount");
    const max = root.querySelector(".seed-field__maxCharacterCount");

    expect(current).toHaveClass("seed-field__characterCount--invalid_true");
    expect(current).toHaveClass("seed-field__characterCount--empty_true");
    expect(max).toHaveClass("seed-field__maxCharacterCount--invalid_true");
  });

  it("throws when a compound slot is rendered outside Field.Root", () => {
    expect(() => render(<Field.Footer />)).toThrow(/ClassNamesProvider/);
  });
});
