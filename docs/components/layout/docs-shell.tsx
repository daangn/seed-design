import { IconLockLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import type * as PageTree from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/astro";
import { NuqsAdapter } from "nuqs/adapters/react";
import { type ComponentType, type ReactNode, type SVGProps, useMemo } from "react";
import { ChangelogLLMOptions } from "@/components/changelog-viewer/changelog-llm-options";
import { TokenReferencePage, type TokenReferencePageProps } from "@/components/token-reference-page";
import { ArticleShareButton } from "@/components/updates/share-button";
import { DocsVersionSwitcher } from "@/components/docs-version-switcher";
import { NoSidebarDocsLayout } from "@/components/layout/no-sidebar-docs-layout";
import { MotionProvider } from "@/components/MotionProvider";
import DefaultSearchDialog from "@/components/search/search";
import type { ChangelogPlatform } from "@/lib/changelog-platform";
import { type ArchivePlatform, archivePaths } from "@/lib/docs-archive";
import { formatPublishedDate } from "@/lib/format-date";
import { isPageTreeIconName, type PageTreeIconName } from "@/lib/page-tree-icons";
import { TAGS } from "@/lib/search-tags";
import { DocsPageRenderer, type DocsPageRendererProps } from "./docs-page-renderer";
import { baseOptions } from "./layout-config";
import type { PageCoverImage } from "./overview-layout";
import { ProsePage } from "./prose-page";

export interface DocsShellProps {
  /** 현재 페이지 경로. `usePathname()`이 돌려주는 값이다. */
  pathname: string;
  /** `source.pageTree`. 아이콘은 이름 문자열로 들어온다(`lib/source.ts`). */
  tree: PageTree.Root;
  /** 검색 다이얼로그가 처음 고르는 섹션 태그. */
  defaultSearchTag?: string;
  /** get-started·updates처럼 사이드바가 없는 섹션이면 `false`. */
  sidebar?: boolean;
  /** 사이드바 상단에 버전 전환 메뉴를 두는 플랫폼 섹션. archive 채널에서는 검색도 이 섹션으로 좁힌다. */
  platform?: ArchivePlatform;
  /** Breeze 예제가 쓰는 motion 기능을 지연 로드한다. */
  motion?: boolean;
  /** 아티클 프레젠테이션. 없으면 children을 DocsLayout에 그대로 넣는다. */
  page?: Omit<DocsPageRendererProps, "children" | "platformStatus" | "meta" | "llmOptions">;
  /** get-started처럼 TOC 없는 산문 페이지. `page` 대신 쓴다. */
  prose?: { title: string; description?: string; coverImage?: PageCoverImage };
  /** 토큰 레퍼런스 페이지. `page` 대신 쓴다. */
  token?: TokenReferencePageProps;
  /** Updates 글의 게시일 메타(공유 버튼 포함). `page`와 함께 쓴다. */
  published?: { title: string; date: Date; release: boolean };
  /** changelog 페이지면 기본 LLMs.txt 메뉴 대신 changelog 전용 메뉴를 렌더링한다. */
  changelog?: { platform: ChangelogPlatform; fallbackUrl: string };
  /** Astro named slot(`platform-status`, `meta`)으로 받는 서버 렌더링 조각. */
  platformStatus?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}

const pageTreeIcons: Record<PageTreeIconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  Lock: IconLockLine,
};

/** 직렬화되어 넘어온 아이콘 이름을 React 노드로 바꾼다. */
function withIcons<Node extends PageTree.Node | PageTree.Root>(node: Node): Node {
  const next = { ...node };
  if ("icon" in next && typeof next.icon === "string" && isPageTreeIconName(next.icon)) {
    const Icon = pageTreeIcons[next.icon];
    next.icon = <Icon />;
  }
  if ("index" in next && next.index) next.index = withIcons(next.index);
  if ("children" in next) next.children = next.children.map(withIcons);
  if ("fallback" in next && next.fallback) next.fallback = withIcons(next.fallback);
  return next;
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
  platform,
  motion = false,
  page,
  prose,
  token,
  published,
  changelog,
  platformStatus,
  meta,
  children,
}: DocsShellProps) {
  const pageTree = useMemo(() => withIcons(tree), [tree]);
  const Layout = sidebar ? DocsLayout : NoSidebarDocsLayout;
  const searchTags =
    platform && archivePaths.prefix ? [TAGS[platform]] : Object.values(TAGS);

  const shell = (
    <NuqsAdapter>
      <RootProvider
        pathname={pathname}
        search={{
          SearchDialog: DefaultSearchDialog,
          options: {
            ...(defaultSearchTag ? { defaultTag: defaultSearchTag } : {}),
            tags: searchTags,
          },
        }}
      >
        <Layout
          {...baseOptions}
          {...(platform
            ? {
                sidebar: {
                  ...baseOptions.sidebar,
                  banner: <DocsVersionSwitcher platform={platform} />,
                },
              }
            : {})}
          tree={pageTree}
        >
          {page ? (
            <DocsPageRenderer
              {...page}
              platformStatus={platformStatus}
              meta={
                published ? (
                  <div
                    className={clsx(
                      "not-prose mt-2 mb-3 flex items-center gap-1.5 text-base text-fd-muted-foreground",
                      published.release ? "justify-start" : "justify-center",
                    )}
                  >
                    <time dateTime={published.date.toISOString()}>
                      {formatPublishedDate(published.date)}
                    </time>
                    <ArticleShareButton title={published.title} />
                  </div>
                ) : (
                  meta
                )
              }
              llmOptions={
                changelog ? (
                  <ChangelogLLMOptions
                    platform={changelog.platform}
                    fallbackUrl={changelog.fallbackUrl}
                  />
                ) : undefined
              }
            >
              {children}
            </DocsPageRenderer>
          ) : prose ? (
            <ProsePage title={prose.title} description={prose.description}>
              {prose.coverImage ? (
                <div className="not-prose mb-8 md:mb-10">
                  <img
                    src={prose.coverImage.src}
                    alt={prose.coverImage.alt}
                    width={prose.coverImage.width}
                    height={prose.coverImage.height}
                    className="block h-auto w-full rounded-r4"
                    loading="eager"
                  />
                </div>
              ) : null}
              {children}
            </ProsePage>
          ) : token ? (
            <TokenReferencePage {...token} />
          ) : (
            children
          )}
        </Layout>
      </RootProvider>
    </NuqsAdapter>
  );

  return motion ? <MotionProvider>{shell}</MotionProvider> : shell;
}
