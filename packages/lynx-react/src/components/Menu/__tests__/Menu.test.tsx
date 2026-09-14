import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { MenuRoot, MenuItem, MenuItemLabel } from "../Menu";

describe("Menu item feedback", () => {
  it("scales the inner content while preserving item callbacks and disabled gating", () => {
    const onTap = vi.fn();
    const { getByText, rerender } = render(
      <MenuRoot>
        <MenuItem bindtap={onTap}>
          <MenuItemLabel>Choose</MenuItemLabel>
        </MenuItem>
      </MenuRoot>,
    );
    const label = getByText("Choose") as HTMLElement;
    const target = label.parentElement!;
    const root = target.parentElement!;
    expect(target).toHaveClass("seed-menu-item__scaleContent");
    expect(target).toHaveAttribute("flatten", "false");
    expect(target).not.toContainElement(root.querySelector(".seed-menu-item__pressedOverlay"));
    fireEvent.tap(root);
    expect(onTap).toHaveBeenCalledTimes(1);
    rerender(
      <MenuRoot>
        <MenuItem disabled bindtap={onTap}>
          <MenuItemLabel>Choose</MenuItemLabel>
        </MenuItem>
      </MenuRoot>,
    );
    fireEvent.tap((getByText("Choose") as HTMLElement).parentElement!.parentElement!);
    expect(onTap).toHaveBeenCalledTimes(1);
  });
});
