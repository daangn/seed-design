"use client";

import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/notebook";
import {
  SidebarCollapseTrigger,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "fumadocs-ui/layouts/notebook/slots/sidebar";

/**
 * 사이드바가 필요 없는 섹션(get-started, updates)용 DocsLayout 래퍼.
 *
 * fumadocs notebook에는 사이드바 off 옵션이 없어, 사이드바 slot의 `root`만 빈 컴포넌트로
 * 교체한다. placeholder가 렌더되지 않으면 `md:layout:[--fd-sidebar-width:268px]`가 안 붙어
 * `--fd-sidebar-width`가 기본 0px로 남고, inline `--fd-sidebar-col`(= collapsed?0:width)이
 * 항상 0px → 사이드바 컬럼이 사라진다. 헤더/검색/ToC/그리드는 fumadocs 그대로 재사용.
 * 나머지 slot(provider/trigger/collapseTrigger/useSidebar)은 공개 서브패스에서 그대로 가져와 넘긴다.
 */
export function NoSidebarDocsLayout({ children, ...props }: DocsLayoutProps) {
  return (
    <DocsLayout
      {...props}
      slots={{
        ...props.slots,
        sidebar: {
          provider: SidebarProvider,
          root: () => null,
          trigger: SidebarTrigger,
          collapseTrigger: SidebarCollapseTrigger,
          useSidebar,
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
