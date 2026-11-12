"use client";

import { ScrollFog, SideNavigation as SeedSideNavigation } from "@seed-design/react";
import { type ReactNode, useEffect } from "react";
import { DocsVersionSwitcher } from "@/components/docs-version-switcher";
import { MobileNavPanel } from "@/components/header/mobile-nav-panel";
import { mobileNavOpenStore } from "@/components/header/open-stores";
import type { ArchivePlatform } from "@/lib/docs-archive";
import { DocsFrameworkProvider } from "./docs-framework-provider";
import { DocsSideNavigationGroups } from "./docs-side-navigation-items";
import { SidebarRestoreSetup, SidebarScrollRestore, sidebarTreeId } from "./docs-sidebar-restore";
import type { SidebarGroup } from "./lib/sidebar-items";

/**
 * Docs sidebar built on the SEED SideNavigation component. It renders the groups built from the
 * page tree at build time (`buildSidebarGroups` in `src/layouts/DocsLayout.astro`) and fills the
 * notebook grid's `sidebar` area.
 *
 * Desktop/tablet sidebar only — the layout root (`src/layouts/DocsLayout.astro`) sets
 * `--fd-sidebar-width` at 968px+ so the grid keeps its sidebar column. Below that, the
 * header opens the same tree in the responsive navigation panel.
 *
 * Leaf items render plain links through the SEED `asChild` slot so native link behavior is preserved.
 */
export function DocsSideNavigation({
  groups,
  banner,
}: {
  groups: SidebarGroup[];
  /** 목록 위에 두는 노드(버전 전환 메뉴). */
  banner?: ReactNode;
}) {
  return (
    <div className="pointer-events-none sticky top-(--fd-docs-row-2) z-20 h-[calc(var(--fd-docs-height)-var(--fd-docs-row-2))] [grid-area:sidebar] *:pointer-events-auto max-[967px]:hidden">
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
                <SidebarRestoreSetup tree={sidebarTreeId(groups)} />
                {banner}
                <DocsSideNavigationGroups groups={groups} />
                <SidebarScrollRestore />
              </SeedSideNavigation.Content>
            </ScrollFog>
          </SeedSideNavigation.Root>
        </SeedSideNavigation.Provider>
      </aside>
    </div>
  );
}

/**
 * Cmd/Ctrl+B로 사이드바 열을 접고 편다. 조건은 fumadocs `SidebarProvider`와 같다(768px 이상, 입력 중·dialog
 * 안에서는 무시). 그리드 루트(`DocsLayout.astro`)는 정적 마크업이라 속성만 바꾸고, 열 폭은 루트의 class가
 * `data-sidebar-collapsed`에 따라 정한다. 사이드바 없는 페이지에서도 기준처럼 단축키를 가로챈다(열 폭은 0이라
 * 화면은 그대로다). 상태는 저장하지 않아 새로 고치면 펼쳐진다.
 */
function useSidebarCollapseHotKey() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
      if (isTypingTarget(event.target)) return;
      if (!(event.metaKey || event.ctrlKey) || event.shiftKey || event.altKey || event.key !== "b")
        return;
      if (window.matchMedia("(width < 768px)").matches) return;
      event.preventDefault();
      const layout = document.getElementById("nd-notebook-layout");
      if (!layout) return;
      const collapsed = layout.getAttribute("data-sidebar-collapsed") === "true";
      layout.setAttribute("data-sidebar-collapsed", String(!collapsed));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

/** fumadocs `useHotKey`의 `ignoreTyping`과 같은 판정. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return true;
  return target.closest('[role="dialog"]') !== null;
}

/** 모바일 메뉴 패널. 헤더의 메뉴 버튼이 `mobileNavOpenStore`로 연다. */
function DocsMobileNavPanel({ section }: { section?: { title: string; groups: SidebarGroup[] } }) {
  const open = mobileNavOpenStore.useOpen();
  return <MobileNavPanel open={open} onOpenChange={mobileNavOpenStore.set} section={section} />;
}

/**
 * 내비게이션 island. 사이드바 있는 페이지에서는 데스크톱 사이드바(플랫폼 섹션이면 버전 전환 메뉴 포함)와
 * 모바일 메뉴 패널을, 사이드바 없는 페이지에서는 모바일 메뉴 패널만 그린다. 목록은 빌드 때 만든 `groups`다.
 */
export function DocsNavigationIsland({
  pathname,
  platform,
  sidebar,
  sectionTitle,
  groups,
}: {
  pathname: string;
  platform?: ArchivePlatform;
  sidebar: boolean;
  /** 현재 문서 섹션 이름. 섹션 밖(404 등)이면 없고, 그때는 `groups`도 없다. */
  sectionTitle?: string;
  groups?: SidebarGroup[];
}) {
  useSidebarCollapseHotKey();

  return (
    <DocsFrameworkProvider pathname={pathname}>
      {sidebar && groups && (
        <DocsSideNavigation
          groups={groups}
          banner={platform ? <DocsVersionSwitcher platform={platform} /> : undefined}
        />
      )}
      <DocsMobileNavPanel
        section={sectionTitle && groups ? { title: sectionTitle, groups } : undefined}
      />
    </DocsFrameworkProvider>
  );
}
