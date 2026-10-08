import "@testing-library/jest-dom";
import { createRef, useState } from "@lynx-js/react";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { KeyboardAvoidingScrollViewProvider } from "@seed-design/lynx-react-keyboard-avoiding-scroll-view";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Field, FieldRoot, useFieldContext } from "@seed-design/lynx-react-field";
import { TextField, useTextFieldContext } from "./index.js";
import { NATIVE_TEXT_MAX_LENGTH_UNLIMITED } from "./useTextFieldInput.js";

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
  const textFieldRoot = root.classList.contains("test-text-field")
    ? root
    : root.querySelector<HTMLElement>(".test-text-field");

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

function TextFieldFocusState() {
  const { focused } = useTextFieldContext();
  return <text className="text-field-focus">{String(focused)}</text>;
}

function FieldFocusState() {
  const { focused } = useFieldContext();
  return <text className="field-focus">{String(focused)}</text>;
}

describe("TextField", () => {
  it("renders a native input with root-owned native props and initial value", () => {
    const onValueChange = vi.fn();
    const inputRef = createRef<NodesRef>();
    const renderTextField = () => (
      <TextField.Root
        className="test-text-field"
        defaultValue="초기값"
        name="title"
        onValueChange={onValueChange}
      >
        <TextField.Input ref={inputRef} placeholder="제목" />
      </TextField.Root>
    );
    const { rerender } = render(renderTextField());

    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

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
      <TextField.Root className="test-text-field">
        <TextField.Input />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("default-value", "");
  });

  it("replaces undefined soft keyboard props with safe native defaults", () => {
    const { rerender } = render(
      <TextField.Root className="test-text-field">
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
      <TextField.Root className="test-text-field">
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
      <TextField.Root className="test-text-field">
        <TextField.Input show-soft-input-on-focus={false} android-set-soft-input-mode="nothing" />
      </TextField.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    expect(input).toHaveAttribute("show-soft-input-on-focus", "false");
    expect(input).toHaveAttribute("android-set-soft-input-mode", "nothing");

    rerender(
      <TextField.Root className="test-text-field">
        <TextField.Textarea show-soft-input-on-focus={false} android-set-soft-input-mode="resize" />
      </TextField.Root>,
    );

    const textarea = getRenderedRoot().querySelector("textarea");
    expect(textarea).toHaveAttribute("show-soft-input-on-focus", "false");
    expect(textarea).toHaveAttribute("android-set-soft-input-mode", "resize");
  });

  describe("initial value on engines with and without default-value", () => {
    interface InvokeCall {
      method: string;
      params?: { value?: string };
      success?: (result: { value?: string }) => void;
      fail?: () => void;
    }

    function renderWithInvoke() {
      const calls: InvokeCall[] = [];
      let nativeNode: NodesRef | null = null;
      const setRef = (node: NodesRef | null) => {
        if (!node) return;
        nativeNode = node;
        node.invoke = ((call: InvokeCall) => {
          calls.push(call);
          return { exec: () => {} };
        }) as unknown as NodesRef["invoke"];
      };

      render(
        <TextField.Root className="test-text-field" defaultValue="초기값">
          <TextField.Input ref={setRef} />
        </TextField.Root>,
      );

      const getValueCall = calls.find((call) => call.method === "getValue");
      if (!getValueCall || !nativeNode) throw new Error("Expected getValue on the native input.");
      return {
        nativeNode: nativeNode as NodesRef,
        getValueCall,
        setValueCalls: () => calls.filter((call) => call.method === "setValue"),
      };
    }

    it("passes a non-empty initial value as default-value and keeps it when the engine applied it", () => {
      const { setValueCalls, getValueCall } = renderWithInvoke();

      expect(getRenderedRoot().querySelector("input")).toHaveAttribute("default-value", "초기값");
      getValueCall.success?.({ value: "초기값" });

      expect(setValueCalls()).toHaveLength(0);
    });

    it("writes the initial value with setValue when the engine ignored default-value", () => {
      const { setValueCalls, getValueCall } = renderWithInvoke();

      getValueCall.success?.({ value: "" });

      expect(setValueCalls().map((call) => call.params?.value)).toEqual(["초기값"]);
    });

    it("writes the initial value when getValue is not supported", () => {
      const { setValueCalls, getValueCall } = renderWithInvoke();

      getValueCall.fail?.();

      expect(setValueCalls().map((call) => call.params?.value)).toEqual(["초기값"]);
    });

    it("ignores a stale getValue result after the user has typed", () => {
      const { nativeNode, setValueCalls, getValueCall } = renderWithInvoke();
      const input = getRenderedRoot().querySelector("input");
      if (!input) throw new Error("Expected native input to exist.");

      fireNativeEvent(nativeNode, input, "input", {
        value: "새 값",
        selectionStart: 3,
        selectionEnd: 3,
        isComposing: false,
      });
      getValueCall.success?.({ value: "" });

      expect(setValueCalls()).toHaveLength(0);
    });
  });

  it("does not reapply an accepted controlled native input value", async () => {
    const inputRef = createRef<NodesRef>();

    function ControlledInput() {
      const [value, setValue] = useState("초기값");

      return (
        <TextField.Root className="test-text-field" value={value} onValueChange={setValue}>
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

  it("restores the committed controlled value when blur reports a stale native value", async () => {
    const inputRef = createRef<NodesRef>();

    function ControlledInput() {
      const [value, setValue] = useState("초기값");

      return (
        <TextField.Root className="test-text-field" value={value} onValueChange={setValue}>
          <TextField.Input ref={inputRef} />
        </TextField.Root>
      );
    }

    render(<ControlledInput />);

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");

    const exec = vi.fn();
    const invoke = vi.fn(() => ({ exec }));
    inputRef.current.invoke = invoke as unknown as NodesRef["invoke"];

    fireNativeEvent(inputRef.current, input, "input", {
      value: "최신값",
      selectionStart: 3,
      selectionEnd: 3,
      isComposing: false,
    });
    await flushControlledReconciliation();

    fireNativeEvent(inputRef.current, input, "blur", { value: "이전값" });
    await flushControlledReconciliation();

    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "setValue",
        params: { value: "최신값" },
      }),
    );
    expect(exec).toHaveBeenCalledTimes(1);

    fireNativeEvent(inputRef.current, input, "blur", { value: "최신값" });
    await flushControlledReconciliation();

    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("waits for a parent value update queued in a microtask", async () => {
    const inputRef = createRef<NodesRef>();

    function ControlledInput() {
      const [value, setValue] = useState("초기값");

      return (
        <TextField.Root
          className="test-text-field"
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
      <TextField.Root className="test-text-field" value={value}>
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
      <TextField.Root className="test-text-field" value="고정값">
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
          className="test-text-field"
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
      <TextField.Root className="test-text-field" value="고정값">
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
      <TextField.Root className="test-text-field" defaultValue="고정값" disabled>
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
      <TextField.Root className="test-text-field" nativeInsertionMaxLength={12}>
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
      <TextField.Root className="test-text-field" nativeInsertionMaxLength={12}>
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
      <TextField.Root
        className="test-text-field"
        nativeInsertionMaxLength={nativeInsertionMaxLength}
      >
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
      <TextField.Root className="test-text-field">
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
    const controlRef = createRef<NodesRef>();
    const fieldRef = createRef<NodesRef>();
    const actions = {
      focus: vi.fn(),
      blur: vi.fn(),
      layoutChanged: vi.fn(),
      unregister: vi.fn(),
    };

    render(
      <KeyboardAvoidingScrollViewProvider value={actions}>
        <FieldRoot ref={fieldRef}>
          <TextField.Root className="test-text-field" ref={controlRef}>
            <TextFieldFocusState />
            <TextField.Input ref={inputRef} />
          </TextField.Root>
        </FieldRoot>
      </KeyboardAvoidingScrollViewProvider>,
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
      controlRef: { current: controlRef.current },
      fieldRef: { current: fieldRef.current },
    });
    expect(getTextFieldRoot().querySelector(".text-field-focus")).toHaveTextContent("true");

    fireEvent.blur(inputRef.current as unknown as Element);
    expect(actions.blur).toHaveBeenCalledOnce();
    expect(getTextFieldRoot().querySelector(".text-field-focus")).toHaveTextContent("false");
  });

  it("clears Field focus when a focused input unmounts without blur", () => {
    const inputRef = createRef<NodesRef>();
    const renderField = (multiline: boolean) => (
      <Field.Root>
        <FieldFocusState />
        <TextField.Root className="test-text-field">
          <TextFieldFocusState />
          {multiline ? <TextField.Textarea /> : <TextField.Input ref={inputRef} />}
        </TextField.Root>
      </Field.Root>
    );
    const { rerender } = render(renderField(false));

    fireEvent.focus(inputRef.current as unknown as Element);
    expect(getRenderedRoot().querySelector(".field-focus")).toHaveTextContent("true");
    expect(getTextFieldRoot().querySelector(".text-field-focus")).toHaveTextContent("true");

    // Removal is not guaranteed to deliver a native blur event.
    rerender(renderField(true));

    expect(getRenderedRoot().querySelector(".field-focus")).toHaveTextContent("false");
    expect(getTextFieldRoot().querySelector(".text-field-focus")).toHaveTextContent("false");
  });

  it("renders readonly input and textarea values as non-editable text", () => {
    const inputRef = createRef<NodesRef>();
    const textareaRef = createRef<NodesRef>();
    const bindtap = vi.fn();
    const bindfocus = vi.fn();
    render(
      <Field.Root disabled readOnly>
        <TextField.Root className="test-text-field" defaultValue="고정값">
          <TextField.Input
            ref={inputRef}
            id="readonly-input"
            accessibility-label="읽기 전용 입력"
            data-foo="native"
            bindtap={bindtap}
            bindfocus={bindfocus}
          />
          <TextField.Textarea ref={textareaRef} />
        </TextField.Root>
      </Field.Root>,
    );

    const values = getRenderedRoot().querySelectorAll("text");

    expect(getRenderedRoot().querySelector("input")).toBeNull();
    expect(getRenderedRoot().querySelector("textarea")).toBeNull();
    expect(values).toHaveLength(2);
    expect(values[0]).toHaveTextContent("고정값");
    expect(values[1]).toHaveTextContent("고정값");
    expect(values[0]).toHaveAttribute("id", "readonly-input");
    expect(values[0]).toHaveAttribute("accessibility-label", "읽기 전용 입력");
    expect(values[0]).toHaveAttribute("data-foo", "native");
    if (!inputRef.current) throw new Error("Expected readonly text ref to exist.");
    fireEvent.tap(inputRef.current);
    fireEvent.focus(inputRef.current);
    expect(bindtap).toHaveBeenCalledTimes(1);
    expect(bindfocus).not.toHaveBeenCalled();
    expect(inputRef.current).not.toBeNull();
    expect(textareaRef.current).not.toBeNull();
  });

  it("renders readonly placeholders as text without native controls", () => {
    render(
      <Field.Root readOnly>
        <TextField.Root className="test-text-field">
          <TextField.Input placeholder="한 줄 플레이스홀더" />
          <TextField.Textarea placeholder="여러 줄 플레이스홀더" />
        </TextField.Root>
      </Field.Root>,
    );

    const { getByText } = getRenderedQueries();
    expect(getByText("한 줄 플레이스홀더").tagName.toLowerCase()).toBe("text");
    expect(getByText("여러 줄 플레이스홀더").tagName.toLowerCase()).toBe("text");
    expect(getRenderedRoot().querySelector("input")).toBeNull();
    expect(getRenderedRoot().querySelector("textarea")).toBeNull();
  });

  it("masks a readonly password value rendered as text", () => {
    render(
      <Field.Root readOnly>
        <TextField.Root className="test-text-field" defaultValue="secret">
          <TextField.Input type="password" />
        </TextField.Root>
      </Field.Root>,
    );

    expect(getRenderedRoot().querySelector("input")).toBeNull();
    expect(getRenderedQueries().getByText("••••••")).toBeInTheDocument();
    expect(getRenderedQueries().queryByText("secret")).toBeNull();
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
          className="test-text-field"
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

  it("preserves explicit textarea maxlength through selection changes", () => {
    const textareaRef = createRef<NodesRef>();
    render(
      <TextField.Root className="test-text-field" nativeInsertionMaxLength={10}>
        <TextField.Textarea ref={textareaRef} maxlength={20} />
      </TextField.Root>,
    );

    const textarea = getRenderedRoot().querySelector("textarea");
    if (!textarea) throw new Error("Expected native textarea to exist.");

    expect(textarea).toHaveAttribute("maxlength", "20");

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
    expect(textarea).toHaveAttribute("maxlength", "20");
  });

  it("disables the textarea insertion cap while native input is composing", () => {
    const textareaRef = createRef<NodesRef>();
    render(
      <TextField.Root
        className="test-text-field"
        defaultValue="최대값"
        nativeInsertionMaxLength={3}
      >
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

  it("preserves the native input while the disabled state changes", () => {
    const renderTextField = (disabled: boolean) => (
      <TextField.Root className="test-text-field" disabled={disabled}>
        <TextField.Input />
      </TextField.Root>
    );
    const { rerender } = render(renderTextField(true));
    const input = getRenderedRoot().querySelector("input");

    if (!input) throw new Error("Expected native input to exist.");

    expect(input).toHaveAttribute("disabled");

    rerender(renderTextField(false));

    const enabledInput = getRenderedRoot().querySelector("input");
    expect(enabledInput).toBe(input);
    expect(enabledInput).toHaveAttribute("disabled", "false");

    rerender(renderTextField(true));

    const disabledInput = getRenderedRoot().querySelector("input");
    expect(disabledInput).toBe(input);
    expect(disabledInput).toHaveAttribute("disabled");
  });
  it("notifies keyboard avoidance of native textarea layout changes before the user handler", () => {
    const textareaRef = createRef<NodesRef>();
    const actions = {
      focus: vi.fn(),
      blur: vi.fn(),
      layoutChanged: vi.fn(),
      unregister: vi.fn(),
    };
    const bindlayoutchange = vi.fn(() => {
      expect(actions.layoutChanged).toHaveBeenCalledOnce();
    });

    render(
      <KeyboardAvoidingScrollViewProvider value={actions}>
        <TextField.Root className="test-text-field">
          <TextField.Textarea ref={textareaRef} bindlayoutchange={bindlayoutchange} />
        </TextField.Root>
      </KeyboardAvoidingScrollViewProvider>,
    );

    const textarea = getRenderedRoot().querySelector("textarea");
    if (!textarea || !textareaRef.current) throw new Error("Expected native textarea to exist.");

    fireEvent.focus(textareaRef.current as unknown as Element);
    const registration = actions.focus.mock.calls[0]?.[0];
    expect(registration).toBeDefined();
    expect(actions.layoutChanged).not.toHaveBeenCalled();

    fireNativeEvent(textareaRef.current, textarea, "layoutchange", { width: 200, height: 120 });

    expect(actions.layoutChanged).toHaveBeenCalledExactlyOnceWith(registration.owner);
    expect(bindlayoutchange).toHaveBeenCalledOnce();
    expect(bindlayoutchange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { width: 200, height: 120 } }),
    );
  });
});
