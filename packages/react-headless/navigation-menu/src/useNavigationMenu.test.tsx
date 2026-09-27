import { FocusScope } from "@radix-ui/react-focus-scope";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";
import type * as React from "react";
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

function GroupHarness() {
  return (
    <NavigationMenu.Provider>
      <NavigationMenu.Root value="products">
        <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
        <NavigationMenu.Positioner>
          <NavigationMenu.Content>
            <NavigationMenu.Group>
              <NavigationMenu.GroupLabel>Group One</NavigationMenu.GroupLabel>
              <NavigationMenu.Item>Item A</NavigationMenu.Item>
            </NavigationMenu.Group>
            <NavigationMenu.Group>
              <NavigationMenu.Item>Item B</NavigationMenu.Item>
            </NavigationMenu.Group>
          </NavigationMenu.Content>
        </NavigationMenu.Positioner>
      </NavigationMenu.Root>
    </NavigationMenu.Provider>
  );
}

describe("useNavigationMenu (group labelling)", () => {
  it("labels a group via aria-labelledby resolving to the rendered group label", () => {
    render(<GroupHarness />);

    const labelledGroup = document.querySelectorAll('[role="group"]')[0];
    const labelledBy = labelledGroup.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();

    const label = document.getElementById(labelledBy ?? "");
    expect(label).not.toBeNull();
    expect(label?.textContent).toBe("Group One");
  });

  it("does not set a dangling aria-labelledby on a group without a label", () => {
    render(<GroupHarness />);

    const unlabeledGroup = document.querySelectorAll('[role="group"]')[1];
    expect(unlabeledGroup).not.toHaveAttribute("aria-labelledby");
  });
});

// Flush rAF-deferred focus from FloatingFocusManager. happy-dom mocks rAF with
// setImmediate, so a short timer is needed for the focus to land.
const waitForFocus = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

// Stands in for Dialog, Drawer and AppScreen, which are thin wrappers over this scope.
function TrappedAncestor({ children }: { children: React.ReactNode }) {
  return (
    <FocusScope trapped onMountAutoFocus={(event) => event.preventDefault()}>
      {children}
    </FocusScope>
  );
}

describe("useNavigationMenu (trapped ancestor)", () => {
  it("moves focus into the flyout opened by keyboard", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <TrappedAncestor>
        <Harness />
      </TrappedAncestor>,
    );

    getByText("Products").focus();
    await user.keyboard("{Enter}");
    await waitForFocus();

    expect(getByText("Item A")).toHaveFocus();
  });

  it("lets a trapped ancestor resume once closed", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <>
        <button type="button">Outside</button>
        <TrappedAncestor>
          <Harness />
        </TrappedAncestor>
      </>,
    );

    getByText("Products").focus();
    await user.keyboard("{Enter}");
    await waitForFocus();
    await user.keyboard("{Escape}");
    await waitForFocus();

    // With the ancestor trap active again, focus cannot settle outside its container.
    act(() => getByText("Outside").focus());
    expect(getByText("Outside")).not.toHaveFocus();
  });
});
