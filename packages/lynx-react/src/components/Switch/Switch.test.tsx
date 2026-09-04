import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./index";

function getSwitchRoot(container: HTMLElement) {
  const root = container.querySelector<HTMLElement>(".seed-switch__root");

  if (!root) {
    throw new Error("Expected Switch root to exist.");
  }

  return root;
}

describe("Switch", () => {
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
      <Switch.Root defaultChecked disabled onCheckedChange={onCheckedChange} />,
    );

    const root = getSwitchRoot(container);

    expect(root).toHaveAttribute("accessibility-value", "checked");
    expect(root).toHaveAttribute("accessibility-traits", "disabled");

    fireEvent.tap(root);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).toHaveAttribute("accessibility-value", "checked");
  });
});
