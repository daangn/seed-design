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
  it("prefixes indicator text, hides the required mark and splits the character count", () => {
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

    expect(getByText("필수").textContent).toBe("\u00a0필수");
    expect(getByText("*")).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(getByText("*").textContent).toBe("\u200a*");
    expect(root.querySelector(".seed-field__characterCount")).toHaveTextContent("3");
    expect(root.querySelector(".seed-field__maxCharacterCount")).toHaveTextContent("/10");
  });

  it("reads invalid from Root and marks an empty character count", () => {
    render(
      <Field.Root invalid>
        <Field.Footer>
          <Field.ErrorMessage>오류</Field.ErrorMessage>
          <Field.CharacterCount current={0} max={10} />
        </Field.Footer>
      </Field.Root>,
    );

    const root = getRenderedRoot();
    const current = root.querySelector(".seed-field__characterCount");
    const max = root.querySelector(".seed-field__maxCharacterCount");

    expect(current).toHaveClass("seed-field__characterCount--invalid_true");
    expect(current).toHaveClass("seed-field__characterCount--empty_true");
    expect(max).toHaveClass("seed-field__maxCharacterCount--invalid_true");
  });

  it("throws when a compound slot is rendered outside Field.Root", () => {
    expect(() => render(<Field.Footer />)).toThrow();
  });

  it("tags the root and the label with their Rootage components", () => {
    render(
      <Field.Root>
        <Field.Label>제목</Field.Label>
        <Field.Label weight="bold">강조</Field.Label>
      </Field.Root>,
    );

    const { getByText } = getRenderedQueries();

    expect(getRenderedRoot().querySelector(".seed-field__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:Field",
    );
    expect(getByText("제목")).toHaveAttribute("lynx-test-tag", "seed:FieldLabel;weight=medium");
    expect(getByText("강조")).toHaveAttribute("lynx-test-tag", "seed:FieldLabel;weight=bold");
  });

  it("lets a consumer lynx-test-tag win on the root", () => {
    render(<Field.Root lynx-test-tag="profile-name" />);

    expect(getRenderedRoot().querySelector(".seed-field__root")).toHaveAttribute(
      "lynx-test-tag",
      "profile-name",
    );
  });
});
