import { IconLockLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import type * as PageTree from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/astro";
import { NuqsAdapter } from "nuqs/adapters/react";
import {
  type ComponentType,
  Fragment,
  type ReactNode,
  type SVGProps,
  useEffect,
  useMemo,
} from "react";
import { ChangelogLLMOptions } from "@/components/changelog-viewer/changelog-llm-options";
import {
  TokenReferencePage,
  type TokenReferencePageProps,
} from "@/components/token-reference-page";
import { ArticleShareButton } from "@/components/updates/share-button";
import { DocsVersionSwitcher } from "@/components/docs-version-switcher";
import { InlineCode } from "@/components/inline-code";
import { PageLink } from "@/components/link";
import { NoSidebarDocsLayout } from "@/components/layout/no-sidebar-docs-layout";
import { MotionProvider } from "@/components/MotionProvider";
import DefaultSearchDialog from "@/components/search/search";
import type { ChangelogPlatform } from "@/lib/changelog-platform";
import { type ArchivePlatform, archivePaths } from "@/lib/docs-archive";
import { formatPublishedDate } from "@/lib/format-date";
import { isPageTreeIconName, type PageTreeIconName } from "@/lib/page-tree-icons";
import type { TocTitleSegment } from "@/lib/satteri/rehype-toc-titles";
import { TAGS } from "@/lib/search-tags";
import { DocsPageRenderer, type DocsPageRendererProps } from "./docs-page-renderer";
import { baseOptions } from "./layout-config";
import type { PageCoverImage } from "./overview-layout";
import { ProsePage } from "./prose-page";
import { useShellPage } from "./shell-page";

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
 * `useRouter().push`가 부르는 이동. 링크 클릭과 같이 Astro `ClientRouter`로 문서를 다시 불러오지 않고 이동한다.
 * archive 채널에서는 `Link`와 같은 trailing slash 규칙을 따른다.
 */
function navigate(url: string) {
  // `astro:` 가상 모듈은 Astro 빌드에만 있다. 이 파일을 함께 불러오는 `bun test`·Storybook에서도
  // 모듈을 읽을 수 있도록 이동할 때 import한다.
  void import("astro:transitions/client").then((router) =>
    router.navigate(archivePaths.pageHref(url)),
  );
}

/** `rehypeTocTitles`가 조각 배열로 내보낸 제목(inline code 포함)을 React 노드로 되돌린다. */
function renderTocTitle(title: ReactNode | TocTitleSegment[]): ReactNode {
  if (!Array.isArray(title)) return title;

  return title.map((segment, index) =>
    // biome-ignore lint/suspicious/noArrayIndexKey: 조각은 순서가 바뀌지 않는다.
    typeof segment === "string" ? segment : <InlineCode key={index}>{segment.code}</InlineCode>,
  );
}

/**
 * 문서 페이지의 React island. 사이드바·헤더·검색·TOC가 같은 context를 공유해야 해서 notebook
 * `DocsLayout`과 아티클 셸을 한 island로 묶고, MDX 본문은 Astro가 렌더링한 slot으로 받는다.
 * 클라이언트 이동에서는 island를 유지한 채 새 페이지의 props와 본문만 받는다(`shell-navigation.ts`).
 */
export function DocsShell(astroProps: DocsShellProps) {
  const {
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
  } = useShellPage() ?? astroProps;
  const pageTree = useMemo(() => withIcons(tree), [tree]);

  // hydrate 전에는 layout의 열 폭 transition을 끈다(`src/styles/global.css`의 `data-docs-hydrated`).
  useEffect(() => {
    document.documentElement.setAttribute("data-docs-hydrated", "");
  }, []);
  const Layout = sidebar ? DocsLayout : NoSidebarDocsLayout;
  const searchTags = platform && archivePaths.prefix ? [TAGS[platform]] : Object.values(TAGS);

  const toc = useMemo(
    () => page?.toc?.map((item) => ({ ...item, title: renderTocTitle(item.title) })),
    [page?.toc],
  );

  const shell = (
    <NuqsAdapter>
      <RootProvider
        // Next.js는 섹션마다 layout(`app/<section>/layout.tsx`)이 따로 있어, 섹션 안에서는 사이드바 상태가
        // 유지되고 다른 섹션으로 가면 새로 그려졌다. 섹션은 경로의 첫 마디다(archive 채널도 `/react/v3/…`).
        key={pathname.split("/")[1]}
        // archive 채널의 주소는 trailing slash로 끝난다. Next.js의 `usePathname()`도 그 형태를 돌려줬다.
        pathname={archivePaths.pageHref(pathname)}
        components={{ Link: PageLink }}
        navigate={navigate}
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
          {/* Next.js가 page segment를 이동마다 새로 mount하던 것처럼 페이지 부분은 경로마다 새로 그린다.
              같은 DOM을 다시 쓰면 페이지 사이에 위치가 달라진 요소(제목·목차 항목)가 layout shift로 잡히고,
              페이지 안 컴포넌트 상태가 다음 페이지로 이어진다. */}
          <Fragment key={pathname}>
            {page ? (
              <DocsPageRenderer
                {...page}
                toc={toc}
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
          </Fragment>
        </Layout>
      </RootProvider>
    </NuqsAdapter>
  );

  return motion ? <MotionProvider>{shell}</MotionProvider> : shell;
}
