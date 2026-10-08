import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { KeyboardAvoidingScrollViewProvider } from "@seed-design/lynx-react-keyboard-avoiding-scroll-view";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Field } from "../Field";
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

afterEach(() => {
  setSystemInfo(undefined);
  vi.unstubAllGlobals();
});

describe("TextField", () => {
  it("renders root and text adornment slots with default classes", () => {
    render(
      <TextField.Root className="custom-text-field">
        <TextField.Input />
        <TextField.PrefixText>₩</TextField.PrefixText>
        <TextField.SuffixText>원</TextField.SuffixText>
      </TextField.Root>,
    );

    const root = getTextFieldRoot();
    const { getByText } = getRenderedQueries();

    expect(root).toHaveClass("custom-text-field");
    expect(root).toHaveClass("seed-text-input__root--variant_outline");
    expect(root).toHaveClass("seed-text-input__root--size_large");
    expect(root.querySelector("input")).toHaveClass("seed-text-input__value");
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

  it("forwards native input props and lets the user override a computed value", () => {
    const bindfocus = vi.fn();
    const inputRef = createRef<NodesRef>();
    render(
      <TextField.Root>
        <TextField.Input
          ref={inputRef}
          id="account-input"
          accessibility-label="계정"
          data-foo="native"
          bindfocus={bindfocus}
          show-soft-input-on-focus={false}
        />
      </TextField.Root>,
    );

    const input = getTextFieldRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("id", "account-input");
    expect(input).toHaveAttribute("accessibility-label", "계정");
    expect(input).toHaveAttribute("data-foo", "native");
    expect(input).toHaveAttribute("show-soft-input-on-focus", "false");

    if (!inputRef.current) throw new Error("Expected native input ref to exist.");
    fireEvent.focus(inputRef.current as unknown as Element);
    expect(bindfocus).toHaveBeenCalledTimes(1);
    expect(getTextFieldRoot()).toHaveClass("seed-text-input__root--focused_true");
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

  it("applies focused recipe classes to the root and stroke", () => {
    const inputRef = createRef<NodesRef>();
    render(
      <TextField.Root>
        <TextField.Input ref={inputRef} />
      </TextField.Root>,
    );

    if (!inputRef.current) throw new Error("Expected native input ref to exist.");

    fireEvent.focus(inputRef.current as unknown as Element);
    expect(getTextFieldRoot()).toHaveClass("seed-text-input__root--focused_true");
    expect(getTextFieldRoot().querySelector(".seed-text-input__stroke")).toHaveClass(
      "seed-text-input__stroke--focused_true",
    );

    fireEvent.blur(inputRef.current as unknown as Element);
    expect(getTextFieldRoot()).toHaveClass("seed-text-input__root--focused_false");
    expect(getTextFieldRoot().querySelector(".seed-text-input__stroke")).toHaveClass(
      "seed-text-input__stroke--focused_false",
    );
  });

  it("applies disabled and fixed textarea recipe classes to readonly text", () => {
    render(
      <Field.Root disabled readOnly>
        <TextField.Root defaultValue="고정값">
          <TextField.Input />
          <TextField.Textarea />
        </TextField.Root>
      </Field.Root>,
    );

    const values = getRenderedRoot().querySelectorAll("text.seed-text-input__value");
    expect(values[0]).toHaveClass("seed-text-input__value--disabled_true");
    expect(values[1]).toHaveClass("seed-text-input__textareaValue");
    expect(values[1]).toHaveClass("seed-text-input__textareaFixed");
  });

  it("applies the SEED placeholder color to readonly input and textarea text", () => {
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
      <KeyboardAvoidingScrollViewProvider value={actions}>
        <TextField.Root defaultValue={"첫 줄\n둘째 줄\n"}>
          <TextField.Textarea
            ref={textareaRef}
            placeholder="내용"
            android-set-soft-input-mode="nothing"
            bindlayoutchange={bindlayoutchange}
          />
        </TextField.Root>
      </KeyboardAvoidingScrollViewProvider>,
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
      <KeyboardAvoidingScrollViewProvider value={actions}>
        <TextField.Root defaultValue={"첫 줄\n"}>
          <TextField.Textarea ref={textareaRef} bindlayoutchange={bindlayoutchange} />
        </TextField.Root>
      </KeyboardAvoidingScrollViewProvider>,
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

  it("updates native input recipe classes when the disabled state changes", () => {
    const renderTextField = (disabled: boolean) => (
      <TextField.Root disabled={disabled}>
        <TextField.Input />
      </TextField.Root>
    );
    const { rerender } = render(renderTextField(true));
    expect(getRenderedRoot().querySelector("input")).toHaveClass(
      "seed-text-input__value",
      "seed-text-input__value--disabled_true",
    );

    rerender(renderTextField(false));
    expect(getRenderedRoot().querySelector("input")).toHaveClass(
      "seed-text-input__value",
      "seed-text-input__value--disabled_false",
    );

    rerender(renderTextField(true));
    expect(getRenderedRoot().querySelector("input")).toHaveClass(
      "seed-text-input__value",
      "seed-text-input__value--disabled_true",
    );
  });
});
