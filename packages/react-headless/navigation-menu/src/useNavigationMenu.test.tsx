import { FocusScope } from "@radix-ui/react-focus-scope";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
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

const safeAreaObservers = new Set<FakeResizeObserver>();

class FakeResizeObserver implements ResizeObserver {
  readonly targets: Element[] = [];

  constructor(private readonly callback: ResizeObserverCallback) {
    safeAreaObservers.add(this);
  }

  observe(target: Element) {
    this.targets.push(target);
  }

  unobserve() {}

  disconnect() {
    safeAreaObservers.delete(this);
  }

  report() {
    this.callback([], this);
  }
}

// autoUpdate도 ResizeObserver를 쓰므로, safe area sentinel(body 바로 아래 aria-hidden 요소의
// 자식)을 관찰하는 observer에게만 보고해요.
function reportSafeAreaSentinel() {
  for (const observer of safeAreaObservers) {
    const watchesSentinel = observer.targets.some(
      (target) =>
        target.parentElement?.getAttribute("aria-hidden") === "true" &&
        target.parentElement.parentElement === document.body,
    );
    if (watchesSentinel) act(() => observer.report());
  }
}

describe("useNavigationMenu (safe area re-read)", () => {
  const originalResizeObserver = window.ResizeObserver;

  beforeAll(() => {
    window.ResizeObserver = FakeResizeObserver;
    // happy-dom은 layout이 없어 viewport가 0×0이라, 가용 높이를 잴 수 있게 크기를 줘요.
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: 768,
    });
  });

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
    Reflect.deleteProperty(document.documentElement, "clientWidth");
    Reflect.deleteProperty(document.documentElement, "clientHeight");
  });

  it("reads the current inset when it opens and when an inset changes while open", async () => {
    function Probe({ open }: { open: boolean }) {
      return (
        <NavigationMenu.Provider value={open ? "products" : null}>
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

    const { getByTestId, rerender } = render(<Probe open={false} />);
    await act(async () => {});
    const positioner = getByTestId("positioner");
    const getAvailableHeight = () =>
      Number.parseFloat(positioner.style.getPropertyValue("--seed-menu-available-height"));

    positioner.style.setProperty("--seed-safe-area-bottom", "0px");
    rerender(<Probe open />);
    await act(async () => {});
    reportSafeAreaSentinel();
    const withoutInset = getAvailableHeight();

    rerender(<Probe open={false} />);
    await act(async () => {});
    positioner.style.setProperty("--seed-safe-area-bottom", "34px");
    rerender(<Probe open />);
    await act(async () => {});
    expect(getAvailableHeight()).toBe(withoutInset - 34);

    positioner.style.setProperty("--seed-safe-area-bottom", "58px");
    reportSafeAreaSentinel();
    await act(async () => {});
    expect(getAvailableHeight()).toBe(withoutInset - 58);
  });
});
