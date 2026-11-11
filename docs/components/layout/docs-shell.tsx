import { type SerializedPageTree, useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/astro";
import { NuqsAdapter } from "nuqs/adapters/react";
import type { ReactNode } from "react";
import { NoSidebarDocsLayout } from "@/components/layout/no-sidebar-docs-layout";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/lib/search-tags";
import { DocsPageRenderer, type DocsPageRendererProps } from "./docs-page-renderer";
import { baseOptions } from "./layout-config";

export interface DocsShellProps {
  /** 현재 페이지 경로. `usePathname()`이 돌려주는 값이다. */
  pathname: string;
  /** `source.serializePageTree()` 결과. */
  tree: SerializedPageTree;
  /** 검색 다이얼로그가 처음 고르는 섹션 태그. */
  defaultSearchTag?: string;
  /** get-started·updates처럼 사이드바가 없는 섹션이면 `false`. */
  sidebar?: boolean;
  /** 아티클 프레젠테이션. 없으면 children을 DocsLayout에 그대로 넣는다. */
  page?: Omit<DocsPageRendererProps, "children" | "platformStatus" | "meta" | "llmOptions">;
  /** Astro named slot으로 받는 서버 렌더링 조각. */
  platformStatus?: ReactNode;
  meta?: ReactNode;
  llmOptions?: ReactNode;
  children?: ReactNode;
}

/**
 * 문서 페이지의 React island. 사이드바·헤더·검색·TOC가 같은 context를 공유해야 해서 notebook
 * `DocsLayout`과 아티클 셸을 한 island로 묶고, MDX 본문은 Astro가 렌더링한 slot으로 받는다.
 */
export function DocsShell({
  pathname,
  tree,
  defaultSearchTag,
  sidebar = true,
  page,
  platformStatus,
  meta,
  llmOptions,
  children,
}: DocsShellProps) {
  const data = useFumadocsLoader({ tree });
  const Layout = sidebar ? DocsLayout : NoSidebarDocsLayout;

  return (
    <NuqsAdapter>
      <RootProvider
        pathname={pathname}
        search={{
          SearchDialog: DefaultSearchDialog,
          options: {
            ...(defaultSearchTag ? { defaultTag: defaultSearchTag } : {}),
            tags: Object.values(TAGS),
          },
        }}
      >
        <Layout {...baseOptions} tree={data.tree}>
          {page ? (
            <DocsPageRenderer
              {...page}
              platformStatus={platformStatus}
              meta={meta}
              llmOptions={llmOptions}
            >
              {children}
            </DocsPageRenderer>
          ) : (
            children
          )}
        </Layout>
      </RootProvider>
    </NuqsAdapter>
  );
}
