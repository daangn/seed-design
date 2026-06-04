// This code includes portions derived from adobe/react-spectrum (https://github.com/adobe/react-spectrum)
// Used under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
//
// Source: packages/react-aria/test/overlays/usePreventScroll.test.js

import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { type PreventScrollOptions, usePreventScroll } from "./usePreventScroll";

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
