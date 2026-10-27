import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SegmentedTextInput } from "./index";

interface InvokeCall {
  method: string;
  params?: { value?: string };
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

function fireInput(
  ref: { current: NodesRef | null },
  element: Element,
  value: string,
  selection = value.length,
) {
  const EventConstructor = element.ownerDocument.defaultView?.CustomEvent;
  if (!EventConstructor || !ref.current) throw new Error("Expected native input to exist.");

  const event = new EventConstructor("bindEvent:input", {
    bubbles: true,
    detail: { value, selectionStart: selection, selectionEnd: selection, isComposing: false },
  });
  Object.assign(event, { eventType: "bindEvent", eventName: "input" });
  fireEvent(ref.current as unknown as Element, event);
}

async function flushReconciliation() {
  await Promise.resolve();
  await Promise.resolve();
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
      <SegmentedTextInput.Root readOnly defaultValue={["931205", "1234567"]}>
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
    expect(texts).toContain("•••••••");
    expect(texts).not.toContain("1234567");
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
