// This code includes portions derived from adobe/react-spectrum (https://github.com/adobe/react-spectrum)
// Used under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
//
// Source: packages/react-aria/test/overlays/usePreventScroll.test.js

import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { type PreventScrollOptions, usePreventScroll } from "./usePreventScroll";

let ios = false;
mock.module("./utils/platform", () => ({ isIOS: () => ios }));

function Example(props: PreventScrollOptions) {
  usePreventScroll(props);
  return <div />;
}

// The standard (non-iOS) path sets `overflow: hidden` on the root element; happy-dom resolves to
// this path, so the lock state is observable via the root element's inline overflow.
const isLocked = () => document.documentElement.style.overflow === "hidden";

describe("usePreventScroll", () => {
  it("sets overflow: hidden on the root element on mount and removes it on unmount", () => {
    expect(isLocked()).toBe(false);

    const res = render(<Example />);
    expect(isLocked()).toBe(true);

    res.unmount();
    expect(isLocked()).toBe(false);
  });

  it("keeps the lock until the last of nested modals unmounts", () => {
    expect(isLocked()).toBe(false);

    const one = render(<Example />);
    expect(isLocked()).toBe(true);

    const two = render(<Example />);
    expect(isLocked()).toBe(true);

    two.unmount();
    expect(isLocked()).toBe(true);

    one.unmount();
    expect(isLocked()).toBe(false);
  });

  it("keeps the lock regardless of unmount order", () => {
    expect(isLocked()).toBe(false);

    const one = render(<Example />);
    const two = render(<Example />);
    expect(isLocked()).toBe(true);

    one.unmount();
    expect(isLocked()).toBe(true);

    two.unmount();
    expect(isLocked()).toBe(false);
  });

  it("does not lock when isDisabled is true, and releases when toggled to disabled", () => {
    expect(isLocked()).toBe(false);

    const res = render(<Example />);
    expect(isLocked()).toBe(true);

    res.rerender(<Example isDisabled />);
    expect(isLocked()).toBe(false);
  });
});

describe("usePreventScroll on iOS", () => {
  let focusDescriptor: PropertyDescriptor | undefined;

  beforeEach(() => {
    ios = true;

    // user-event leaves `focus` as a getter-only accessor, which the iOS path's assignment can't override.
    focusDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "focus");
    Object.defineProperty(HTMLElement.prototype, "focus", {
      configurable: true,
      writable: true,
      value: HTMLElement.prototype.focus,
    });
  });

  afterEach(() => {
    ios = false;

    if (focusDescriptor) Object.defineProperty(HTMLElement.prototype, "focus", focusDescriptor);
  });

  function touch(type: "touchstart" | "touchmove", x: number, y: number) {
    const target = document.body;
    const point = new Touch({ identifier: 0, target, clientX: x, clientY: y });
    const event = new TouchEvent(type, {
      bubbles: true,
      cancelable: true,
      touches: [point],
      changedTouches: [point],
    });
    target.dispatchEvent(event);

    return event;
  }

  it("leaves touchmove within the tap slop alone so WebKit still synthesizes the click", () => {
    const res = render(<Example />);

    touch("touchstart", 100, 100);
    // Within the slop on each axis, although the straight-line distance (~11.3px) is past it.
    expect(touch("touchmove", 108, 108).defaultPrevented).toBe(false);

    res.unmount();
  });

  it("prevents touchmove past the tap slop, and keeps preventing after moving back", () => {
    const res = render(<Example />);

    touch("touchstart", 100, 100);
    expect(touch("touchmove", 100, 112).defaultPrevented).toBe(true);
    expect(touch("touchmove", 100, 101).defaultPrevented).toBe(true);

    touch("touchstart", 100, 100);
    expect(touch("touchmove", 101, 101).defaultPrevented).toBe(false);

    res.unmount();
  });
});
