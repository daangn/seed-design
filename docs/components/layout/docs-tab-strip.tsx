"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "fumadocs-core/framework";
import { useRef, type CSSProperties } from "react";
import { TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
import type { TabbedFolderTab } from "@/lib/tabbed";
import { DocsFrameworkProvider } from "./docs-framework-provider";

// Docs 전용 탭 스타일 override(SEED Tabs 스니펫 위에 inline style로 recipe를 덮음).
// 값이 unlayered recipe라 className보다 inline style이 확실하다(chip-tab-trigger.tsx와 같은 이유).
// X gutter 제거: root/trigger의 paddingInline을 0으로, 탭 간격은 list gap으로만.
// list 패딩은 `--tabs-list-padding-*` 변수로 덮는다. indicator `left`도 이 변수를 더하므로
// paddingInline만 덮으면 indicator가 원래 패딩만큼 오른쪽으로 밀린다.
const TAB_ROOT_STYLE: CSSProperties = { paddingInline: 0 };
const TAB_LIST_STYLE = {
  "--tabs-list-padding-left": "0px",
  "--tabs-list-padding-right": "0px",
  gap: "1.5rem",
} as CSSProperties;
const TAB_TRIGGER_STYLE: CSSProperties = {
  paddingInline: 0,
  // t5-regular: 본문과 같은 16px, weight만 트리거 기본(500→400)에서 낮춤.
  fontSize: "1rem",
  fontWeight: 400,
};

/**
 * "탭형 subject" 폴더(meta.json `layout: "tabs"`)의 형제 페이지를 상단 탭 스트립으로
 * 렌더한다(M3식 routed tabs). SEED Tabs 스니펫(seed-design/ui/tabs)의 line 스타일을 쓰되, 각 탭은
 * 별도 라우트라 `value=현재 경로` + `onValueChange→router.push`로 탐색한다(SEED SideNavigation과
 * 같은 버튼+router 방식). 탭 목록은 `DocsPage.astro`가 빌드 때 page tree에서 계산해 넘긴다(`lib/tabbed.ts`).
 */
function DocsTabStrip({
  tabs,
  label,
  className,
}: {
  tabs: TabbedFolderTab[];
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* 스크롤 기준점. sticky로 붙은 스트립은 이미 제자리라 스스로는 스크롤되지 않는다. */}
      <div ref={anchorRef} aria-hidden className={clsx("scroll-mt-(--fd-docs-row-2)", className)} />
      <nav
        aria-label={`${label} tabs`}
        // 전 사이즈 sticky. bg-fd-background: sticky 시 스크롤 본문이 뒤로 비치지 않게. 사이트 헤더(z-40) 아래.
        className={clsx(
          "not-prose mb-4 bg-fd-background sticky top-(--fd-docs-row-2) z-30",
          className,
        )}
      >
        <TabsRoot
          value={pathname}
          onValueChange={(url) => {
            if (url === pathname) return;
            // 전환 전에 즉시 스크롤한다. 이 컴포넌트는 라우트마다 리마운트되고,
            // smooth는 뒤이은 본문 교체에 잘려 중간에 멈춘다.
            anchorRef.current?.scrollIntoView({ block: "start" });
            router.push(url);
          }}
          triggerLayout="hug"
          style={TAB_ROOT_STYLE}
        >
          <TabsList style={TAB_LIST_STYLE}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.url} value={tab.url} style={TAB_TRIGGER_STYLE}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </TabsRoot>
      </nav>
    </>
  );
}

/**
 * 탭 스트립 island. article의 직계 자식이 `astro-island`가 되므로, article이 직계 자식에 거는 폭·정렬
 * (`*:max-w-[900px] *:mx-auto *:w-full`)은 `className`으로 받아 스트립에 직접 붙인다.
 */
export function DocsTabStripIsland({
  pathname,
  tabs,
  label,
  className,
}: {
  pathname: string;
  tabs: TabbedFolderTab[];
  /** 탭형 폴더 이름. `<nav>`의 aria-label에 쓴다. */
  label: string;
  className?: string;
}) {
  return (
    <DocsFrameworkProvider pathname={pathname}>
      <DocsTabStrip tabs={tabs} label={label} className={className} />
    </DocsFrameworkProvider>
  );
}
