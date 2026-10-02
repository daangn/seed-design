import "@testing-library/jest-dom";
import { createRef, useState } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, it } from "vitest";
import { Field, useFieldContext, type UseFieldContext } from "./index.js";

function root() {
  const node = elementTree.root?.querySelector<HTMLElement>(".field");
  if (!node) throw new Error("Missing Field root");
  return node;
}

function FocusInput() {
  const { focused, disabled, readOnly, invalid, required, setFocused } = useFieldContext();
  return (
    <view
      className="input"
      bindtap={() => setFocused(!focused)}
      accessibility-traits={disabled ? "disabled" : "none"}
    >
      <text>{`focused=${focused} readOnly=${readOnly} invalid=${invalid} required=${required}`}</text>
    </view>
  );
}

describe("Field.Root", () => {
  it("shares state with nested consumers and lets them report focus", () => {
    render(
      <Field.Root className="field" required readOnly invalid disabled>
        <view>
          <FocusInput />
        </view>
      </Field.Root>,
    );

    const input = root().querySelector(".input");
    if (!input) throw new Error("Missing input");
    expect(input).toHaveAttribute("accessibility-traits", "disabled");
    expect(input).toHaveTextContent("focused=false readOnly=true invalid=true required=true");

    fireEvent.tap(input);
    expect(input).toHaveTextContent("focused=true");

    fireEvent.tap(input);
    expect(input).toHaveTextContent("focused=false");
  });

  it("keeps rootRef on the native root when the forwarded ref is replaced", () => {
    let context: UseFieldContext | null = null;
    function Capture() {
      context = useFieldContext();
      return null;
    }
    const first = createRef<NodesRef>();
    const second = createRef<NodesRef>();
    function Parent() {
      const [ref, setRef] = useState(() => first);
      return (
        <Field.Root ref={ref} className="field" bindtap={() => setRef(second)}>
          <Capture />
        </Field.Root>
      );
    }
    render(<Parent />);

    expect(first.current).toBeTruthy();
    const node = first.current;
    expect(context?.rootRef.current).toBe(node);

    fireEvent.tap(root());

    expect(first.current).toBeNull();
    // Lynx creates a new RefProxy per attach; both refs must point to the same native node.
    expect(second.current).toStrictEqual(node);
    expect(context?.rootRef.current).toBe(second.current);
  });

  it("renders unstyled Label, Description and ErrorMessage text inside Root", () => {
    render(
      <Field.Root className="field">
        <Field.Label className="label">이름</Field.Label>
        <Field.Description>설명</Field.Description>
        <Field.ErrorMessage>오류</Field.ErrorMessage>
      </Field.Root>,
    );

    const texts = [...root().querySelectorAll("text")];
    expect(texts.map((node) => node.textContent)).toEqual(["이름", "설명", "오류"]);
    expect(texts[0]).toHaveClass("label");
  });
});

describe("useFieldContext", () => {
  it("throws outside Field.Root by default and for compound parts", () => {
    function Strict() {
      useFieldContext();
      return null;
    }
    expect(() => render(<Strict />)).toThrow(/useFieldContext must be used within a FieldRoot/);
    expect(() => render(<Field.Label>이름</Field.Label>)).toThrow(/FieldRoot/);
    expect(() => render(<Field.Description>설명</Field.Description>)).toThrow(/FieldRoot/);
    expect(() => render(<Field.ErrorMessage>오류</Field.ErrorMessage>)).toThrow(/FieldRoot/);
  });

  it("returns null outside Field.Root when strict is false", () => {
    function Optional() {
      const field = useFieldContext({ strict: false });
      return <text className="optional">{field === null ? "none" : "field"}</text>;
    }
    render(<Optional />);

    expect(elementTree.root?.querySelector(".optional")).toHaveTextContent("none");
  });
});
