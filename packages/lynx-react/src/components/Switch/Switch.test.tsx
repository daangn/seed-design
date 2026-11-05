import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Switch } from "./index";

function getSwitchRoot(container: HTMLElement) {
  const root = container.querySelector<HTMLElement>(".seed-switch__root");

  if (!root) {
    throw new Error("Expected Switch root to exist.");
  }

  return root;
}

describe("Switch", () => {
  afterEach(() => vi.restoreAllMocks());

  it("derives a root name and hides its label text", () => {
    const { container } = render(
      <Switch.Root>
        <Switch.Label>알림</Switch.Label>
        <Switch.Label>받기</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>,
    );

    const root = getSwitchRoot(container);
    expect(root).toHaveAttribute("accessibility-label", "알림 받기");
    expect(root.querySelector(".seed-switch__label")).toHaveAttribute(
      "accessibility-element",
      "false",
    );
    expect(root.querySelector(".seed-switch__label")).toHaveAttribute(
      "accessibility-elements-hidden",
      "true",
    );
    expect(root.querySelector(".seed-switchmark__root")).toHaveAttribute("flatten", "false");
  });

  it("preserves explicit names and native label visibility", () => {
    const { container, rerender } = render(
      <Switch.Root accessibility-label="사용자 이름">
        <Switch.Label accessibility-element accessibility-elements-hidden={false}>
          알림
        </Switch.Label>
      </Switch.Root>,
    );
    const root = getSwitchRoot(container);
    expect(root).toHaveAttribute("accessibility-label", "사용자 이름");
    expect(root.querySelector(".seed-switch__label")).toHaveAttribute(
      "accessibility-element",
      "true",
    );
    expect(root.querySelector(".seed-switch__label")).toHaveAttribute(
      "accessibility-elements-hidden",
      "false",
    );

    rerender(
      <Switch.Root accessibility-element={false}>
        <Switch.Label>알림</Switch.Label>
      </Switch.Root>,
    );
    expect(getSwitchRoot(container)).toHaveAttribute("accessibility-label", "알림");
    expect(getSwitchRoot(container).querySelector(".seed-switch__label")).not.toHaveAttribute(
      "accessibility-elements-hidden",
    );
  });

  it("warns only for an unnamed standalone accessibility element", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container, rerender } = render(<Switch.Root />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
    warn.mockClear();

    rerender(
      <Switch.Root>
        <text>알림</text>
      </Switch.Root>,
    );
    expect(getSwitchRoot(container)).not.toHaveAttribute("accessibility-label");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
    warn.mockClear();

    rerender(<Switch.Root accessibility-element={false} />);
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
    rerender(
      <Switch.Root accessibility-label="외부 이름">
        <Switch.Root />
      </Switch.Root>,
    );
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
  });

  it("exposes switch accessibility state and preserves toggling", () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Switch.Root accessibility-label="알림" onCheckedChange={onCheckedChange}>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>,
    );

    const root = getSwitchRoot(container);

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-role-description", "switch");
    expect(root).toHaveAttribute("accessibility-label", "알림");
    expect(root).toHaveAttribute("accessibility-value", "not checked");

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(root).toHaveAttribute("accessibility-value", "checked");
  });

  it("exposes the disabled state and ignores taps", () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Switch.Root
        accessibility-label="알림"
        defaultChecked
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    const root = getSwitchRoot(container);

    expect(root).toHaveAttribute("accessibility-value", "checked");
    expect(root).toHaveAttribute("accessibility-traits", "disabled");

    fireEvent.tap(root);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).toHaveAttribute("accessibility-value", "checked");
  });
});
