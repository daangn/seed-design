import * as FloatingUI from "@floating-ui/react";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";
import type * as React from "react";
import { NavigationMenu } from "./index";
import type { UseNavigationMenuProps } from "./useNavigationMenu";

const actualFloatingUI = { ...FloatingUI };

let setups = 0;
let teardowns = 0;

mock.module("@floating-ui/react", () => ({
  ...actualFloatingUI,
  autoUpdate: (...args: Parameters<typeof actualFloatingUI.autoUpdate>) => {
    setups += 1;
    const cleanup = actualFloatingUI.autoUpdate(...args);

    return () => {
      teardowns += 1;
      cleanup();
    };
  },
}));

// Module mocks outlive this file and `mock.restore()` leaves them in place, so hand the
// real exports back to the test files that run after this one.
afterAll(() => {
  mock.module("@floating-ui/react", () => actualFloatingUI);
});

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

describe("useNavigationMenu (safe area)", () => {
  // Collision padding is read back from these declarations as px, so a positioner that
  // loses them positions against the bare viewport edge again.
  it("re-declares every safe-area inset on the positioner", async () => {
    const { getByTestId } = render(
      <NavigationMenu.Provider>
        <NavigationMenu.Root value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Positioner data-testid="positioner">
            <NavigationMenu.Content>
              <NavigationMenu.Item>Item A</NavigationMenu.Item>
            </NavigationMenu.Content>
          </NavigationMenu.Positioner>
        </NavigationMenu.Root>
      </NavigationMenu.Provider>,
    );
    await act(async () => {});

    const { style } = getByTestId("positioner");
    for (const side of ["top", "right", "bottom", "left"]) {
      expect(style.getPropertyValue(`--seed-safe-area-${side}`)).toBe(
        `env(safe-area-inset-${side})`,
      );
    }
  });
});

function PositionedHarness({ value }: { value: string | null }) {
  return (
    <NavigationMenu.Provider value={value}>
      <NavigationMenu.Root value="products">
        <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
        <NavigationMenu.Positioner data-testid="positioner">
          <NavigationMenu.Content>
            <NavigationMenu.Item>Item A</NavigationMenu.Item>
          </NavigationMenu.Content>
        </NavigationMenu.Positioner>
      </NavigationMenu.Root>
    </NavigationMenu.Provider>
  );
}

// happy-dom has no layout, so stand in for a page scroll that carries the trigger elsewhere.
function scrollTriggerTo(trigger: HTMLElement, top: number) {
  trigger.getBoundingClientRect = () => new DOMRect(0, top, 40, 20);
  window.dispatchEvent(new Event("scroll"));
}

describe("useNavigationMenu (autoUpdate lifecycle)", () => {
  beforeEach(() => {
    setups = 0;
    teardowns = 0;
  });

  it("keeps one autoUpdate subscription across position updates", async () => {
    const { getByText, getByTestId } = render(<PositionedHarness value="products" />);
    const positioner = getByTestId("positioner");

    await waitFor(() => expect(positioner).toHaveAttribute("data-open"));
    expect(setups - teardowns).toBe(1);

    const counts = { setups, teardowns };
    const transform = positioner.style.transform;

    scrollTriggerTo(getByText("Products"), 200);

    await waitFor(() => expect(positioner.style.transform).not.toBe(transform));
    expect({ setups, teardowns }).toEqual(counts);
  });

  it("keeps autoUpdate through the exit transition and stops once it finishes", async () => {
    const { getByTestId, rerender } = render(<PositionedHarness value="products" />);
    const positioner = getByTestId("positioner");
    await waitFor(() => expect(positioner).toHaveAttribute("data-open"));

    rerender(<PositionedHarness value={null} />);
    expect(positioner).not.toHaveAttribute("data-hidden");
    expect(setups - teardowns).toBe(1);

    await waitFor(() => {
      expect(positioner).toHaveAttribute("data-hidden");
      expect(setups - teardowns).toBe(0);
    });
  });
});
