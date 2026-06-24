import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";
import { NavigationMenu } from "./index";
import type { UseNavigationMenuProps } from "./useNavigationMenu";

function Harness(props: UseNavigationMenuProps) {
  return (
    <NavigationMenu.Provider {...props}>
      <NavigationMenu.Root value="products">
        <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
        <NavigationMenu.Positioner>
          <NavigationMenu.Content>
            <NavigationMenu.Item current>Item A</NavigationMenu.Item>
            <NavigationMenu.Item>Item B</NavigationMenu.Item>
          </NavigationMenu.Content>
        </NavigationMenu.Positioner>
      </NavigationMenu.Root>
    </NavigationMenu.Provider>
  );
}

describe("useNavigationMenu (disclosure semantics)", () => {
  it("wires disclosure aria attributes and uses no menu role", () => {
    const { getByText } = render(<Harness />);
    const trigger = getByText("Products");

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-haspopup");

    const contentId = trigger.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();
    const content = document.getElementById(contentId ?? "");
    expect(content).not.toBeNull();
    expect(content).toHaveAttribute("aria-labelledby", trigger.id);

    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.querySelector('[role="menuitem"]')).toBeNull();
  });

  it("marks the current item with aria-current=page", () => {
    const { getByText } = render(<Harness />);
    expect(getByText("Item A")).toHaveAttribute("aria-current", "page");
    expect(getByText("Item B")).not.toHaveAttribute("aria-current");
  });

  it("opens and closes on trigger click", async () => {
    const user = userEvent.setup();
    const { getByText } = render(<Harness />);
    const trigger = getByText("Products");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens via keyboard (Enter) on the trigger", async () => {
    const user = userEvent.setup();
    const { getByText } = render(<Harness />);
    const trigger = getByText("Products");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const { getByText } = render(<Harness />);
    const trigger = getByText("Products");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("supports a controlled open value", () => {
    const { getByText } = render(<Harness value="products" />);
    expect(getByText("Products")).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the flyout when an item is selected", async () => {
    const user = userEvent.setup();
    const { getByText } = render(<Harness />);
    const trigger = getByText("Products");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(getByText("Item A"));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
