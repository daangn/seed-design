import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";

import type { ReactElement } from "react";
import type * as React from "react";

import { MenuRoot as Menu, MenuTrigger, MenuContent, MenuItem, useMenuContext } from "./index";
import { useListItem } from "@floating-ui/react";
import type { UseMenuSubmenuTriggerProps } from "./useMenu";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function SubmenuTrigger(props: UseMenuSubmenuTriggerProps & { children?: React.ReactNode }) {
  const { getSubmenuTriggerProps } = useMenuContext();
  const { children, ...restProps } = props;
  const { ref, index } = useListItem({ label: restProps.label });
  const itemApi = getSubmenuTriggerProps(restProps, index);
  return (
    <div ref={ref} {...itemApi.rootProps}>
      {children}
    </div>
  );
}

function MenuWithSubmenu(props: { closeParentOnEsc?: boolean } = {}) {
  return (
    <Menu>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuContent>
        <MenuItem>Item 1</MenuItem>
        <Menu>
          <SubmenuTrigger>Submenu</SubmenuTrigger>
          <MenuContent>
            <MenuItem>Sub Item 1</MenuItem>
            <MenuItem>Sub Item 2</MenuItem>
          </MenuContent>
        </Menu>
        <MenuItem>Item 3</MenuItem>
      </MenuContent>
    </Menu>
  );
}

describe("useMenu submenu", () => {  describe("open/close", () => {
    it("opens submenu on ArrowRight (LTR) from submenu trigger", async () => {
      const { getByText, user, getAllByRole } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      // Navigate to submenu trigger (index 1)
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}");
      expect(getAllByRole("menu")[1]).toHaveAttribute("data-open");
    });

    it("opens submenu on ArrowLeft (RTL) from submenu trigger", async () => {
      // RTL test — wraps in dir="rtl" container
      const { getByText, user, getAllByRole } = setUp(
        <div dir="rtl">
          <MenuWithSubmenu />
        </div>,
      );
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowLeft}");
      expect(getAllByRole("menu")[1]).toHaveAttribute("data-open");
    });

    it("closes submenu on ArrowLeft (LTR)", async () => {
      const { getByText, queryByText, user, getAllByRole } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}"); // Open submenu
      expect(getAllByRole("menu")[1]).toHaveAttribute("data-open");
      await user.keyboard("{ArrowLeft}"); // Close submenu
      expect(queryByText("Sub Item 1")).not.toBeInTheDocument();
    });

    it("closes submenu on ArrowRight (RTL)", async () => {
      const { getByText, queryByText, user, getAllByRole } = setUp(
        <div dir="rtl">
          <MenuWithSubmenu />
        </div>,
      );
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowLeft}"); // Open submenu in RTL
      expect(getAllByRole("menu")[1]).toHaveAttribute("data-open");
      await user.keyboard("{ArrowRight}"); // Close submenu in RTL
      expect(queryByText("Sub Item 1")).not.toBeInTheDocument();
    });

    it("closes submenu on Escape", async () => {
      const { getByText, queryByText, user, getAllByRole } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}"); // Open submenu
      expect(getAllByRole("menu")[1]).toHaveAttribute("data-open");
      await user.keyboard("{Escape}");
      // Submenu should be closed, parent menu should still be open
      expect(queryByText("Sub Item 1")).not.toBeInTheDocument();
      expect(getByText("Item 1")).toBeInTheDocument();
    });
  });  describe("focus", () => {
    it("focuses first item in submenu when opened via keyboard", async () => {
      const { getByText, user } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}"); // Open submenu
      expect(getByText("Sub Item 1")).toHaveFocus();
    });

    it("returns focus to parent submenu trigger when submenu closes", async () => {
      const { getByText, user } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}"); // Open submenu
      await user.keyboard("{Escape}"); // Close submenu
      expect(getByText("Submenu")).toHaveFocus();
    });

    it("sets tabIndex=0 on submenu trigger after opening via keyboard", async () => {
      const { getByText, user } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}"); // Open submenu
      expect(getByText("Submenu")).toHaveAttribute("tabindex", "0");
    });
  });  describe("dismiss", () => {
    it("closes entire tree on outside click", async () => {
      const { getByText, queryByText, queryByRole, user, getAllByRole } = setUp(
        <div>
          <MenuWithSubmenu />
          <button type="button">Outside</button>
        </div>,
      );
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}"); // Open submenu
      expect(getAllByRole("menu")[1]).toHaveAttribute("data-open");
      await user.click(getByText("Outside"));
      // Both submenu and parent should be closed
      expect(queryByText("Sub Item 1")).not.toBeInTheDocument();
      expect(queryByRole("menu")).not.toBeInTheDocument();
    });

    it("Escape closes only current submenu by default", async () => {
      const { getByText, queryByText, user, getAllByRole } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}"); // Open submenu
      await user.keyboard("{Escape}");
      // Submenu closed, but parent menu is still open
      expect(queryByText("Sub Item 1")).not.toBeInTheDocument();
      expect(getByText("Item 1")).toBeInTheDocument();
    });

    it("Escape closes parent when closeParentOnEsc=true", async () => {
      const { getByText, queryByRole, user } = setUp(<MenuWithSubmenu closeParentOnEsc />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}"); // Open submenu
      await user.keyboard("{Escape}");
      // Both menus should be closed
      expect(queryByRole("menu")).not.toBeInTheDocument();
    });
  });  describe("hover", () => {
    it("opens submenu when hovering the submenu trigger", async () => {
      const { getByText, user, getAllByRole } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.hover(getByText("Submenu"));
      // Submenu should open on hover
      expect(getAllByRole("menu")[1]).toHaveAttribute("data-open");
    });

    it("closes submenu when pointer leaves to a sibling item", async () => {
      const { getByText, queryByText, user, getAllByRole } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.hover(getByText("Submenu")); // Open submenu
      expect(getAllByRole("menu")[1]).toHaveAttribute("data-open");
      await user.hover(getByText("Item 3")); // Move to sibling
      expect(queryByText("Sub Item 1")).not.toBeInTheDocument();
    });

    it("keeps submenu open when pointer moves into the submenu content", async () => {
      const { getByText, user, getAllByRole } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.hover(getByText("Submenu")); // Open submenu
      await user.hover(getByText("Sub Item 1")); // Move into submenu
      // Submenu should still be open
      expect(getAllByRole("menu")[1]).toHaveAttribute("data-open");
      expect(getByText("Sub Item 2")).toBeInTheDocument();
    });
  });  describe("rendering", () => {
    it("renders submenu trigger as role='menuitem'", async () => {
      const { getByText, user } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      expect(getByText("Submenu")).toHaveAttribute("role", "menuitem");
    });

    it("renders submenu content with role='menu'", async () => {
      const { getByText, getAllByRole, user } = setUp(<MenuWithSubmenu />);
      await user.click(getByText("Open Menu"));
      await user.keyboard("{ArrowDown}"); // null → Item 1
      await user.keyboard("{ArrowDown}"); // Item 1 → Submenu trigger
      await user.keyboard("{ArrowRight}"); // Open submenu
      const menus = getAllByRole("menu");
      // Should have both parent menu and submenu
      expect(menus).toHaveLength(2);
    });
  });
});
