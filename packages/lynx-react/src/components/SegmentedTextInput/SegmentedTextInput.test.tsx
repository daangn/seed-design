import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SegmentedTextInput } from "./index";

interface InvokeCall {
  method: string;
  params?: { value?: string; selectionStart?: number; selectionEnd?: number };
}

function getRenderedRoot() {
  const root = elementTree.root;
  if (!root) throw new Error("Expected Lynx render root to exist.");
  return root;
}

function getInputs() {
  return Array.from(getRenderedRoot().querySelectorAll("input"));
}

function stubInvoke(ref: { current: NodesRef | null }) {
  const calls: InvokeCall[] = [];
  if (!ref.current) throw new Error("Expected native input ref to exist.");
  ref.current.invoke = ((call: InvokeCall) => {
    calls.push(call);
    return { exec: () => {} };
  }) as unknown as NodesRef["invoke"];
  return calls;
}

function fireNativeEvent(
  ref: { current: NodesRef | null },
  element: Element,
  eventName: string,
  detail: object,
) {
  const EventConstructor = element.ownerDocument.defaultView?.CustomEvent;
  if (!EventConstructor || !ref.current) throw new Error("Expected native input to exist.");

  const event = new EventConstructor(`bindEvent:${eventName}`, { bubbles: true, detail });
  Object.assign(event, { eventType: "bindEvent", eventName });
  fireEvent(ref.current as unknown as Element, event);
}

function fireInput(
  ref: { current: NodesRef | null },
  element: Element,
  value: string,
  { selection = value.length, isComposing = false } = {},
) {
  fireNativeEvent(ref, element, "input", {
    value,
    selectionStart: selection,
    selectionEnd: selection,
    isComposing,
  });
}

function fireSelection(
  ref: { current: NodesRef | null },
  element: Element,
  selection: number,
  selectionEnd = selection,
) {
  fireNativeEvent(ref, element, "selection", {
    selectionStart: selection,
    selectionEnd,
  });
}

async function flushReconciliation() {
  await Promise.resolve();
  await Promise.resolve();
}

function getMaskedDots() {
  const dots = getRenderedRoot().querySelector(".seed-segmented-text-input__maskedDots");
  return {
    total: dots?.querySelectorAll(".seed-segmented-text-input__dot").length ?? 0,
    filled: dots?.querySelectorAll(".seed-segmented-text-input__filledDot").length ?? 0,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

function renderCardNumber(onValueChange = vi.fn()) {
  const refs = [0, 1, 2, 3].map(() => createRef<NodesRef>());
  render(
    <SegmentedTextInput.Root onValueChange={onValueChange}>
      {refs.map((ref, i) => (
        <SegmentedTextInput.Segment
          key={i}
          ref={ref}
          accessibility-label={`카드번호 ${i + 1}`}
          length={4}
          masked={i >= 2}
        />
      ))}
    </SegmentedTextInput.Root>,
  );
  const calls = refs.map(stubInvoke);
  return { refs, calls, inputs: getInputs(), onValueChange };
}

describe("SegmentedTextInput", () => {
  it("moves focus to the next segment when typing fills the segment", () => {
    const { refs, calls, inputs, onValueChange } = renderCardNumber();

    fireInput(refs[0]!, inputs[0]!, "123");
    expect(calls[1]).toEqual([]);

    fireInput(refs[0]!, inputs[0]!, "1234");
    expect(onValueChange).toHaveBeenLastCalledWith(["1234", "", "", ""]);
    expect(calls[1]).toContainEqual(expect.objectContaining({ method: "focus" }));
  });

  it("blocks further typing natively once the segment is full", () => {
    const { refs, inputs } = renderCardNumber();

    fireInput(refs[0]!, inputs[0]!, "123");
    expect(getInputs()[0]).toHaveAttribute("maxlength", "2147483647");

    fireInput(refs[0]!, inputs[0]!, "1234");
    expect(getInputs()[0]).toHaveAttribute("maxlength", "4");
  });

  it("moves focus even when the selection change arrives before the input", () => {
    const { refs, calls, inputs } = renderCardNumber();

    fireInput(refs[0]!, inputs[0]!, "123");
    // iOS는 입력 뒤의 caret 위치를 bindinput보다 먼저 보낸다.
    fireSelection(refs[0]!, inputs[0]!, 4);
    fireInput(refs[0]!, inputs[0]!, "1234");

    expect(calls[1]).toContainEqual(expect.objectContaining({ method: "focus" }));
  });

  it("restores the native value when the input exceeds the length or is not a digit", async () => {
    const { refs, calls, inputs, onValueChange } = renderCardNumber();

    fireInput(refs[0]!, inputs[0]!, "12");
    fireInput(refs[0]!, inputs[0]!, "12a");
    await flushReconciliation();

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(calls[0]).toContainEqual(
      expect.objectContaining({ method: "setValue", params: { value: "12" } }),
    );
  });

  it("distributes a multi-character insertion and stops before a masked segment", async () => {
    const { refs, calls, inputs, onValueChange } = renderCardNumber();

    fireInput(refs[0]!, inputs[0]!, "1234-5678-9012-3456");
    await flushReconciliation();

    expect(onValueChange).toHaveBeenLastCalledWith(["1234", "5678", "", ""]);
    expect(calls[1]).toContainEqual(
      expect.objectContaining({ method: "setValue", params: { value: "5678" } }),
    );
    expect(calls[2]).toContainEqual(expect.objectContaining({ method: "focus" }));
    expect(calls[2]).not.toContainEqual(expect.objectContaining({ method: "setValue" }));
  });

  it("keeps a paste inside the segment when unselected characters follow the caret", async () => {
    const onValueChange = vi.fn();
    const refs = [createRef<NodesRef>(), createRef<NodesRef>()];
    render(
      <SegmentedTextInput.Root defaultValue={["1234", "5678"]} onValueChange={onValueChange}>
        <SegmentedTextInput.Segment ref={refs[0]} accessibility-label="앞 4자리" length={4} />
        <SegmentedTextInput.Segment ref={refs[1]} accessibility-label="뒤 4자리" length={4} />
      </SegmentedTextInput.Root>,
    );
    const calls = refs.map(stubInvoke);
    const inputs = getInputs();

    fireSelection(refs[0]!, inputs[0]!, 2);
    fireInput(refs[0]!, inputs[0]!, "129934", { selection: 4 });
    await flushReconciliation();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(calls[0]).toContainEqual(
      expect.objectContaining({ method: "setValue", params: { value: "1234" } }),
    );

    fireSelection(refs[0]!, inputs[0]!, 0);
    fireInput(refs[0]!, inputs[0]!, "1234", { selection: 0 });
    fireSelection(refs[0]!, inputs[0]!, 4);
    fireInput(refs[0]!, inputs[0]!, "123");
    expect(onValueChange).toHaveBeenLastCalledWith(["123", "5678"]);
  });

  it("judges a composition against the value before it started", async () => {
    const onValueChange = vi.fn();
    const refs = [createRef<NodesRef>(), createRef<NodesRef>(), createRef<NodesRef>()];
    render(
      <SegmentedTextInput.Root defaultValue={["abcd", "123", ""]} onValueChange={onValueChange}>
        <SegmentedTextInput.Segment
          ref={refs[0]}
          accessibility-label="문자"
          length={4}
          type="text"
        />
        <SegmentedTextInput.Segment ref={refs[1]} accessibility-label="숫자" length={4} />
        <SegmentedTextInput.Segment ref={refs[2]} accessibility-label="다음" length={4} />
      </SegmentedTextInput.Root>,
    );
    const calls = refs.map(stubInvoke);
    const inputs = getInputs();

    // 자리 수를 넘는 조합은 조합 전 값으로 되돌린다.
    fireSelection(refs[0]!, inputs[0]!, 2);
    fireInput(refs[0]!, inputs[0]!, "ab한cd", { selection: 3, isComposing: true });
    fireInput(refs[0]!, inputs[0]!, "ab한cd", { selection: 3 });
    await flushReconciliation();

    expect(onValueChange).toHaveBeenLastCalledWith(["abcd", "123", ""]);

    // 끝에서 조합해 Segment를 채우면 조합이 끝난 뒤 다음 Segment로 이동한다.
    fireSelection(refs[1]!, inputs[1]!, 3);
    fireInput(refs[1]!, inputs[1]!, "1234", { isComposing: true });
    expect(calls[2]).not.toContainEqual(expect.objectContaining({ method: "focus" }));
    fireInput(refs[1]!, inputs[1]!, "1234");

    expect(onValueChange).toHaveBeenLastCalledWith(["abcd", "1234", ""]);
    expect(calls[2]).toContainEqual(expect.objectContaining({ method: "focus" }));
  });

  it("normalizes a pasted birth date for a bday segment", () => {
    const onValueChange = vi.fn();
    const ref = createRef<NodesRef>();
    render(
      <SegmentedTextInput.Root onValueChange={onValueChange}>
        <SegmentedTextInput.Segment
          ref={ref}
          accessibility-label="생년월일 6자리"
          length={6}
          autoComplete="bday"
        />
      </SegmentedTextInput.Root>,
    );

    fireInput(ref, getInputs()[0]!, "1993-12-05");

    expect(onValueChange).toHaveBeenLastCalledWith(["931205"]);
  });

  it("renders read-only segments as text and masks their value", () => {
    render(
      <SegmentedTextInput.Root readOnly defaultValue={["931205", "123"]}>
        <SegmentedTextInput.Segment accessibility-label="생년월일" length={6} />
        <SegmentedTextInput.Separator> - </SegmentedTextInput.Separator>
        <SegmentedTextInput.Segment accessibility-label="뒷자리" length={7} masked />
      </SegmentedTextInput.Root>,
    );

    const texts = Array.from(getRenderedRoot().querySelectorAll("text")).map(
      (text) => text.textContent,
    );
    expect(getInputs()).toHaveLength(0);
    expect(texts).toContain("931205");
    expect(texts.join("")).not.toContain("123");
    expect(getMaskedDots()).toEqual({ total: 7, filled: 3 });
  });

  it("draws masked segments as dots and keeps the caret at the end", () => {
    const ref = createRef<NodesRef>();
    render(
      <SegmentedTextInput.Root defaultValue={["12"]}>
        <SegmentedTextInput.Segment ref={ref} accessibility-label="뒷자리" length={4} masked />
      </SegmentedTextInput.Root>,
    );
    const calls = stubInvoke(ref);
    const input = getInputs()[0]!;

    expect(input).toHaveAttribute("type", "number");
    expect(getMaskedDots()).toEqual({ total: 4, filled: 2 });

    // 가운데로 옮긴 caret은 끝으로 되돌린다.
    fireSelection(ref, input, 1);
    expect(calls).toContainEqual({
      method: "setSelectionRange",
      params: { selectionStart: 2, selectionEnd: 2 },
    });

    fireInput(ref, input, "123");
    expect(getMaskedDots()).toEqual({ total: 4, filled: 3 });

    // 입력 직후 끝에 있는 caret은 건드리지 않는다.
    calls.length = 0;
    fireSelection(ref, input, 3);
    expect(calls).toEqual([]);
  });

  it("draws Dots in the placeholder color while the segment is empty", () => {
    render(
      <SegmentedTextInput.Root>
        <SegmentedTextInput.Segment
          accessibility-label="뒷자리 첫 번째 자리"
          length={1}
          placeholder={<SegmentedTextInput.Dots count={1} />}
          staticSuffix={<SegmentedTextInput.Dots count={6} />}
        />
      </SegmentedTextInput.Root>,
    );

    const root = getRenderedRoot();
    expect(root.querySelectorAll(".seed-segmented-text-input__dot")).toHaveLength(7);
    expect(root.querySelectorAll(".seed-segmented-text-input__placeholderDot")).toHaveLength(1);
    expect(getInputs()[0]).not.toHaveAttribute("placeholder");
  });

  it("keeps the focus state while focus moves between segments", () => {
    vi.useFakeTimers();
    const { refs } = renderCardNumber();
    const root = getRenderedRoot().querySelector(".seed-segmented-text-input__root");

    fireEvent.focus(refs[0]!.current as unknown as Element);
    expect(root).toHaveClass("seed-segmented-text-input__root--focused_true");

    fireEvent.blur(refs[0]!.current as unknown as Element);
    fireEvent.focus(refs[1]!.current as unknown as Element);
    act(() => {
      vi.runAllTimers();
    });
    expect(root).toHaveClass("seed-segmented-text-input__root--focused_true");

    fireEvent.blur(refs[1]!.current as unknown as Element);
    act(() => {
      vi.runAllTimers();
    });
    expect(root).not.toHaveClass("seed-segmented-text-input__root--focused_true");
  });
});
