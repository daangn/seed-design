// this file is .vitest.tsx, not .test.tsx — so bun test won't pick it up.
//
// @floating-ui/react defers focus via requestAnimationFrame (enqueueFocus).
// bun test preloads happydom, which doesn't fire rAF the way we need.
// vitest + jsdom (pretendToBeVisual) gives us a real rAF that ticks at ~16ms,
// letting waitForFocus() actually flush the deferred .focus() calls.
//
// see vitest.config.ts for the jsdom environment setup.

/// <reference types="@testing-library/jest-dom/vitest" />

import { render, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as React from "react";

import {
  MenuRoot as Menu,
  MenuTrigger,
  MenuPositioner,
  MenuContent,
  MenuItem,
  MenuGroup,
  MenuGroupLabel,
  type MenuRootProps,
} from "./index";

type UseMenuProps = MenuRootProps;

// Flush microtasks so Floating UI position state settles.
// See: https://floating-ui.com/docs/react#testing
const waitForPositioning = () => act(async () => {});

// Flush rAF-deferred focus from FloatingFocusManager / useListNavigation.
// jsdom (pretendToBeVisual) fires rAF callbacks every ~16 ms via setInterval,
// so a short timer is needed for enqueueFocus() in @floating-ui/react to land.
const waitForFocus = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

function BasicMenu(props: UseMenuProps) {
  return (
    <Menu {...props}>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </MenuContent>
      </MenuPositioner>
    </Menu>
  );
}

function MenuWithDisabledItems(props: UseMenuProps) {
  return (
    <Menu {...props}>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
          <MenuItem disabled>Item 2 (disabled)</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </MenuContent>
      </MenuPositioner>
    </Menu>
  );
}

function MenuWithGroups() {
  return (
    <Menu>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Group 1</MenuGroupLabel>
            <MenuItem>Item A</MenuItem>
            <MenuItem>Item B</MenuItem>
          </MenuGroup>
          <MenuGroup>
            <MenuGroupLabel>Group 2</MenuGroupLabel>
            <MenuItem>Item C</MenuItem>
          </MenuGroup>
        </MenuContent>
      </MenuPositioner>
    </Menu>
  );
}

function MenuWithLabels(props: UseMenuProps) {
  return (
    <Menu {...props}>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem label="Apple">Apple</MenuItem>
          <MenuItem label="Banana">Banana</MenuItem>
          <MenuItem label="Cherry">Cherry</MenuItem>
          <MenuItem label="Dragonfruit">Dragonfruit</MenuItem>
        </MenuContent>
      </MenuPositioner>
    </Menu>
  );
}

function ControlledMenu({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Menu
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        onOpenChange(nextOpen);
      }}
    >
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
        </MenuContent>
      </MenuPositioner>
    </Menu>
  );
}

function TwoSiblingMenus({
  onMenuAOpenChange,
  onMenuBOpenChange,
}: {
  onMenuAOpenChange?: (open: boolean) => void;
  onMenuBOpenChange?: (open: boolean) => void;
} = {}) {
  return (
    <div>
      <Menu onOpenChange={onMenuAOpenChange}>
        <MenuTrigger>Trigger A</MenuTrigger>
        <MenuPositioner>
          <MenuContent>
            <MenuItem>Item A1</MenuItem>
            <MenuItem>Item A2</MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Menu>
      <Menu onOpenChange={onMenuBOpenChange}>
        <MenuTrigger>Trigger B</MenuTrigger>
        <MenuPositioner>
          <MenuContent>
            <MenuItem>Item B1</MenuItem>
            <MenuItem>Item B2</MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Menu>
    </div>
  );
}

// ===========================================================================
// Tests
// ===========================================================================

describe("useMenu", () => {
  describe("rendering & structure", () => {
    it("renders a trigger with aria-haspopup='menu'", async () => {
      const { getByText } = render(<BasicMenu />);
      await waitForPositioning();
      expect(getByText("Open Menu")).toHaveAttribute("aria-haspopup", "menu");
    });

    it("renders menu content with role='menu' when open", async () => {
      const user = userEvent.setup();
      const { getByText, getByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      expect(getByRole("menu")).toHaveAttribute("data-open");
    });

    it("renders items with role='menuitem'", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      expect(items).toHaveLength(3);
    });

    it("renders a group with role='group' and aria-labelledby pointing to group label", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<MenuWithGroups />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      const groups = getAllByRole("group");
      const labelledBy = groups[0].getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      const label = getByText("Group 1");
      expect(label).toHaveAttribute("id", labelledBy);
    });
  });

  describe("open/close state", () => {
    it("opens on trigger click", async () => {
      const user = userEvent.setup();
      const { getByText, queryByRole } = render(<BasicMenu />);
      await waitForPositioning();
      expect(queryByRole("menu")).not.toHaveAttribute("data-open");
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).toHaveAttribute("data-open");
    });

    it("closes on trigger click when open", async () => {
      const user = userEvent.setup();
      const { getByText, queryByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).toHaveAttribute("data-open");
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).not.toHaveAttribute("data-open");
    });

    it("supports controlled open state", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { getByText } = render(<ControlledMenu onOpenChange={onOpenChange} />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("supports uncontrolled with defaultOpen", async () => {
      const { queryByRole } = render(<BasicMenu defaultOpen />);
      await waitForPositioning();
      expect(queryByRole("menu")).toHaveAttribute("data-open");
    });

    it("calls onOpenChange when toggled", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { getByText } = render(<BasicMenu onOpenChange={onOpenChange} />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      expect(onOpenChange).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ reason: "trigger" }),
      );
    });

    it("closes on Escape key", async () => {
      const user = userEvent.setup();
      const { getByText, queryByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).toHaveAttribute("data-open");
      await user.keyboard("{Escape}");
      expect(queryByRole("menu")).not.toHaveAttribute("data-open");
    });

    it("closes on outside click", async () => {
      const user = userEvent.setup();
      const { getByText, queryByRole } = render(
        <div>
          <BasicMenu />
          <button type="button">Outside</button>
        </div>,
      );
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).toHaveAttribute("data-open");
      await user.click(getByText("Outside"));
      expect(queryByRole("menu")).not.toHaveAttribute("data-open");
    });

    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      const { getByText, queryByRole } = render(<BasicMenu disabled />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).not.toHaveAttribute("data-open");
    });
  });

  describe("keyboard navigation", () => {
    it("focuses the first item when opened by keyboard (ArrowDown on trigger)", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      getByText("Open Menu").focus();
      await user.keyboard("{ArrowDown}");
      await waitForFocus();
      const items = getAllByRole("menuitem");
      expect(items[0]).toHaveFocus();
    });

    it("focuses the last item when opened by ArrowUp on trigger", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      getByText("Open Menu").focus();
      await user.keyboard("{ArrowUp}");
      await waitForFocus();
      const items = getAllByRole("menuitem");
      expect(items[items.length - 1]).toHaveFocus();
    });

    it("navigates items with ArrowDown", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // No item should be focused after opening
      await user.keyboard("{ArrowDown}");
      expect(items[0]).toHaveFocus();
      await user.keyboard("{ArrowDown}");
      expect(items[1]).toHaveFocus();
    });

    it("navigates items with ArrowUp", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // No item should be focused after opening
      await user.keyboard("{ArrowUp}"); // focus last item
      expect(items[items.length - 1]).toHaveFocus();
      await user.keyboard("{ArrowUp}");
      expect(items[items.length - 2]).toHaveFocus();
    });

    it("wraps from last to first", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await waitForFocus();
      const items = getAllByRole("menuitem");
      // Navigate to last item
      await user.keyboard("{End}");
      expect(items[items.length - 1]).toHaveFocus();
      // Arrow down should wrap to first
      await user.keyboard("{ArrowDown}");
      expect(items[0]).toHaveFocus();
    });

    it("wraps from first to last", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // First item focused
      await user.keyboard("{ArrowUp}");
      expect(items[items.length - 1]).toHaveFocus();
    });

    it("navigates to first item with Home", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await waitForFocus();
      const items = getAllByRole("menuitem");
      await user.keyboard("{End}"); // go to last
      await user.keyboard("{Home}");
      expect(items[0]).toHaveFocus();
    });

    it("navigates to last item with End", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await waitForFocus();
      const items = getAllByRole("menuitem");
      await user.keyboard("{End}");
      expect(items[items.length - 1]).toHaveFocus();
    });

    it("excludes disabled items during keyboard navigation", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<MenuWithDisabledItems />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // No item should be focused after opening
      await user.keyboard("{ArrowDown}");
      expect(items[0]).toHaveFocus();
      expect(items[1]).toHaveAttribute("aria-disabled", "true");
      await user.keyboard("{ArrowDown}");
      expect(items[2]).toHaveFocus();
    });

    it("opens the menu with Enter on trigger", async () => {
      const user = userEvent.setup();
      const { getByText, queryByRole } = render(<BasicMenu />);
      await waitForPositioning();
      getByText("Open Menu").focus();
      await user.keyboard("{Enter}");
      expect(queryByRole("menu")).toHaveAttribute("data-open");
    });

    it("opens the menu with Space on trigger", async () => {
      const user = userEvent.setup();
      const { getByText, queryByRole } = render(<BasicMenu />);
      await waitForPositioning();
      getByText("Open Menu").focus();
      await user.keyboard(" ");
      expect(queryByRole("menu")).toHaveAttribute("data-open");
    });
  });

  describe("typeahead", () => {
    it("focuses item matching typed character", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<MenuWithLabels />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await waitForFocus();
      await user.keyboard("b");
      expect(getByText("Banana")).toHaveFocus();
    });

    it("resets typeahead after timeout", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<MenuWithLabels />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await waitForFocus();
      await user.keyboard("b");
      expect(getByText("Banana")).toHaveFocus();
      // Wait for typeahead reset (750ms default)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await user.keyboard("c");
      expect(getByText("Cherry")).toHaveFocus();
    });

    it("supports diacritic characters", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem label="Café">Café</MenuItem>
              <MenuItem label="Naïve">Naïve</MenuItem>
              <MenuItem label="Résumé">Résumé</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await waitForFocus();
      await user.keyboard("r");
      expect(getByText("Résumé")).toHaveFocus();
    });

    it("navigates using the label prop when provided", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem label="Alpha">Item with icon 1</MenuItem>
              <MenuItem label="Beta">Item with icon 2</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await waitForFocus();
      await user.keyboard("b");
      expect(getByText("Item with icon 2")).toHaveFocus();
    });
  });

  describe("item interaction", () => {
    it("calls onClick on item when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByText } = render(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem onClick={onClick}>Clickable</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await user.click(getByText("Clickable"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("closes menu after item click (default closeOnClick=true)", async () => {
      const user = userEvent.setup();
      const { getByText, queryByRole } = render(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem>Clickable</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await user.click(getByText("Clickable"));
      expect(queryByRole("menu")).not.toHaveAttribute("data-open");
    });

    it("activates focused item on Enter key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByText } = render(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem onClick={onClick}>Activatable</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      getByText("Activatable").focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates focused item on Space key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByText } = render(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem onClick={onClick}>Activatable</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      getByText("Activatable").focus();
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not activate disabled item on click or keyboard", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByText } = render(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem disabled onClick={onClick}>
                Disabled
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      await user.click(getByText("Disabled"));
      expect(onClick).not.toHaveBeenCalled();
      await user.keyboard("{Enter}");
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("focus management", () => {
    it("doesn't focus the first item when menu opens", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      expect(items[0]).not.toHaveFocus();
    });

    it("focuses the first item when menu opens using Enter", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      getByText("Open Menu").focus();
      await user.keyboard("{Enter}");
      await waitForFocus();
      const items = getAllByRole("menuitem");
      expect(items[0]).toHaveFocus();
    });

    it("focuses the first item when menu opens using Space", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      getByText("Open Menu").focus();
      await user.keyboard(" ");
      await waitForFocus();
      const items = getAllByRole("menuitem");
      expect(items[0]).toHaveFocus();
    });

    it("focuses the first item when menu opens using ArrowDown", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      getByText("Open Menu").focus();
      await user.keyboard("{ArrowDown}");
      await waitForFocus();
      const items = getAllByRole("menuitem");
      expect(items[0]).toHaveFocus();
    });

    it("focuses the last item when menu opens using ArrowUp", async () => {
      const user = userEvent.setup();
      const { getByText, getAllByRole } = render(<BasicMenu />);
      await waitForPositioning();
      getByText("Open Menu").focus();
      await user.keyboard("{ArrowUp}");
      await waitForFocus();
      const items = getAllByRole("menuitem");
      expect(items[items.length - 1]).toHaveFocus();
    });

    it("returns focus to trigger when menu closes via Escape", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<BasicMenu />);
      await waitForPositioning();
      const trigger = getByText("Open Menu");
      await user.click(trigger);
      await user.keyboard("{Escape}");
      expect(trigger).toHaveFocus();
    });

    it("returns focus to trigger after item selection via Enter", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<BasicMenu />);
      await waitForPositioning();
      const trigger = getByText("Open Menu");
      await user.click(trigger);

      await user.keyboard("{ArrowDown}"); // focus first item
      await user.keyboard("{Enter}"); // select first item
      expect(trigger).toHaveFocus();
    });

    it("returns focus to trigger after item selection via Space", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<BasicMenu />);
      await waitForPositioning();
      const trigger = getByText("Open Menu");
      await user.click(trigger);

      await user.keyboard("{ArrowDown}"); // focus first item
      await user.keyboard(" "); // select first item
      expect(trigger).toHaveFocus();
    });
  });

  describe("sibling menus", () => {
    it("opens Menu B after closing Menu A by clicking Trigger B", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<TwoSiblingMenus />);
      await waitForPositioning();

      // Open Menu A
      await user.click(getByText("Trigger A"));
      expect(getByText("Trigger A")).toHaveAttribute("aria-expanded", "true");

      // Click Trigger B — should close Menu A and open Menu B
      await user.click(getByText("Trigger B"));

      expect(getByText("Trigger A")).toHaveAttribute("aria-expanded", "false");
      expect(getByText("Trigger B")).toHaveAttribute("aria-expanded", "true");
    });

    it("does not cascade-dismiss Menu B when Menu A's layer is removed", async () => {
      const user = userEvent.setup();
      const onMenuBOpenChange = vi.fn();
      const { getByText } = render(<TwoSiblingMenus onMenuBOpenChange={onMenuBOpenChange} />);
      await waitForPositioning();

      // Open Menu A
      await user.click(getByText("Trigger A"));
      await waitForPositioning();

      // Click Trigger B
      await user.click(getByText("Trigger B"));
      await waitForPositioning();

      // Menu B should have been opened and NOT immediately closed
      const calls = onMenuBOpenChange.mock.calls.map((args) => args[0] as boolean);
      expect(calls).toEqual([true]);
    });

    it("opens Menu B after tapping Trigger B while Menu A is open (touch)", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<TwoSiblingMenus />);
      await waitForPositioning();

      // Open Menu A
      await user.click(getByText("Trigger A"));
      expect(getByText("Trigger A")).toHaveAttribute("aria-expanded", "true");

      // Wait for Menu A's pointerdown handler (registered via setTimeout(0))
      await act(async () => {
        await new Promise((r) => setTimeout(r, 10));
      });

      // Simulate touch tap on Trigger B.
      // userEvent.pointer doesn't fire touchstart/touchend which the drag-mode
      // handler needs, so we use fireEvent for the touch events.
      const triggerB = getByText("Trigger B");
      fireEvent.touchStart(triggerB, { touches: [{ clientX: 50, clientY: 50 }] });
      fireEvent.touchEnd(triggerB, { touches: [] });
      // After touchend, Menu A's deferToClick handler is registered.
      // The synthetic click triggers both Menu A's dismiss and Menu B's open.
      fireEvent.click(triggerB);
      await waitForPositioning();

      // Menu A should be closed, Menu B should be open
      expect(getByText("Trigger A")).toHaveAttribute("aria-expanded", "false");
      expect(getByText("Trigger B")).toHaveAttribute("aria-expanded", "true");
    });

    it("does not cascade-dismiss Menu B on touch switch (touch)", async () => {
      const user = userEvent.setup();
      const onMenuBOpenChange = vi.fn();
      const { getByText } = render(<TwoSiblingMenus onMenuBOpenChange={onMenuBOpenChange} />);
      await waitForPositioning();

      // Open Menu A
      await user.click(getByText("Trigger A"));
      await waitForPositioning();

      // Wait for Menu A's pointerdown handler
      await act(async () => {
        await new Promise((r) => setTimeout(r, 10));
      });

      // Touch tap on Trigger B (see above for why fireEvent is needed here)
      const triggerB = getByText("Trigger B");
      fireEvent.touchStart(triggerB, { touches: [{ clientX: 50, clientY: 50 }] });
      fireEvent.touchEnd(triggerB, { touches: [] });
      fireEvent.click(triggerB);
      await waitForPositioning();

      // Menu B should have opened and NOT been immediately closed by cascade dismiss
      const calls = onMenuBOpenChange.mock.calls.map((args) => args[0] as boolean);
      // If the bug exists, calls would be [true, false] (opened then cascade-dismissed)
      expect(calls).toEqual([true]);
    });

    it("keeps Menu B open and interactive after switching from Menu A", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByText } = render(
        <div>
          <Menu>
            <MenuTrigger>Trigger A</MenuTrigger>
            <MenuPositioner>
              <MenuContent>
                <MenuItem>Item A1</MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Menu>
          <Menu>
            <MenuTrigger>Trigger B</MenuTrigger>
            <MenuPositioner>
              <MenuContent>
                <MenuItem onClick={onClick}>Item B1</MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Menu>
        </div>,
      );
      await waitForPositioning();

      await user.click(getByText("Trigger A"));
      await user.click(getByText("Trigger B"));
      await waitForFocus();

      // Menu B items should be clickable
      await user.click(getByText("Item B1"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("mouse interaction", () => {
    it("activates item on mouse-up after drag from trigger", async () => {
      const onClick = vi.fn();
      const { getByText } = render(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem onClick={onClick}>Target</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await waitForPositioning();
      const trigger = getByText("Open Menu");
      // Simulate: mousedown on trigger → move to item → mouseup on item
      fireEvent.pointerDown(trigger);
      await waitForPositioning();
      // Menu should now be open
      const item = getByText("Target");
      fireEvent.pointerEnter(item);
      fireEvent.pointerUp(item);
      fireEvent.click(item);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("data attributes", () => {
    it("sets data-open on trigger when menu is open", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<BasicMenu />);
      await waitForPositioning();
      const trigger = getByText("Open Menu");
      expect(trigger).not.toHaveAttribute("data-open");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("data-open");
    });

    it("sets data-disabled on disabled items", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<MenuWithDisabledItems />);
      await waitForPositioning();
      await user.click(getByText("Open Menu"));
      expect(getByText("Item 2 (disabled)")).toHaveAttribute("data-disabled");
    });
  });
});
