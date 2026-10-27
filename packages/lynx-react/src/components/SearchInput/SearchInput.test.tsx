import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SearchInput } from "./index";

function getRenderedRoot() {
  const root = elementTree.root;
  if (!root) throw new Error("Expected Lynx render root to exist.");
  return root;
}

function fireNativeEvent(nativeRef: NodesRef, element: Element, eventName: string, detail: object) {
  const EventConstructor = element.ownerDocument.defaultView?.CustomEvent;
  if (!EventConstructor) throw new Error("Expected CustomEvent constructor to exist.");

  const event = new EventConstructor(`bindEvent:${eventName}`, { bubbles: true, detail });
  Object.assign(event, { eventType: "bindEvent", eventName });
  fireEvent(nativeRef as unknown as Element, event);
}

function mockInvoke(ref: { current: NodesRef | null }) {
  if (!ref.current) throw new Error("Expected native ref to exist.");
  const invoke = vi.fn(() => ({ exec: vi.fn() }));
  ref.current.invoke = invoke as unknown as NodesRef["invoke"];
  return invoke;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SearchInput", () => {
  it("submits the confirmed value and blurs the input", () => {
    const onSubmit = vi.fn();
    const inputRef = createRef<NodesRef>();
    render(
      <SearchInput.Root onSubmit={onSubmit}>
        <SearchInput.Input ref={inputRef} accessibility-label="검색" />
      </SearchInput.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");
    expect(input).toHaveAttribute("confirm-type", "search");
    expect(input).toHaveAttribute("confirm-enter", "false");
    expect(input).toHaveClass("seed-search-input__value");

    const invoke = mockInvoke(inputRef);
    fireNativeEvent(inputRef.current, input, "confirm", { value: "당근" });

    expect(onSubmit).toHaveBeenCalledWith("당근");
    expect(invoke).toHaveBeenCalledWith(expect.objectContaining({ method: "blur" }));
  });

  it("keeps the focus after submit with blurOnSubmit={false}", () => {
    const onSubmit = vi.fn();
    const inputRef = createRef<NodesRef>();
    render(
      <SearchInput.Root onSubmit={onSubmit} blurOnSubmit={false}>
        <SearchInput.Input ref={inputRef} accessibility-label="검색" />
      </SearchInput.Root>,
    );

    const input = getRenderedRoot().querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");
    // iOS and Android blur the input on confirm unless `confirm-enter` is set.
    expect(input).toHaveAttribute("confirm-enter", "true");
    const invoke = mockInvoke(inputRef);
    fireNativeEvent(inputRef.current, input, "confirm", { value: "당근" });

    expect(onSubmit).toHaveBeenCalledWith("당근");
    expect(invoke).not.toHaveBeenCalled();
  });

  it("clears an uncontrolled value and renders the clear button only while filled", () => {
    const onValueChange = vi.fn();
    const inputRef = createRef<NodesRef>();
    render(
      <SearchInput.Root onValueChange={onValueChange}>
        <SearchInput.Input ref={inputRef} accessibility-label="검색" />
        <SearchInput.ClearButton accessibility-label="지우기" />
      </SearchInput.Root>,
    );

    const root = getRenderedRoot();
    const input = root.querySelector("input");
    if (!input || !inputRef.current) throw new Error("Expected native input to exist.");
    expect(root.querySelector(".seed-search-input__clearButton")).toBeNull();

    fireNativeEvent(inputRef.current, input, "input", {
      value: "당근",
      selectionStart: 2,
      selectionEnd: 2,
    });
    expect(onValueChange).toHaveBeenLastCalledWith("당근");

    const clearButton = root.querySelector(".seed-search-input__clearButton");
    if (!clearButton) throw new Error("Expected clear button to render.");
    expect(clearButton).toHaveAttribute("accessibility-traits", "button");
    expect(clearButton).toHaveAttribute("accessibility-label", "지우기");
    // Tapping the button must not take the focus away from the input.
    expect(clearButton).toHaveAttribute("ignore-focus", "true");

    const invoke = mockInvoke(inputRef);
    fireEvent.tap(clearButton);

    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(invoke).toHaveBeenCalledWith(
      expect.objectContaining({ method: "setValue", params: { value: "" } }),
    );
    expect(invoke).not.toHaveBeenCalledWith(expect.objectContaining({ method: "blur" }));
    expect(root.querySelector(".seed-search-input__clearButton")).toBeNull();
  });

  it("does not focus an input that was not focused before clearing", () => {
    const inputRef = createRef<NodesRef>();
    render(
      <SearchInput.Root defaultValue="당근">
        <SearchInput.Input ref={inputRef} accessibility-label="검색" />
        <SearchInput.ClearButton accessibility-label="지우기" />
      </SearchInput.Root>,
    );

    const root = getRenderedRoot();
    const input = root.querySelector("input");
    const clearButton = root.querySelector(".seed-search-input__clearButton");
    if (!input || !inputRef.current || !clearButton) throw new Error("Expected parts to exist.");
    const invoke = mockInvoke(inputRef);

    // Blurred for another reason right before the tap.
    fireNativeEvent(inputRef.current, input, "focus", {});
    fireNativeEvent(inputRef.current, input, "blur", { value: "당근" });
    fireEvent.touchstart(clearButton);
    fireEvent.tap(clearButton);

    expect(invoke).not.toHaveBeenCalledWith(expect.objectContaining({ method: "focus" }));
  });

  it("warns when the input or the clear button has no accessibility-label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <SearchInput.Root defaultValue="당근">
        <SearchInput.Input />
        <SearchInput.ClearButton />
      </SearchInput.Root>,
    );

    expect(warn).toHaveBeenCalledWith(expect.stringContaining("SearchInputInput"));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("SearchInputClearButton"));
  });
});
