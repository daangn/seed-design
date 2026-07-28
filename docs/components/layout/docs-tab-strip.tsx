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
  const anchorRef = useRef<HTMLDivElement>(null);

  const folder = findTabbedFolder(root.children, pathname);
  if (!folder?.index) return null;

  const tabs = [
    folder.index,
    ...folder.children.filter((child): child is PageTree.Item => child.type === "page"),
  ];
  if (tabs.length < 2) return null;

  const label = typeof folder.name === "string" ? folder.name : "Section";

  return (
    <>
      {/* 스크롤 기준점. 스트립이 sticky로 붙어 있으면 스트립 자신의 scrollIntoView는 이미 제자리라
          아무 일도 하지 않아, 탭을 바꿔도 페이지 중간에 머문다. 흐름에 남는 이 앵커를 기준으로
          잡으면 붙어 있든 아니든 같은 위치(스트립의 sticky 시작점)로 스크롤된다. */}
      <div ref={anchorRef} aria-hidden className="scroll-mt-(--fd-docs-row-2)" />
      <nav
        aria-label={`${label} tabs`}
        // 전 사이즈 sticky — 탭형 페이지에선 메뉴형 ToC 팝오버를 끄고(page-renderer) 탭이 그 자리를
        // 차지한다. bg-fd-background: sticky 시 스크롤 본문이 뒤로 비치지 않게. 사이트 헤더(z-40) 아래.
        className="not-prose mb-4 bg-fd-background sticky top-(--fd-docs-row-2) z-30"
      >
        <TabsRoot
          value={pathname}
          onValueChange={(url) => {
            if (url === pathname) return;
            // 전환 "전에" 스크롤한다. 이 컴포넌트는 라우트마다 리마운트되므로 "도착 후 스크롤"
            // 플래그를 ref에 남겨둘 수 없다. 스트립 위쪽(고정 헤더)은 탭이 바뀌어도 높이가 같아
            // 지금 계산한 목표 위치가 전환 후에도 그대로 유효하다.
            anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            // scroll:false로 Next의 기본 top 리셋을 막아 방금 맞춘 위치를 유지한다.
            router.push(url, { scroll: false });
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
