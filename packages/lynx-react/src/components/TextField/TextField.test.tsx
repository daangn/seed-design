import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Field } from "../Field";
import { KeyboardAvoidanceActionsContext } from "../KeyboardAvoidingScrollView/context";
import { NATIVE_TEXT_MAX_LENGTH_UNLIMITED } from "./context";
import { TextField } from "./index";

const invokeMainThreadUIMethod = vi.fn(
  (_element: unknown, _method: string, _params: object, callback: (result: object) => void) => {
    callback({ code: 0, data: null });
  },
);

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

function fireNativeEvent(nativeRef: NodesRef, element: Element, eventName: string, detail: object) {
  const EventConstructor = element.ownerDocument.defaultView?.CustomEvent;
  if (!EventConstructor) throw new Error("Expected CustomEvent constructor to exist.");

  const event = new EventConstructor(`bindEvent:${eventName}`, { bubbles: true, detail });
  Object.assign(event, { eventType: "bindEvent", eventName });
  fireEvent(nativeRef as unknown as Element, event);
}

function fireMainThreadLayoutChange(element: Element) {
  const EventConstructor = element.ownerDocument.defaultView?.CustomEvent;
  if (!EventConstructor) throw new Error("Expected CustomEvent constructor to exist.");

  const event = new EventConstructor("bindEvent:layoutchange", { bubbles: true });
  Object.defineProperty(event, "currentTarget", {
    configurable: true,
    enumerable: true,
    value: { elementRefptr: element },
  });
  Object.assign(event, { eventType: "bindEvent", eventName: "layoutchange" });

  const listener = (
    element as Element & {
      eventMap?: Record<string, (event: Event) => void>;
    }
  ).eventMap?.["bindEvent:layoutchange"];
  if (!listener) throw new Error("Expected main-thread layoutchange listener to exist.");

  listener(event);
}

describe("TextField", () => {
  beforeEach(() => {
    invokeMainThreadUIMethod.mockClear();
    lynxTestingEnv.mainThread["__InvokeUIMethod"] = invokeMainThreadUIMethod;
  });

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
    expect(root.querySelector(".seed-text-input__stroke")).toHaveAttribute(
      "accessibility-elements-hidden",
      "true",
    );
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
    const stroke = root.querySelector(".seed-text-input__stroke");

    expect(root).toHaveClass("seed-text-input__root--variant_underline");
    expect(root).toHaveClass("seed-text-input__root--size_medium");
    expect(root).toHaveClass("seed-text-input__root--invalid_true");
    expect(stroke).toHaveClass("seed-text-input__stroke--variant_underline");
    expect(stroke).toHaveClass("seed-text-input__stroke--invalid_true");
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
    const inputRef = createRef<NodesRef>();
    const renderTextField = () => (
      <TextField.Root defaultValue="초기값" name="title" onValueChange={onValueChange}>
        <TextField.Input ref={inputRef} placeholder="제목" />
      </TextField.Root>
    );
    const { rerender } = render(renderTextField());

    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveClass("seed-text-input__value");
    expect(input).toHaveAttribute("name", "title");
    expect(input).toHaveAttribute("placeholder", "제목");

    fireMainThreadLayoutChange(input);
    rerender(renderTextField());

    const rerenderedInput = getRenderedRoot().querySelector("input");
    if (!rerenderedInput) throw new Error("Expected native input to exist after rerender.");
    expect(rerenderedInput).toBe(input);
    fireMainThreadLayoutChange(rerenderedInput);

    expect(invokeMainThreadUIMethod).toHaveBeenCalledTimes(1);
    expect(invokeMainThreadUIMethod).toHaveBeenCalledWith(
      expect.anything(),
      "setValue",
      { value: "초기값" },
      expect.any(Function),
    );

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not call setValue for an empty initial value", () => {
    render(
      <TextField.Root>
        <TextField.Input />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    fireMainThreadLayoutChange(input);
    fireMainThreadLayoutChange(input);

    expect(invokeMainThreadUIMethod).not.toHaveBeenCalled();
  });

  it("does not reapply an accepted native input value on the main thread", () => {
    const inputRef = createRef<NodesRef>();
    render(
      <TextField.Root defaultValue="초기값">
        <TextField.Input ref={inputRef} />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");

    fireMainThreadLayoutChange(input);
    expect(invokeMainThreadUIMethod).toHaveBeenCalledTimes(1);

    const invoke = vi.fn(() => ({ exec: vi.fn() }));
    inputRef.current.invoke = invoke as unknown as NodesRef["invoke"];
    fireNativeEvent(inputRef.current, input, "input", {
      value: "수정값",
      selectionStart: 3,
      selectionEnd: 3,
      isComposing: false,
    });
    fireMainThreadLayoutChange(input);

    expect(invoke).not.toHaveBeenCalled();
    expect(invokeMainThreadUIMethod).toHaveBeenCalledTimes(1);
  });

  it("syncs a controlled value that changes after the initial layout", () => {
    const inputRef = createRef<NodesRef>();
    const renderTextField = (value: string) => (
      <TextField.Root value={value}>
        <TextField.Input ref={inputRef} />
      </TextField.Root>
    );
    const { rerender } = render(renderTextField("초기값"));

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");

    fireMainThreadLayoutChange(input);

    const exec = vi.fn();
    const invoke = vi.fn(() => ({ exec }));
    inputRef.current.invoke = invoke as unknown as NodesRef["invoke"];
    rerender(renderTextField("외부 변경값"));

    expect(invoke).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "setValue",
        params: { value: "외부 변경값" },
      }),
    );
    expect(exec).toHaveBeenCalledTimes(1);
  });

  it("restores a rejected controlled value on the main thread", () => {
    const inputRef = createRef<NodesRef>();
    render(
      <TextField.Root value="고정값">
        <TextField.Input ref={inputRef} />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");

    const exec = vi.fn();
    const invoke = vi.fn(() => ({ exec }));
    inputRef.current.invoke = invoke as unknown as NodesRef["invoke"];
    fireNativeEvent(inputRef.current, input, "input", {
      value: "거부할 값",
      selectionStart: 4,
      selectionEnd: 4,
      isComposing: false,
    });

    expect(invoke).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "setValue",
        params: { value: "고정값" },
      }),
    );
    expect(exec).toHaveBeenCalledTimes(1);
  });

  it("applies the native insertion cap only to collapsed input selections", () => {
    const inputRef = createRef<NodesRef>();
    render(
      <TextField.Root nativeInsertionMaxLength={12}>
        <TextField.Input ref={inputRef} />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("maxlength", "12");

    if (!inputRef.current) throw new Error("Expected native input ref to exist.");

    fireNativeEvent(inputRef.current, input, "selection", { selectionStart: 0, selectionEnd: 2 });
    expect(input).toHaveAttribute("maxlength", String(NATIVE_TEXT_MAX_LENGTH_UNLIMITED));

    fireNativeEvent(inputRef.current, input, "selection", { selectionStart: 2, selectionEnd: 2 });
    expect(input).toHaveAttribute("maxlength", "12");
  });

  it("preserves a stricter explicit input maxlength for selection replacement", () => {
    const inputRef = createRef<NodesRef>();
    render(
      <TextField.Root nativeInsertionMaxLength={12}>
        <TextField.Input ref={inputRef} maxlength={8} />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("maxlength", "8");

    if (!inputRef.current) throw new Error("Expected native input ref to exist.");

    fireNativeEvent(inputRef.current, input, "selection", { selectionStart: 0, selectionEnd: 2 });
    expect(input).toHaveAttribute("maxlength", "8");
  });

  it("relaxes a removed root insertion cap without replacing the native input", () => {
    const renderTextField = (nativeInsertionMaxLength?: number) => (
      <TextField.Root nativeInsertionMaxLength={nativeInsertionMaxLength}>
        <TextField.Input />
      </TextField.Root>
    );
    const { rerender } = render(renderTextField(12));
    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("maxlength", "12");

    rerender(renderTextField());

    const relaxedInput = getRenderedRoot().querySelector("input");
    expect(relaxedInput).toBe(input);
    expect(relaxedInput).toHaveAttribute("maxlength", String(NATIVE_TEXT_MAX_LENGTH_UNLIMITED));
  });

  it("relaxes a removed explicit maxlength without replacing the native input", () => {
    const renderTextField = (maxlength?: number) => (
      <TextField.Root>
        <TextField.Input maxlength={maxlength} />
      </TextField.Root>
    );
    const { rerender } = render(renderTextField(8));
    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("maxlength", "8");

    rerender(renderTextField());

    const relaxedInput = getRenderedRoot().querySelector("input");
    expect(relaxedInput).toBe(input);
    expect(relaxedInput).toHaveAttribute("maxlength", String(NATIVE_TEXT_MAX_LENGTH_UNLIMITED));
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
    expect(getTextFieldRoot().querySelector(".seed-text-input__stroke")).toHaveClass(
      "seed-text-input__stroke--focused_true",
    );

    fireEvent.blur(inputRef.current as unknown as Element);
    expect(actions.blur).toHaveBeenCalledOnce();
    expect(getTextFieldRoot()).toHaveClass("seed-text-input__root--focused_false");
    expect(getTextFieldRoot().querySelector(".seed-text-input__stroke")).toHaveClass(
      "seed-text-input__stroke--focused_false",
    );
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
    const textareaRef = createRef<NodesRef>();
    render(
      <TextField.Root defaultValue={"첫 줄\n둘째 줄\n"}>
        <TextField.Textarea ref={textareaRef} placeholder="내용" />
      </TextField.Root>,
    );

    const root = getRenderedRoot();
    const textarea = root.querySelector("textarea");
    const mirror = root.querySelector(".seed-text-input__textareaMirror");
    if (!textarea) throw new Error("Expected native textarea to exist.");

    expect(textarea).toHaveClass("seed-text-input__textareaControl");
    expect(textarea).toHaveClass("seed-text-input__textareaValue");
    expect(mirror).toHaveClass("seed-text-input__value");
    expect(mirror).toHaveClass("seed-text-input__textareaValue");
    expect(mirror).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(mirror?.textContent).toBe("첫 줄\n둘째 줄\n\u200b");

    fireMainThreadLayoutChange(textarea);
    expect(invokeMainThreadUIMethod).toHaveBeenCalledWith(
      expect.anything(),
      "setValue",
      { value: "첫 줄\n둘째 줄\n" },
      expect.any(Function),
    );
  });

  it("uses the smaller textarea cap and restores explicit maxlength for a selection", () => {
    const textareaRef = createRef<NodesRef>();
    render(
      <TextField.Root nativeInsertionMaxLength={10}>
        <TextField.Textarea ref={textareaRef} maxlength={20} />
      </TextField.Root>,
    );

    const textarea = getRenderedRoot().querySelector("textarea");
    if (!textarea) throw new Error("Expected native textarea to exist.");

    expect(textarea).toHaveAttribute("maxlength", "10");

    if (!textareaRef.current) throw new Error("Expected native textarea ref to exist.");

    fireNativeEvent(textareaRef.current, textarea, "selection", {
      selectionStart: 0,
      selectionEnd: 2,
    });
    expect(textarea).toHaveAttribute("maxlength", "20");

    fireNativeEvent(textareaRef.current, textarea, "selection", {
      selectionStart: 2,
      selectionEnd: 2,
    });
    expect(textarea).toHaveAttribute("maxlength", "10");
  });

  it("disables the textarea insertion cap while native input is composing", () => {
    const textareaRef = createRef<NodesRef>();
    render(
      <TextField.Root value="최대값" nativeInsertionMaxLength={3}>
        <TextField.Textarea ref={textareaRef} />
      </TextField.Root>,
    );

    const textarea = getRenderedRoot().querySelector("textarea");
    if (!textarea) throw new Error("Expected native textarea to exist.");

    expect(textarea).toHaveAttribute("maxlength", "3");

    if (!textareaRef.current) throw new Error("Expected native textarea ref to exist.");

    fireNativeEvent(textareaRef.current, textarea, "input", {
      value: "최대값",
      selectionStart: 3,
      selectionEnd: 3,
      isComposing: true,
    });
    expect(textarea).toHaveAttribute("maxlength", String(NATIVE_TEXT_MAX_LENGTH_UNLIMITED));

    fireNativeEvent(textareaRef.current, textarea, "input", {
      value: "최대값",
      selectionStart: 3,
      selectionEnd: 3,
      isComposing: false,
    });
    expect(textarea).toHaveAttribute("maxlength", "3");
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
    expect(textarea).toHaveClass("seed-text-input__textareaValue");
    expect(textarea).not.toHaveClass("seed-text-input__textareaControl");
    expect(root.querySelector(".seed-text-input__textareaMirror")).toBeNull();
  });

  it("preserves the native input while the disabled state changes", () => {
    const renderTextField = (disabled: boolean) => (
      <TextField.Root disabled={disabled}>
        <TextField.Input />
      </TextField.Root>
    );
    const { rerender } = render(renderTextField(true));
    const input = getRenderedRoot().querySelector("input");

    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("disabled");
    expect(input).toHaveClass("seed-text-input__value");
    expect(input).toHaveClass("seed-text-input__value--disabled_true");

    rerender(renderTextField(false));

    const enabledInput = getRenderedRoot().querySelector("input");
    expect(enabledInput).toBe(input);
    expect(enabledInput).toHaveAttribute("disabled", "false");
    expect(enabledInput).toHaveClass("seed-text-input__value");
    expect(enabledInput).toHaveClass("seed-text-input__value--disabled_false");

    rerender(renderTextField(true));

    const disabledInput = getRenderedRoot().querySelector("input");
    expect(disabledInput).toBe(input);
    expect(disabledInput).toHaveAttribute("disabled");
    expect(disabledInput).toHaveClass("seed-text-input__value");
    expect(disabledInput).toHaveClass("seed-text-input__value--disabled_true");
  });
});
