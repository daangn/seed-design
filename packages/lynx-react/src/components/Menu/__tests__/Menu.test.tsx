import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  MenuContent,
  MenuItem,
  MenuItemLabel,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "../Menu";
import { ActionButton } from "../../ActionButton";

describe("Menu item feedback", () => {
  it("owns the trigger name and state instead of exposing its nested button twice", () => {
    const { container } = render(
      <MenuRoot>
        <MenuTrigger id="menu-trigger">
          <ActionButton>열기</ActionButton>
        </MenuTrigger>
      </MenuRoot>,
    );
    const trigger = container.querySelector("#menu-trigger");
    const button = trigger?.querySelector(".seed-action-button__root");

    expect(trigger).toHaveAttribute("accessibility-label", "열기");
    expect(trigger).toHaveAttribute("accessibility-value", "collapsed");
    expect(trigger).toHaveAttribute("flatten", "false");
    expect(button).toHaveAttribute("accessibility-element", "false");
    expect(button).not.toHaveAttribute("accessibility-label");
    fireEvent.tap(trigger!);
    expect(trigger).toHaveAttribute("accessibility-value", "expanded");
  });

  it("preserves a custom trigger name and native defaults override", () => {
    const { container } = render(
      <MenuRoot>
        <MenuTrigger id="menu-trigger" accessibility-label="작업 메뉴" flatten={true}>
          <ActionButton>열기</ActionButton>
        </MenuTrigger>
      </MenuRoot>,
    );

    expect(container.querySelector("#menu-trigger")).toHaveAttribute(
      "accessibility-label",
      "작업 메뉴",
    );
    expect(container.querySelector("#menu-trigger")).toHaveAttribute("flatten", "true");
  });

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
    // Android drops flattened accessibility elements from the native tree.
    expect(root).toHaveAttribute("flatten", "false");
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

  it("tags the menu surface and items with the size they draw", () => {
    const { container, rerender } = render(
      <MenuRoot defaultOpen>
        <MenuPositioner>
          <MenuContent>
            <MenuItem>
              <MenuItemLabel>Edit</MenuItemLabel>
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>,
    );
    expect(container.querySelector(".seed-menu__content")).toHaveAttribute(
      "lynx-test-tag",
      "seed:Menu;size=medium",
    );
    expect(container.querySelector(".seed-menu-item__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:MenuItem;size=medium;tone=neutral",
    );

    rerender(
      <MenuRoot defaultOpen size="small">
        <MenuPositioner>
          <MenuContent lynx-test-tag="listing-menu">
            <MenuItem tone="critical" disabled>
              <MenuItemLabel>Delete</MenuItemLabel>
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>,
    );
    expect(container.querySelector(".seed-menu__content")).toHaveAttribute(
      "lynx-test-tag",
      "listing-menu",
    );
    expect(container.querySelector(".seed-menu-item__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:MenuItem;size=small;tone=critical",
    );
  });
});
