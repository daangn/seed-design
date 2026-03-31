import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";

import type { ReactElement } from "react";
import * as React from "react";

import {
  MenuRoot as Menu,
  MenuTrigger,
  MenuPositioner,
  MenuContent,
  MenuItem,
  MenuGroup,
  MenuGroupLabel,
  MenuDivider,
  type MenuRootProps,
} from "./index";

// ---------------------------------------------------------------------------
// Test Helpers
// ---------------------------------------------------------------------------

type UseMenuProps = MenuRootProps;

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

// ---------------------------------------------------------------------------
// Common test fixtures
// ---------------------------------------------------------------------------

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
          <MenuDivider />
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

// ===========================================================================
// Tests
// ===========================================================================

describe("useMenu", () => {
  // -------------------------------------------------------------------------
  // Rendering & Structure
  // -------------------------------------------------------------------------
  describe("rendering & structure", () => {
    it("renders a trigger with aria-haspopup='menu'", () => {
      const { getByText } = setUp(<BasicMenu />);
      const trigger = getByText("Open Menu");
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    });

    it("renders menu content with role='menu' when open", async () => {
      const { getByText, getByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      expect(getByRole("menu")).toBeInTheDocument();
    });

    it("renders items with role='menuitem'", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      expect(items).toHaveLength(3);
    });

    it("renders a separator with role='separator'", async () => {
      const { getByText, getByRole, user } = setUp(<MenuWithGroups />);
      await user.click(getByText("Open Menu"));
      expect(getByRole("separator")).toBeInTheDocument();
    });

    it("renders a group with role='group' and aria-labelledby pointing to group label", async () => {
      const { getByText, getAllByRole, user } = setUp(<MenuWithGroups />);
      await user.click(getByText("Open Menu"));
      const groups = getAllByRole("group");
      const labelledBy = groups[0].getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      const label = getByText("Group 1");
      expect(label).toHaveAttribute("id", labelledBy);
    });
  });

  // -------------------------------------------------------------------------
  // Open/Close State
  // -------------------------------------------------------------------------
  describe("open/close state", () => {
    it("opens on trigger click", async () => {
      const { getByText, queryByRole, user } = setUp(<BasicMenu />);
      expect(queryByRole("menu")).not.toBeInTheDocument();
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).toBeInTheDocument();
    });

    it("closes on trigger click when open", async () => {
      const { getByText, queryByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).toBeInTheDocument();
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).not.toBeInTheDocument();
    });

    it("supports controlled open state", async () => {
      const onOpenChange = mock();
      const { getByText, user } = setUp(<ControlledMenu onOpenChange={onOpenChange} />);
      await user.click(getByText("Open Menu"));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("supports uncontrolled with defaultOpen", () => {
      const { queryByRole } = setUp(<BasicMenu defaultOpen />);
      expect(queryByRole("menu")).toBeInTheDocument();
    });

    it("calls onOpenChange when toggled", async () => {
      const onOpenChange = mock();
      const { getByText, user } = setUp(<BasicMenu onOpenChange={onOpenChange} />);
      await user.click(getByText("Open Menu"));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("closes on Escape key", async () => {
      const { getByText, queryByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes on outside click", async () => {
      const { getByText, queryByRole, user } = setUp(
        <div>
          <BasicMenu />
          <button type="button">Outside</button>
        </div>,
      );
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).toBeInTheDocument();
      await user.click(getByText("Outside"));
      expect(queryByRole("menu")).not.toBeInTheDocument();
    });

    it("does not open when disabled", async () => {
      const { getByText, queryByRole, user } = setUp(<BasicMenu disabled />);
      await user.click(getByText("Open Menu"));
      expect(queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Keyboard Navigation
  // -------------------------------------------------------------------------
  describe("keyboard navigation", () => {
    it("focuses the first item when opened by keyboard (ArrowDown on trigger)", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      getByText("Open Menu").focus();
      await user.keyboard("{ArrowDown}");
      const items = getAllByRole("menuitem");
      expect(items[0]).toHaveFocus();
    });

    it("focuses the last item when opened by ArrowUp on trigger", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      getByText("Open Menu").focus();
      await user.keyboard("{ArrowUp}");
      const items = getAllByRole("menuitem");
      expect(items[items.length - 1]).toHaveFocus();
    });

    it("navigates items with ArrowDown", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // First item should be focused after opening
      await user.keyboard("{ArrowDown}");
      expect(items[1]).toHaveFocus();
    });

    it("navigates items with ArrowUp", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // Navigate down first, then back up
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");
      expect(items[0]).toHaveFocus();
    });

    it("wraps from last to first", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // Navigate to last item
      await user.keyboard("{End}");
      expect(items[items.length - 1]).toHaveFocus();
      // Arrow down should wrap to first
      await user.keyboard("{ArrowDown}");
      expect(items[0]).toHaveFocus();
    });

    it("wraps from first to last", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // First item focused
      await user.keyboard("{ArrowUp}");
      expect(items[items.length - 1]).toHaveFocus();
    });

    it("navigates to first item with Home", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      await user.keyboard("{End}"); // go to last
      await user.keyboard("{Home}");
      expect(items[0]).toHaveFocus();
    });

    it("navigates to last item with End", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      await user.keyboard("{End}");
      expect(items[items.length - 1]).toHaveFocus();
    });

    it("includes disabled items during keyboard navigation (focused but not interactive)", async () => {
      const { getByText, getAllByRole, user } = setUp(<MenuWithDisabledItems />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // Navigate through all items including disabled
      await user.keyboard("{ArrowDown}");
      expect(items[1]).toHaveFocus(); // disabled item still receives focus
      expect(items[1]).toHaveAttribute("aria-disabled", "true");
    });

    it("opens the menu with Enter on trigger", async () => {
      const { getByText, queryByRole, user } = setUp(<BasicMenu />);
      getByText("Open Menu").focus();
      await user.keyboard("{Enter}");
      expect(queryByRole("menu")).toBeInTheDocument();
    });

    it("opens the menu with Space on trigger", async () => {
      const { getByText, queryByRole, user } = setUp(<BasicMenu />);
      getByText("Open Menu").focus();
      await user.keyboard(" ");
      expect(queryByRole("menu")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Typeahead
  // -------------------------------------------------------------------------
  describe("typeahead", () => {
    it("highlights item matching typed character", async () => {
      const { getByText, user } = setUp(<MenuWithLabels />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("b");
      expect(getByText("Banana")).toHaveAttribute("data-highlighted");
    });

    it("resets typeahead after timeout", async () => {
      const { getByText, user } = setUp(<MenuWithLabels />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("b");
      expect(getByText("Banana")).toHaveAttribute("data-highlighted");
      // Wait for typeahead reset (typically 350-500ms)
      await new Promise((resolve) => setTimeout(resolve, 600));
      await user.keyboard("c");
      expect(getByText("Cherry")).toHaveAttribute("data-highlighted");
    });

    it("supports diacritic characters", async () => {
      const { getByText, user } = setUp(
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
      await user.click(getByText("Open Menu"));
      await user.keyboard("r");
      expect(getByText("Résumé")).toHaveAttribute("data-highlighted");
    });

    it("does not trigger item onClick when Space is pressed during typeahead", async () => {
      const onClick = mock();
      const { getByText, user } = setUp(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem label="A B" onClick={onClick}>
                A B
              </MenuItem>
              <MenuItem label="CD">CD</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await user.click(getByText("Open Menu"));
      // Type "a" then space — should continue typeahead for "a b", not trigger click
      await user.keyboard("a");
      await user.keyboard(" ");
      expect(onClick).not.toHaveBeenCalled();
    });

    it("navigates using the label prop when provided", async () => {
      const { getByText, user } = setUp(
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
      await user.click(getByText("Open Menu"));
      await user.keyboard("b");
      expect(getByText("Item with icon 2")).toHaveAttribute("data-highlighted");
    });
  });

  // -------------------------------------------------------------------------
  // Item Interaction
  // -------------------------------------------------------------------------
  describe("item interaction", () => {
    it("calls onClick on item when clicked", async () => {
      const onClick = mock();
      const { getByText, user } = setUp(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem onClick={onClick}>Clickable</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await user.click(getByText("Open Menu"));
      await user.click(getByText("Clickable"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("closes menu after item click (default closeOnClick=true)", async () => {
      const { getByText, queryByRole, user } = setUp(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem>Clickable</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await user.click(getByText("Open Menu"));
      await user.click(getByText("Clickable"));
      expect(queryByRole("menu")).not.toBeInTheDocument();
    });

    it("activates item on Enter key", async () => {
      const onClick = mock();
      const { getByText, user } = setUp(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem onClick={onClick}>Activatable</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await user.click(getByText("Open Menu"));
      // First item should be focused
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates item on Space key", async () => {
      const onClick = mock();
      const { getByText, user } = setUp(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem onClick={onClick}>Activatable</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      await user.click(getByText("Open Menu"));
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not activate disabled item on click or keyboard", async () => {
      const onClick = mock();
      const { getByText, user } = setUp(
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
      await user.click(getByText("Open Menu"));
      await user.click(getByText("Disabled"));
      expect(onClick).not.toHaveBeenCalled();
      await user.keyboard("{Enter}");
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Focus Management
  // -------------------------------------------------------------------------
  describe("focus management", () => {
    it("focuses the first item when menu opens", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      expect(items[0]).toHaveFocus();
    });

    it("returns focus to trigger when menu closes via Escape", async () => {
      const { getByText, user } = setUp(<BasicMenu />);
      const trigger = getByText("Open Menu");
      await user.click(trigger);
      await user.keyboard("{Escape}");
      expect(trigger).toHaveFocus();
    });

    it("returns focus to trigger after item selection", async () => {
      const { getByText, user } = setUp(<BasicMenu />);
      const trigger = getByText("Open Menu");
      await user.click(trigger);
      await user.keyboard("{Enter}"); // select first item
      expect(trigger).toHaveFocus();
    });

    it("returns focus to trigger when menu closes via outside click", async () => {
      const { getByText, user } = setUp(
        <div>
          <BasicMenu />
          <button type="button">Outside</button>
        </div>,
      );
      const trigger = getByText("Open Menu");
      await user.click(trigger);
      await user.click(getByText("Outside"));
      // Focus should not remain on the outside button if menu was open
      // This verifies the focus restoration behavior
      expect(trigger).toHaveFocus();
    });
  });

  // -------------------------------------------------------------------------
  // Mouse Interaction
  // -------------------------------------------------------------------------
  describe("mouse interaction", () => {
    it("highlights item on mouse move", async () => {
      const { getByText, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      await user.hover(getByText("Item 2"));
      expect(getByText("Item 2")).toHaveAttribute("data-highlighted");
    });

    it("clears highlight when pointer leaves item area", async () => {
      const { getByText, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      await user.hover(getByText("Item 2"));
      expect(getByText("Item 2")).toHaveAttribute("data-highlighted");
      await user.unhover(getByText("Item 2"));
      expect(getByText("Item 2")).not.toHaveAttribute("data-highlighted");
    });

    it("activates item on mouse-up after drag from trigger", async () => {
      const onClick = mock();
      const { getByText } = setUp(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItem onClick={onClick}>Target</MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Menu>,
      );
      const trigger = getByText("Open Menu");
      // Simulate: mousedown on trigger → move to item → mouseup on item
      fireEvent.pointerDown(trigger);
      // Menu should now be open
      const item = getByText("Target");
      fireEvent.pointerEnter(item);
      fireEvent.pointerUp(item);
      fireEvent.click(item);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // Modal Behavior
  // -------------------------------------------------------------------------
  describe("modal behavior", () => {
    it("locks scroll when modal=true", async () => {
      const { getByText, user } = setUp(<BasicMenu modal />);
      await user.click(getByText("Open Menu"));
      // Check that body has overflow hidden or similar scroll lock
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("does not lock scroll when modal=false", async () => {
      const { getByText, user } = setUp(<BasicMenu modal={false} />);
      await user.click(getByText("Open Menu"));
      expect(document.body.style.overflow).not.toBe("hidden");
    });
  });

  // -------------------------------------------------------------------------
  // Data Attributes
  // -------------------------------------------------------------------------
  describe("data attributes", () => {
    it("sets data-open on trigger when menu is open", async () => {
      const { getByText, user } = setUp(<BasicMenu />);
      const trigger = getByText("Open Menu");
      expect(trigger).not.toHaveAttribute("data-open");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("data-open");
    });

    it("sets data-highlighted on the currently highlighted item", async () => {
      const { getByText, getAllByRole, user } = setUp(<BasicMenu />);
      await user.click(getByText("Open Menu"));
      const items = getAllByRole("menuitem");
      // First item highlighted by default
      expect(items[0]).toHaveAttribute("data-highlighted");
      expect(items[1]).not.toHaveAttribute("data-highlighted");
      // Navigate down
      await user.keyboard("{ArrowDown}");
      expect(items[0]).not.toHaveAttribute("data-highlighted");
      expect(items[1]).toHaveAttribute("data-highlighted");
    });

    it("sets data-disabled on disabled items", async () => {
      const { getByText, user } = setUp(<MenuWithDisabledItems />);
      await user.click(getByText("Open Menu"));
      expect(getByText("Item 2 (disabled)")).toHaveAttribute("data-disabled");
    });
  });
});
