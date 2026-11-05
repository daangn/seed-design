import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { FieldRoot, useFieldContext } from "@seed-design/lynx-react-field";
import { describe, expect, it, vi } from "vitest";

import { SegmentedTextInput } from "./index.js";

interface InvokeCall {
  method: string;
  params?: object;
}

function getRenderedRoot() {
  const root = elementTree.root;
  if (!root) throw new Error("Expected Lynx render root to exist.");
  return root;
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

function fireNativeEvent(ref: { current: NodesRef | null }, eventName: string, detail: object) {
  const EventConstructor = getRenderedRoot().ownerDocument.defaultView?.CustomEvent;
  if (!EventConstructor || !ref.current) throw new Error("Expected native input to exist.");

  const event = new EventConstructor(`bindEvent:${eventName}`, { bubbles: true, detail });
  Object.assign(event, { eventType: "bindEvent", eventName });
  fireEvent(ref.current as unknown as Element, event);
}

function fireInput(ref: { current: NodesRef | null }, value: string) {
  fireNativeEvent(ref, "input", {
    value,
    selectionStart: value.length,
    selectionEnd: value.length,
    isComposing: false,
  });
}

function renderSegments(lengths: number[], { masked = [] as number[] } = {}) {
  const onValueChange = vi.fn();
  const refs = lengths.map(() => createRef<NodesRef>());
  render(
    <SegmentedTextInput.Root onValueChange={onValueChange}>
      {lengths.map((length, i) => (
        <SegmentedTextInput.Segment
          key={i}
          ref={refs[i]}
          accessibility-label={`segment ${i + 1}`}
          length={length}
          masked={masked.includes(i)}
        />
      ))}
    </SegmentedTextInput.Root>,
  );
  return { refs, calls: refs.map(stubInvoke), onValueChange };
}

describe("SegmentedTextInput", () => {
  it("moves focus to the next segment when typing fills the segment", () => {
    const { refs, calls, onValueChange } = renderSegments([2, 2]);

    fireInput(refs[0]!, "1");
    expect(calls[1]).toEqual([]);

    fireInput(refs[0]!, "12");
    expect(onValueChange).toHaveBeenLastCalledWith(["12", ""]);
    expect(calls[1]).toEqual([{ method: "focus" }]);
  });

  it("splits a pasted value across segments and moves focus to the masked segment without filling it", async () => {
    const { refs, calls, onValueChange } = renderSegments([2, 2, 2], { masked: [2] });

    fireInput(refs[0]!, "123456");
    await Promise.resolve();
    await Promise.resolve();

    expect(onValueChange).toHaveBeenLastCalledWith(["12", "34", ""]);
    expect(calls[1]).toContainEqual(
      expect.objectContaining({ method: "setValue", params: { value: "34" } }),
    );
    expect(calls[2]).toEqual([{ method: "focus" }]);
  });

  it("renders read-only segments as text and masks their value", () => {
    render(
      <SegmentedTextInput.Root readOnly value={["12", "34", ""]}>
        <SegmentedTextInput.Segment accessibility-label="a" length={2} />
        <SegmentedTextInput.Segment accessibility-label="b" length={2} masked />
        <SegmentedTextInput.Segment accessibility-label="c" length={2} placeholder="00" />
      </SegmentedTextInput.Root>,
    );

    const root = getRenderedRoot();
    expect(root.querySelector("input")).toBeNull();
    expect(Array.from(root.querySelectorAll("text"), (text) => text.textContent)).toEqual([
      "12",
      "••",
      "00",
    ]);
  });

  it("keeps the Field focused while focus moves between segments", () => {
    vi.useFakeTimers();
    const focusedStates: boolean[] = [];
    function FieldFocusProbe() {
      focusedStates.push(useFieldContext().focused);
      return null;
    }
    const refs = [createRef<NodesRef>(), createRef<NodesRef>()];
    render(
      <FieldRoot>
        <SegmentedTextInput.Root>
          <SegmentedTextInput.Segment ref={refs[0]} accessibility-label="a" length={2} />
          <SegmentedTextInput.Segment ref={refs[1]} accessibility-label="b" length={2} />
        </SegmentedTextInput.Root>
        <FieldFocusProbe />
      </FieldRoot>,
    );

    fireNativeEvent(refs[0]!, "focus", { value: "" });
    fireNativeEvent(refs[0]!, "blur", { value: "" });
    fireNativeEvent(refs[1]!, "focus", { value: "" });
    act(() => vi.runAllTimers());
    expect(focusedStates.slice(focusedStates.indexOf(true))).not.toContain(false);

    fireNativeEvent(refs[1]!, "blur", { value: "" });
    act(() => vi.runAllTimers());
    expect(focusedStates.at(-1)).toBe(false);
    vi.useRealTimers();
  });

  it("releases the Field focus when the focused segment unmounts without a blur", () => {
    const focusedStates: boolean[] = [];
    function FieldFocusProbe() {
      focusedStates.push(useFieldContext().focused);
      return null;
    }
    const ref = createRef<NodesRef>();
    const tree = (showSecond: boolean) => (
      <FieldRoot>
        <SegmentedTextInput.Root>
          <SegmentedTextInput.Segment accessibility-label="a" length={2} />
          {showSecond ? (
            <SegmentedTextInput.Segment ref={ref} accessibility-label="b" length={2} />
          ) : null}
        </SegmentedTextInput.Root>
        <FieldFocusProbe />
      </FieldRoot>
    );
    const { rerender } = render(tree(true));

    fireNativeEvent(ref, "focus", { value: "" });
    expect(focusedStates.at(-1)).toBe(true);

    rerender(tree(false));
    expect(focusedStates.at(-1)).toBe(false);
  });
});
