"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { useTreeContext } from "fumadocs-ui/contexts/tree";
import { usePathname, useRouter } from "next/navigation";
import { useRef, type CSSProperties } from "react";
import { TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
import { findTabbedFolder } from "@/lib/tabbed";

// Docs 전용 탭 스타일 override(SEED Tabs 스니펫 위에 inline style로 recipe를 덮음).
// 값이 unlayered recipe라 className보다 inline style이 확실하다(chip-tab-trigger.tsx와 같은 이유).
// X gutter 제거: root/list/trigger의 paddingInline을 0으로, 탭 간격은 list gap으로만.
const TAB_ROOT_STYLE: CSSProperties = { paddingInline: 0 };
const TAB_LIST_STYLE: CSSProperties = { paddingInline: 0, gap: "1.5rem" };
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
 * 같은 버튼+router 방식). 현재 경로가 탭형 폴더 안이 아니면 null.
 *
 * 트리 판정은 사이드바와 동일한 `useTreeContext` — 탭형 여부는 page tree transformer가
 * 폴더 노드에 스탬프한 값을 읽는다(lib/tabbed.ts).
 */
export function DocsTabStrip() {
  const { root } = useTreeContext();
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  const folder = findTabbedFolder(root.children, pathname);
  if (!folder?.index) return null;

  const tabs = [
    folder.index,
    ...folder.children.filter((child): child is PageTree.Item => child.type === "page"),
  ];
  if (tabs.length < 2) return null;

  const label = typeof folder.name === "string" ? folder.name : "Section";

  return (
    <nav
      ref={navRef}
      aria-label={`${label} tabs`}
      // 전 사이즈 sticky — 탭형 페이지에선 메뉴형 ToC 팝오버를 끄고(page-renderer) 탭이 그 자리를
      // 차지한다. bg-fd-background: sticky 시 스크롤 본문이 뒤로 비치지 않게. 사이트 헤더(z-40) 아래.
      // scroll-mt: 탭 클릭 시 scrollIntoView가 이 스트립을 sticky 시작 위치(--fd-docs-row-2)에 안착.
      className="not-prose mb-4 bg-fd-background sticky top-(--fd-docs-row-2) z-30 scroll-mt-(--fd-docs-row-2)"
    >
      <TabsRoot
        value={pathname}
        onValueChange={(url) => {
          if (url === pathname) return;
          // scroll:false로 기본 top 리셋을 막고(고정 헤더라 위치 보존), 스트립을 sticky 시작점으로
          // 부드럽게 스크롤 → 고정 헤더는 위로 사라지고 새 탭 본문이 바로 보인다.
          router.push(url, { scroll: false });
          requestAnimationFrame(() => {
            navRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
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
  );
}
