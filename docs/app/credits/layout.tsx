import type { ReactNode } from "react";
import { NoSidebarDocsLayout } from "@/components/layout/no-sidebar-docs-layout";
import { baseOptions } from "../layout.config";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

/**
 * updates와 동일한 사이드바 없는 1컬럼 셸.
 * credits는 문서 소스가 없는 단독 페이지라 pageTree가 비어 있다 — 사이드바는
 * NoSidebarDocsLayout이 어차피 렌더하지 않으므로 트리가 쓰이지 않는다.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          tags: Object.values(TAGS),
        },
      }}
    >
      <NoSidebarDocsLayout {...baseOptions} tree={{ name: "Credits", children: [] }}>
        {children}
      </NoSidebarDocsLayout>
    </RootProvider>
  );
}
