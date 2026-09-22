import { describe, expect, it } from "bun:test";
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

// Fumadocs puts an index explicitly listed in meta.pages among the children.
const explicitIndexFolder: PageTree.Folder = {
  ...folder,
  $ref: { folder: "getting-started/styling" },
  index: undefined,
  children: [
    { type: "page", name: "Styling", url: "/styling", $ref: "getting-started/styling/index.mdx" },
    ...folder.children,
  ],
};

for (const mobile of [false, true]) {
  describe(mobile ? "mobile folder" : "desktop folder", () => {
    function setup(pathname: string, node = folder) {
      let destination = pathname;
      const router: AppRouterInstance = {
        push(href) {
          destination = href;
        },
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
        destination: () => destination,
        navigate: (path: string) => {
          destination = path;
          result.rerender(tree(path));
        },
        trigger: screen.getByRole("button", { name: "Styling" }),
      };
    }

    it("opens the index without a duplicate child link, then toggles on that page", async () => {
      const user = userEvent.setup();
      const { trigger, destination, navigate } = setup("/other", explicitIndexFolder);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      await user.click(trigger);
      expect(destination()).toBe("/styling");
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      navigate("/styling");
      expect(trigger.getAttribute("aria-current")).toBe("page");
      expect(screen.queryByRole("link", { name: "Styling" })).toBeNull();
      expect(screen.getByRole("link", { name: "Theming" }).getAttribute("href")).toBe(
        "/styling/theming",
      );
      expect(screen.getByRole("link", { name: "Nested overview" }).getAttribute("href")).toBe(
        "/styling/nested",
      );
      trigger.focus();
      await user.keyboard("{Enter}");
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      await user.keyboard(" ");
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(destination()).toBe("/styling");
    });

    it("keeps an open folder open when navigating from a child to its index", () => {
      const { trigger, destination, navigate } = setup("/styling/theming");
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(trigger.getAttribute("aria-current")).toBeNull();
      fireEvent.click(trigger);
      expect(destination()).toBe("/styling");
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      navigate("/styling");
      expect(trigger.getAttribute("aria-current")).toBe("page");
      fireEvent.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    it("toggles folders without an index without leaving the current page", () => {
      const { trigger, destination } = setup("/other", { ...folder, index: undefined });
      fireEvent.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(destination()).toBe("/other");
    });
  });
}
