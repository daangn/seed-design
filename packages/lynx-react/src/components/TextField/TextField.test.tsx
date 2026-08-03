import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, it, vi } from "vitest";

import { Field } from "../Field";
import { KeyboardAvoidanceActionsContext } from "../KeyboardAvoidingScrollView/context";
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

  it("renders a native input with root-owned native props", () => {
    const onValueChange = vi.fn();
    render(
      <TextField.Root defaultValue="초기값" name="title" onValueChange={onValueChange}>
        <TextField.Input placeholder="제목" />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveClass("seed-text-input__value");
    expect(input).toHaveAttribute("name", "title");
    expect(input).toHaveAttribute("placeholder", "제목");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("registers focused inputs with KeyboardAvoidingScrollView context", () => {
    const inputRef = createRef<NodesRef>();
    const actions = {
      focus: vi.fn(),
      blur: vi.fn(),
      layoutChanged: vi.fn(),
      unregister: vi.fn(),
    };

    render(
      <KeyboardAvoidanceActionsContext.Provider value={actions}>
        <Field.Root>
          <TextField.Root>
            <TextField.Input ref={inputRef} />
          </TextField.Root>
        </Field.Root>
      </KeyboardAvoidanceActionsContext.Provider>,
    );

    if (!inputRef.current) throw new Error("Expected native input ref to exist.");

    // ReactLynx Testing Library runtime accepts NodesRef, but its public fireEvent type
    // currently exposes only DOM Element inputs.
    fireEvent.focus(inputRef.current as unknown as Element);
    expect(actions.focus).toHaveBeenCalledOnce();
    expect(actions.focus.mock.calls[0]?.[0]).toMatchObject({
      enabled: true,
      nativeRef: { current: inputRef.current },
    });
    expect(getTextFieldRoot()).toHaveClass("seed-text-input__root--focused_true");

    fireEvent.blur(inputRef.current as unknown as Element);
    expect(actions.blur).toHaveBeenCalledOnce();
    expect(getTextFieldRoot()).toHaveClass("seed-text-input__root--focused_false");
  });

  it("inherits native disabled and readonly states from roots", () => {
    render(
      <Field.Root disabled readOnly>
        <TextField.Root>
          <TextField.Input />
        </TextField.Root>
      </Field.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("disabled");
    expect(input).toHaveAttribute("readonly");
  });

  it("renders an invisible sizing mirror for an autoresizing textarea", () => {
    render(
      <TextField.Root defaultValue={"첫 줄\n둘째 줄\n"}>
        <TextField.Textarea placeholder="내용" />
      </TextField.Root>,
    );

    const root = getRenderedRoot();
    const textarea = root.querySelector("textarea");
    const mirror = root.querySelector(".seed-text-input__textareaMirror");

    expect(textarea).toHaveClass("seed-text-input__textareaControl");
    expect(mirror).toHaveClass("seed-text-input__value");
    expect(mirror).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(mirror?.textContent).toBe("첫 줄\n둘째 줄\n\u200b");
  });

  it("renders a textarea without the sizing mirror when autoresize is false", () => {
    render(
      <TextField.Root>
        <TextField.Textarea autoresize={false} />
      </TextField.Root>,
    );

    const root = getRenderedRoot();
    const textarea = root.querySelector("textarea");

    expect(textarea).toHaveClass("seed-text-input__value");
    expect(textarea).not.toHaveClass("seed-text-input__textareaControl");
    expect(root.querySelector(".seed-text-input__textareaMirror")).toBeNull();
  });
});
