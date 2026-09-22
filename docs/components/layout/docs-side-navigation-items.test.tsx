import { describe, expect, it, mock } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SideNavigation } from "@seed-design/react";
import type * as PageTree from "fumadocs-core/page-tree";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { DocsMobileNavAccordion } from "../header/mobile-nav-accordion";
import { buildSidebarGroups, DocsSideNavigationGroups } from "./docs-side-navigation-items";
import { isSidebarFolderItem } from "./lib/sidebar-items";

const folder: PageTree.Folder = {
  type: "folder",
  name: "Styling",
  index: { type: "page", name: "Styling", url: "/styling" },
  children: [
    { type: "page", name: "Theming", url: "/styling/theming" },
    {
      type: "folder",
      name: "Nested",
      index: { type: "page", name: "Nested overview", url: "/styling/nested" },
      children: [{ type: "page", name: "Detail", url: "/styling/nested/detail" }],
    },
  ],
};

it("moves only the owning index to the trigger and preserves nested pages and levels", () => {
  const item = buildSidebarGroups([folder], "/styling")[0].items[0];
  if (!isSidebarFolderItem(item)) throw new Error("Expected folder");
  expect(item.index).toMatchObject({ href: "/styling", current: true });
  expect(item.items.map(({ href, level }) => [href, level])).toEqual([
    ["/styling/theming", 2],
    ["/styling/nested", 2],
    ["/styling/nested/detail", 3],
  ]);
});

it("keeps tabbed folders as a single link", () => {
  const tabbed = { ...folder, layout: "tabs" as const };
  const item = buildSidebarGroups([tabbed], "/styling/theming")[0].items[0];
  expect(isSidebarFolderItem(item)).toBe(false);
  expect(item).toMatchObject({ href: "/styling", current: true });
});

it("recognizes an index explicitly listed in meta pages as the folder's own page", () => {
  const explicitIndex: PageTree.Folder = {
    ...folder,
    $ref: { folder: "getting-started/styling" },
    index: undefined,
    children: [
      { type: "page", name: "Styling", url: "/styling", $ref: "getting-started/styling/index.mdx" },
      ...folder.children,
    ],
  };
  const item = buildSidebarGroups([explicitIndex], "/styling")[0].items[0];
  if (!isSidebarFolderItem(item)) throw new Error("Expected folder");
  expect(item.index).toMatchObject({ href: "/styling", current: true });
  expect(item.items.map((child) => child.href)).not.toContain("/styling");
});

for (const mobile of [false, true]) {
  describe(mobile ? "mobile folder" : "desktop folder", () => {
    function setup(pathname: string, node = folder) {
      const push = mock(() => {});
      const router: AppRouterInstance = {
        push,
        back() {},
        forward() {},
        refresh() {},
        replace() {},
        prefetch() {},
      };
      function tree(path: string) {
        const groups = buildSidebarGroups([node], path);
        const item = groups[0].items[0];
        if (!isSidebarFolderItem(item)) throw new Error("Expected folder");
        return (
          <AppRouterContext.Provider value={router}>
            {mobile ? (
              <DocsMobileNavAccordion
                value="styling"
                title={item.label}
                current={item.current}
                defaultOpen={item.defaultOpen}
                index={item.index}
              >
                {item.items.map((child) => (
                  <a key={child.key} href={child.href}>
                    {child.label}
                  </a>
                ))}
              </DocsMobileNavAccordion>
            ) : (
              <SideNavigation.Provider collapsed={false}>
                <SideNavigation.Root>
                  <DocsSideNavigationGroups groups={groups} />
                </SideNavigation.Root>
              </SideNavigation.Provider>
            )}
          </AppRouterContext.Provider>
        );
      }
      const result = render(tree(pathname));
      return {
        push,
        navigate: (path: string) => result.rerender(tree(path)),
        trigger: screen.getByRole("button", { name: "Styling" }),
      };
    }

    it("opens and navigates, then closes and reopens on the index without another navigation", () => {
      const { trigger, push, navigate } = setup("/other");
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(trigger);
      expect(push).toHaveBeenCalledWith("/styling");
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      navigate("/styling");
      expect(trigger.getAttribute("aria-current")).toBe("page");
      expect(screen.queryByRole("link", { name: "Styling" })).toBeNull();
      fireEvent.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(push).toHaveBeenCalledTimes(1);
    });

    it("keeps an open folder open when navigating from a child to its index", () => {
      const { trigger, push, navigate } = setup("/styling/theming");
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(trigger.getAttribute("aria-current")).toBeNull();
      fireEvent.click(trigger);
      expect(push).toHaveBeenCalledWith("/styling");
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      navigate("/styling");
      fireEvent.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    it("toggles folders without an index without navigating", () => {
      const { trigger, push } = setup("/other", { ...folder, index: undefined });
      fireEvent.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(push).not.toHaveBeenCalled();
    });

    it("supports Enter and Space with the same navigation and toggle behavior", async () => {
      const user = userEvent.setup();
      const { trigger, push, navigate } = setup("/other");
      trigger.focus();
      await user.keyboard("{Enter}");
      expect(push).toHaveBeenCalledWith("/styling");
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      navigate("/styling");
      await user.keyboard(" ");
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(push).toHaveBeenCalledTimes(1);
    });
  });
}
