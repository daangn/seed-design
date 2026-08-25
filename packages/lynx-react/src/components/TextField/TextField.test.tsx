import "@testing-library/jest-dom";
import { createRef, useState } from "@lynx-js/react";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Field } from "../Field";
import { KeyboardAvoidanceActionsContext } from "../KeyboardAvoidingScrollView/context";
import { NATIVE_TEXT_MAX_LENGTH_UNLIMITED } from "./context";
import { TextField } from "./index";

type TestSystemInfo = { platform?: string };

interface TestLynxGlobal {
  SystemInfo?: TestSystemInfo;
  lynxTestingEnv?: {
    backgroundThread: { globalThis: TestLynxGlobal };
    mainThread: { globalThis: TestLynxGlobal };
  };
}

function setSystemInfo(systemInfo: TestSystemInfo | undefined) {
  const lynxTestingEnv = (globalThis as TestLynxGlobal).lynxTestingEnv;
  const globals = [
    globalThis as TestLynxGlobal,
    lynxTestingEnv?.backgroundThread.globalThis,
    lynxTestingEnv?.mainThread.globalThis,
  ].filter((global): global is TestLynxGlobal => Boolean(global));

  for (const global of globals) {
    if (systemInfo == null) {
      delete global.SystemInfo;
    } else {
      global.SystemInfo = systemInfo;
    }
  }
}

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

function fireNativeEvent(
  nativeRef: NodesRef,
  element: Element,
  eventName: string,
  detail: object,
  bubbles = true,
) {
  const EventConstructor = element.ownerDocument.defaultView?.CustomEvent;
  if (!EventConstructor) throw new Error("Expected CustomEvent constructor to exist.");

  const event = new EventConstructor(`bindEvent:${eventName}`, { bubbles, detail });
  Object.assign(event, { eventType: "bindEvent", eventName });
  fireEvent(nativeRef as unknown as Element, event);
}

async function flushControlledReconciliation() {
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  setSystemInfo(undefined);
  vi.unstubAllGlobals();
});

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
    expect(root.querySelector(".seed-text-input__baseStroke")).toHaveAttribute(
      "accessibility-elements-hidden",
      "true",
    );
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

  it("renders a native input with root-owned native props and initial value", () => {
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
    expect(input).toHaveAttribute("default-value", "초기값");
    expect(input).toHaveAttribute("show-soft-input-on-focus", "true");
    expect(input).toHaveAttribute("android-set-soft-input-mode", "unspecified");
    expect(input).not.toHaveAttribute("maxlength");

    rerender(renderTextField());

    const rerenderedInput = getRenderedRoot().querySelector("input");
    if (!rerenderedInput) throw new Error("Expected native input to exist after rerender.");
    expect(rerenderedInput).toBe(input);
    expect(rerenderedInput).toHaveAttribute("default-value", "초기값");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("passes an empty initial value through the native default-value prop", () => {
    render(
      <TextField.Root>
        <TextField.Input />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("default-value", "");
  });

  it("replaces undefined soft keyboard props with safe native defaults", () => {
    const { rerender } = render(
      <TextField.Root>
        <TextField.Input
          show-soft-input-on-focus={undefined}
          android-set-soft-input-mode={undefined}
        />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    expect(input).toHaveAttribute("show-soft-input-on-focus", "true");
    expect(input).toHaveAttribute("android-set-soft-input-mode", "unspecified");

    rerender(
      <TextField.Root>
        <TextField.Textarea
          show-soft-input-on-focus={undefined}
          android-set-soft-input-mode={undefined}
        />
      </TextField.Root>,
    );

    const textarea = getRenderedRoot().querySelector("textarea");
    expect(textarea).toHaveAttribute("show-soft-input-on-focus", "true");
    expect(textarea).toHaveAttribute("android-set-soft-input-mode", "unspecified");
  });

  it("preserves explicit soft keyboard overrides", () => {
    const { rerender } = render(
      <TextField.Root>
        <TextField.Input show-soft-input-on-focus={false} android-set-soft-input-mode="nothing" />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    expect(input).toHaveAttribute("show-soft-input-on-focus", "false");
    expect(input).toHaveAttribute("android-set-soft-input-mode", "nothing");

    rerender(
      <TextField.Root>
        <TextField.Textarea show-soft-input-on-focus={false} android-set-soft-input-mode="resize" />
      </TextField.Root>,
    );

    const textarea = getRenderedRoot().querySelector("textarea");
    expect(textarea).toHaveAttribute("show-soft-input-on-focus", "false");
    expect(textarea).toHaveAttribute("android-set-soft-input-mode", "resize");
  });

  it("initializes a non-empty value without invoking a native UI method", () => {
    const invoke = vi.fn(() => ({ exec: vi.fn() }));
    const setRef = (node: NodesRef | null) => {
      if (node) node.invoke = invoke as unknown as NodesRef["invoke"];
    };

    render(
      <TextField.Root defaultValue="초기값">
        <TextField.Input ref={setRef} />
      </TextField.Root>,
    );

    expect(getRenderedRoot().querySelector("input")).toHaveAttribute("default-value", "초기값");
    expect(invoke).not.toHaveBeenCalled();
  });

  it("does not reapply an accepted controlled native input value", async () => {
    const inputRef = createRef<NodesRef>();

    function ControlledInput() {
      const [value, setValue] = useState("초기값");

      return (
        <TextField.Root value={value} onValueChange={setValue}>
          <TextField.Input ref={inputRef} />
        </TextField.Root>
      );
    }

    render(<ControlledInput />);

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");

    const invoke = vi.fn(() => ({ exec: vi.fn() }));
    inputRef.current.invoke = invoke as unknown as NodesRef["invoke"];
    fireNativeEvent(inputRef.current, input, "input", {
      value: "수정값",
      selectionStart: 3,
      selectionEnd: 3,
      isComposing: false,
    });
    await flushControlledReconciliation();

    expect(invoke).not.toHaveBeenCalled();
  });

  it("waits for a parent value update queued in a microtask", async () => {
    const inputRef = createRef<NodesRef>();

    function ControlledInput() {
      const [value, setValue] = useState("초기값");

      return (
        <TextField.Root
          value={value}
          onValueChange={(nextValue) => {
            void Promise.resolve().then(() => setValue(nextValue));
          }}
        >
          <TextField.Input ref={inputRef} />
        </TextField.Root>
      );
    }

    render(<ControlledInput />);

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");

    const invoke = vi.fn(() => ({ exec: vi.fn() }));
    inputRef.current.invoke = invoke as unknown as NodesRef["invoke"];
    fireNativeEvent(inputRef.current, input, "input", {
      value: "수정값",
      selectionStart: 3,
      selectionEnd: 3,
      isComposing: false,
    });
    await flushControlledReconciliation();

    expect(invoke).not.toHaveBeenCalled();
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

  it("restores a rejected controlled value before the next frame", async () => {
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

    expect(invoke).not.toHaveBeenCalled();
    await flushControlledReconciliation();

    expect(invoke).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "setValue",
        params: { value: "고정값" },
      }),
    );
    expect(exec).toHaveBeenCalledTimes(1);
  });

  it("syncs a transformed controlled value without restoring the stale value", async () => {
    const inputRef = createRef<NodesRef>();

    function ControlledInput() {
      const [value, setValue] = useState("INITIAL");

      return (
        <TextField.Root
          value={value}
          onValueChange={(nextValue) => setValue(nextValue.toUpperCase())}
        >
          <TextField.Input ref={inputRef} />
        </TextField.Root>
      );
    }

    render(<ControlledInput />);

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");

    const invoke = vi.fn(() => ({ exec: vi.fn() }));
    inputRef.current.invoke = invoke as unknown as NodesRef["invoke"];
    fireNativeEvent(inputRef.current, input, "input", {
      value: "changed",
      selectionStart: 7,
      selectionEnd: 7,
      isComposing: false,
    });
    await flushControlledReconciliation();

    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "setValue",
        params: { value: "CHANGED" },
      }),
    );
  });

  it("does not reconcile a controlled input after it unmounts", async () => {
    const inputRef = createRef<NodesRef>();
    const { unmount } = render(
      <TextField.Root value="고정값">
        <TextField.Input ref={inputRef} />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");

    const invoke = vi.fn(() => ({ exec: vi.fn() }));
    inputRef.current.invoke = invoke as unknown as NodesRef["invoke"];
    fireNativeEvent(inputRef.current, input, "input", {
      value: "거부할 값",
      selectionStart: 4,
      selectionEnd: 4,
      isComposing: false,
    });
    unmount();
    await flushControlledReconciliation();

    expect(invoke).not.toHaveBeenCalled();
  });

  it("does not resync a disabled value after setValue emits the accepted input event", () => {
    const inputRef = createRef<NodesRef>();
    render(
      <TextField.Root defaultValue="고정값" disabled>
        <TextField.Input ref={inputRef} />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");

    const exec = vi.fn();
    const invoke = vi.fn(() => ({ exec }));
    inputRef.current.invoke = invoke as unknown as NodesRef["invoke"];

    fireNativeEvent(inputRef.current, input, "input", {
      value: "변경값",
      selectionStart: 3,
      selectionEnd: 3,
      isComposing: false,
    });

    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "setValue",
        params: { value: "고정값" },
      }),
    );

    fireNativeEvent(inputRef.current, input, "input", {
      value: "고정값",
      selectionStart: 3,
      selectionEnd: 3,
      isComposing: false,
    });

    expect(invoke).toHaveBeenCalledTimes(1);
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
    expect(getRenderedRoot().querySelector("input")).toHaveAttribute(
      "android-set-soft-input-mode",
      "unspecified",
    );

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

  it("renders readonly input and textarea values as non-editable text", () => {
    const inputRef = createRef<NodesRef>();
    const textareaRef = createRef<NodesRef>();
    render(
      <Field.Root disabled readOnly>
        <TextField.Root defaultValue="고정값">
          <TextField.Input ref={inputRef} />
          <TextField.Textarea ref={textareaRef} />
        </TextField.Root>
      </Field.Root>,
    );

    const values = getRenderedRoot().querySelectorAll("text.seed-text-input__value");

    expect(getRenderedRoot().querySelector("input")).toBeNull();
    expect(getRenderedRoot().querySelector("textarea")).toBeNull();
    expect(values).toHaveLength(2);
    expect(values[0]).toHaveTextContent("고정값");
    expect(values[0]).toHaveClass("seed-text-input__value--disabled_true");
    expect(values[1]).toHaveTextContent("고정값");
    expect(values[1]).toHaveClass("seed-text-input__textareaValue");
    expect(values[1]).toHaveClass("seed-text-input__textareaFixed");
    expect(inputRef.current).not.toBeNull();
    expect(textareaRef.current).not.toBeNull();
  });

  it("renders readonly placeholders as text without native controls", () => {
    render(
      <Field.Root readOnly>
        <TextField.Root>
          <TextField.Input placeholder="한 줄 플레이스홀더" />
          <TextField.Textarea placeholder="여러 줄 플레이스홀더" />
        </TextField.Root>
      </Field.Root>,
    );

    const { getByText } = getRenderedQueries();
    expect(getByText("한 줄 플레이스홀더")).toHaveStyle({
      color: "var(--seed-color-fg-placeholder)",
    });
    expect(getByText("여러 줄 플레이스홀더")).toHaveStyle({
      color: "var(--seed-color-fg-placeholder)",
    });
  });

  it("masks a readonly password value rendered as text", () => {
    render(
      <Field.Root readOnly>
        <TextField.Root defaultValue="secret">
          <TextField.Input type="password" />
        </TextField.Root>
      </Field.Root>,
    );

    expect(getRenderedRoot().querySelector("input")).toBeNull();
    expect(getRenderedQueries().getByText("••••••")).toBeInTheDocument();
    expect(getRenderedQueries().queryByText("secret")).toBeNull();
  });

  it("uses direct native autoresize on Android", () => {
    setSystemInfo({ platform: "Android" });

    const textareaRef = createRef<NodesRef>();
    const bindlayoutchange = vi.fn();
    const actions = {
      focus: vi.fn(),
      blur: vi.fn(),
      layoutChanged: vi.fn(),
      unregister: vi.fn(),
    };
    render(
      <KeyboardAvoidanceActionsContext.Provider value={actions}>
        <TextField.Root defaultValue={"첫 줄\n둘째 줄\n"}>
          <TextField.Textarea
            ref={textareaRef}
            placeholder="내용"
            android-set-soft-input-mode="nothing"
            bindlayoutchange={bindlayoutchange}
          />
        </TextField.Root>
      </KeyboardAvoidanceActionsContext.Provider>,
    );

    const root = getRenderedRoot();
    const textarea = root.querySelector("textarea");
    if (!textarea) throw new Error("Expected native textarea to exist.");
    if (!textareaRef.current) throw new Error("Expected native textarea ref to exist.");

    expect(textarea).not.toHaveClass("seed-text-input__textareaNativeAutoresize");
    expect(textarea).toHaveClass("seed-text-input__textareaAndroidAutoresize--size_large");
    expect(textarea).toHaveClass("seed-text-input__textareaValue");
    expect(textarea).not.toHaveClass("seed-text-input__textareaFixed");
    expect(textarea).toHaveAttribute("bounces", "false");
    expect(textarea).toHaveAttribute("show-soft-input-on-focus", "true");
    expect(textarea).toHaveAttribute("default-value", "첫 줄\n둘째 줄\n");
    expect(textarea).toHaveAttribute("android-fullscreen-mode", "false");
    expect(textarea).toHaveAttribute("android-set-soft-input-mode", "nothing");
    expect(textarea).not.toHaveAttribute("maxlength");
    expect(root.querySelector(".seed-text-input__textareaRoot")).toBeNull();

    fireNativeEvent(textareaRef.current, textarea, "layoutchange", {
      width: 200,
      height: 120,
    });
    expect(actions.layoutChanged).toHaveBeenCalledOnce();
    expect(bindlayoutchange).toHaveBeenCalledOnce();
  });

  it("uses native intrinsic autoresize with the Android-only line-spacing correction", () => {
    setSystemInfo({ platform: "Android" });

    const { rerender } = render(
      <TextField.Root defaultValue={"첫 줄\n"}>
        <TextField.Textarea />
      </TextField.Root>,
    );

    const root = getRenderedRoot();
    const textarea = root.querySelector("textarea");
    if (!textarea) throw new Error("Expected native textarea to exist.");

    expect(textarea).not.toHaveClass("seed-text-input__textareaNativeAutoresize");
    expect(textarea).toHaveClass("seed-text-input__textareaAndroidAutoresize--size_large");
    expect(textarea).toHaveAttribute("line-spacing", "3.2px");
    expect(root.querySelector(".seed-text-input__textareaAutoresizeRoot--size_large")).toBeNull();
    expect(root.querySelector(".seed-text-input__textareaRoot text")).toBeNull();

    rerender(
      <TextField.Root value={"첫 줄\n둘째 줄\n"}>
        <TextField.Textarea />
      </TextField.Root>,
    );

    expect(getRenderedRoot().querySelector("textarea")).toBe(textarea);
  });

  it("uses the Android line-spacing correction and preserves an explicit override", () => {
    setSystemInfo({ platform: "Android" });

    const { rerender } = render(
      <TextField.Root size="medium">
        <TextField.Textarea autoresize={false} />
      </TextField.Root>,
    );

    const textarea = getRenderedRoot().querySelector("textarea");
    if (!textarea) throw new Error("Expected native textarea to exist.");
    expect(textarea).toHaveAttribute("line-spacing", "3.2px");
    expect(getRenderedRoot().querySelector(".seed-text-input__textareaRoot")).toBeNull();

    rerender(
      <TextField.Root size="medium">
        <TextField.Textarea autoresize={false} line-spacing="7px" />
      </TextField.Root>,
    );
    const overriddenTextarea = getRenderedRoot().querySelector("textarea");
    expect(overriddenTextarea).toBe(textarea);
    expect(overriddenTextarea).toHaveAttribute("line-spacing", "7px");

    rerender(
      <TextField.Root size="medium">
        <TextField.Textarea autoresize={false} line-spacing={0} />
      </TextField.Root>,
    );
    const uncorrectedTextarea = getRenderedRoot().querySelector("textarea");
    expect(uncorrectedTextarea).toBe(textarea);
    expect(uncorrectedTextarea).toHaveAttribute("line-spacing", "0");
  });

  it("uses an iOS-only sizing wrapper without intercepting native textarea taps", () => {
    setSystemInfo({ platform: "iOS" });

    const textareaRef = createRef<NodesRef>();
    const bindlayoutchange = vi.fn();
    const actions = {
      focus: vi.fn(),
      blur: vi.fn(),
      layoutChanged: vi.fn(),
      unregister: vi.fn(),
    };
    render(
      <KeyboardAvoidanceActionsContext.Provider value={actions}>
        <TextField.Root defaultValue={"첫 줄\n"}>
          <TextField.Textarea ref={textareaRef} bindlayoutchange={bindlayoutchange} />
        </TextField.Root>
      </KeyboardAvoidanceActionsContext.Provider>,
    );

    const root = getRenderedRoot();
    const textarea = root.querySelector("textarea");
    const textareaRoot = root.querySelector(".seed-text-input__textareaRoot");
    if (!textarea || !textareaRoot || !textareaRef.current) {
      throw new Error("Expected native textarea and its iOS sizing wrapper to exist.");
    }

    expect(textarea).toHaveClass("seed-text-input__textareaNativeAutoresize");
    expect(textarea).not.toHaveClass("seed-text-input__textareaAndroidAutoresize--size_large");
    expect(textarea).not.toHaveAttribute("line-spacing");
    expect(textareaRoot).toHaveClass("seed-text-input__textareaAutoresizeRoot--size_large");
    expect(textareaRoot).toHaveAttribute("ignore-focus", "true");

    const exec = vi.fn();
    const invoke = vi.fn(() => ({ exec }));
    textareaRef.current.invoke = invoke as unknown as NodesRef["invoke"];

    fireEvent.tap(textareaRef.current as unknown as Element);
    expect(invoke).not.toHaveBeenCalled();

    fireEvent.tap(textareaRoot);
    expect(invoke).toHaveBeenCalledWith(expect.objectContaining({ method: "focus" }));
    expect(exec).toHaveBeenCalledOnce();

    actions.layoutChanged.mockClear();
    fireNativeEvent(
      textareaRef.current,
      textarea,
      "layoutchange",
      {
        width: 200,
        height: 80,
      },
      false,
    );
    expect(bindlayoutchange).toHaveBeenCalledOnce();
    expect(actions.layoutChanged).not.toHaveBeenCalled();

    fireNativeEvent(textareaRoot as unknown as NodesRef, textareaRoot, "layoutchange", {
      width: 200,
      height: 94,
    });
    expect(actions.layoutChanged).toHaveBeenCalledOnce();
  });

  it("does not invoke focus from disabled iOS textarea wrapper padding", () => {
    setSystemInfo({ platform: "iOS" });

    const textareaRef = createRef<NodesRef>();
    render(
      <TextField.Root disabled>
        <TextField.Textarea ref={textareaRef} />
      </TextField.Root>,
    );

    const textareaRoot = getRenderedRoot().querySelector(".seed-text-input__textareaRoot");
    if (!textareaRoot || !textareaRef.current) {
      throw new Error("Expected disabled native textarea and its iOS sizing wrapper to exist.");
    }

    const invoke = vi.fn(() => ({ exec: vi.fn() }));
    textareaRef.current.invoke = invoke as unknown as NodesRef["invoke"];

    fireEvent.tap(textareaRoot);
    expect(invoke).not.toHaveBeenCalled();
  });

  it.each([
    "Android",
    "iOS",
  ] as const)("does not restore the previous value after an accepted controlled textarea newline on %s", async (platform) => {
    setSystemInfo({ platform });

    const textareaRef = createRef<NodesRef>();
    const onValueChange = vi.fn();
    const bindinput = vi.fn();

    function ControlledTextarea() {
      const [value, setValue] = useState("첫 줄");

      return (
        <TextField.Root
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
        >
          <TextField.Textarea ref={textareaRef} bindinput={bindinput} />
        </TextField.Root>
      );
    }

    render(<ControlledTextarea />);

    const root = getRenderedRoot();
    const textarea = root.querySelector("textarea");
    if (!textarea || !textareaRef.current) {
      throw new Error("Expected native textarea to exist.");
    }

    if (platform === "iOS") {
      expect(textarea).toHaveClass("seed-text-input__textareaNativeAutoresize");
      expect(root.querySelector(".seed-text-input__textareaRoot")).not.toBeNull();
    } else {
      expect(textarea).not.toHaveClass("seed-text-input__textareaNativeAutoresize");
      expect(root.querySelector(".seed-text-input__textareaRoot")).toBeNull();
    }

    const invoke = vi.fn(() => ({ exec: vi.fn() }));
    textareaRef.current.invoke = invoke as unknown as NodesRef["invoke"];

    fireNativeEvent(textareaRef.current, textarea, "input", {
      value: "첫 줄\n",
      selectionStart: 4,
      selectionEnd: 4,
      isComposing: false,
    });
    expect(onValueChange).toHaveBeenCalledWith("첫 줄\n");
    expect(bindinput).toHaveBeenCalledOnce();
    expect(invoke).not.toHaveBeenCalled();

    await flushControlledReconciliation();
    expect(getRenderedRoot().querySelector("textarea")).toBe(textarea);
    expect(invoke).not.toHaveBeenCalled();
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
      <TextField.Root defaultValue="최대값" nativeInsertionMaxLength={3}>
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

  it("applies textarea sizing directly when autoresize is false", () => {
    render(
      <TextField.Root>
        <TextField.Textarea autoresize={false} />
      </TextField.Root>,
    );

    const root = getRenderedRoot();
    const textarea = root.querySelector("textarea");

    expect(textarea).toHaveClass("seed-text-input__value");
    expect(textarea).toHaveClass("seed-text-input__textareaValue");
    expect(textarea).toHaveClass("seed-text-input__textareaFixed");
    expect(root.querySelector(".seed-text-input__textareaRoot")).toBeNull();
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
