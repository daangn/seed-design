"use client";

import { ScrollFog, SideNavigation as SeedSideNavigation } from "@seed-design/react";
import { useTreeContext } from "fumadocs-ui/contexts/tree";
import type { SidebarProps } from "fumadocs-ui/layouts/notebook/slots/sidebar";
import { usePathname } from "next/navigation";
import { createElement } from "react";
import { buildSidebarGroups, DocsSideNavigationGroups } from "./docs-side-navigation-items";

/**
 * Docs sidebar rebuilt on the SEED SideNavigation component, wired into fumadocs'
 * notebook layout via `slots.sidebar.root`. Fumadocs still owns the page-tree data
 * (`useTreeContext`), routing, and the grid; this only swaps the rendered sidebar.
 *
 * Desktop/tablet sidebar only — the placeholder carries `--fd-sidebar-width` at
 * 968px+ so the notebook grid keeps its sidebar column. Below that, the header
 * opens the same tree in the responsive navigation panel.
 *
 * Leaf items use Next links through the SEED `asChild` slot so native link behavior is preserved.
 */
export function DocsSideNavigation({ banner }: SidebarProps) {
  const { root } = useTreeContext();
  const pathname = usePathname();

  const groups = buildSidebarGroups(root.children, pathname);

  return (
    <div
      data-sidebar-placeholder=""
      className="pointer-events-none sticky top-(--fd-docs-row-2) z-20 h-[calc(var(--fd-docs-height)-var(--fd-docs-row-2))] [grid-area:sidebar] *:pointer-events-auto max-[967px]:hidden min-[968px]:layout:[--fd-sidebar-width:184px] min-[1120px]:layout:[--fd-sidebar-width:208px] min-[1280px]:layout:[--fd-sidebar-width:240px]"
    >
      {/* Match fumadocs' shell: fill the sidebar grid area, then pin the actual nav to the content edge. */}
      <aside
        id="nd-sidebar"
        className="absolute inset-y-0 start-0 flex w-full flex-col items-end text-sm duration-250 *:w-(--fd-sidebar-width)"
      >
        {/* Pin collapsed to false (controlled). SEED's Provider bundles a
            ResponsiveCollapseEffect that flips collapsed→true below the `lg` (1280px)
            breakpoint via a matchMedia `change` listener. Here fumadocs owns all
            responsive behavior (drawer < md, column collapse), so that auto-collapse is
            unwanted — and because it only fires on `change`, a real drag from ≥1280 to
            <1280 strands the sidebar collapsed (an empty rail) until reload. Controlling
            it to false makes that setCollapsed a no-op, so the tree stays expanded at
            every width the column is shown. */}
        <SeedSideNavigation.Provider collapsed={false}>
          <SeedSideNavigation.Root
            tone="transparent"
            className="h-full w-(--fd-sidebar-width) pb-2"
          >
            <ScrollFog
              hideScrollBar
              placement={["top", "bottom"]}
              sizes={{ top: 20, bottom: 32 }}
              className="min-h-0 flex-1"
            >
              <SeedSideNavigation.Content
                className={
                  // Docs-only scroll UX override (mirror policy: don't touch packages/qvism-preset's
                  // side-navigation recipe). The recipe's `__content` styles ship unlayered (imported
                  // directly by @seed-design/react, not wrapped in `@layer seed-components`), so a
                  // plain Tailwind utility — which always compiles into the layered `utilities` layer —
                  // can never win against it on specificity or layer order alone. The `!` important
                  // modifier is required to beat the recipe's scroll container, scrollbar, shadow
                  // divider, and built-in bottom mask so the ScrollFog wrapper is the only fog effect.
                  "min-h-full [overflow:visible]! px-2! pt-3! pb-20! [--docs-sidebar-item-height:36px] [scrollbar-width:none]! [mask-image:none]! [-webkit-mask-image:none]! min-[1120px]:px-2.5! min-[1120px]:pt-4! min-[1120px]:[--docs-sidebar-item-height:38px] min-[1280px]:px-3! min-[1280px]:pt-5! min-[1280px]:[--docs-sidebar-item-height:40px] [&::-webkit-scrollbar]:hidden [&[data-scrolled]]:shadow-none!"
                }
              >
                {typeof banner === "function" ? createElement(banner) : banner}
                <DocsSideNavigationGroups groups={groups} />
              </SeedSideNavigation.Content>
            </ScrollFog>
          </SeedSideNavigation.Root>
        </SeedSideNavigation.Provider>
      </aside>
    </div>
  );
}
