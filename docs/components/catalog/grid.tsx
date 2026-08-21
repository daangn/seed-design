import { env } from "@/app/env";
import { getComponentsSource, getFoundationsSource, getPatternsSource } from "@/app/source";
import { CatalogCard } from "@/components/catalog/card";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
} from "@/components/figma-image/fetch-figma-image-urls";
import { resolveCoverImage } from "@/lib/seo";
import type { ReactNode } from "react";

const client = env.figmaPersonalAccessToken
  ? createFigmaClient(env.figmaPersonalAccessToken)
  : undefined;

type CatalogSource =
  | Awaited<ReturnType<typeof getComponentsSource>>
  | Awaited<ReturnType<typeof getFoundationsSource>>
  | Awaited<ReturnType<typeof getPatternsSource>>;
type TreeNode = CatalogSource["pageTree"]["children"][number];
type FolderNode = Extract<TreeNode, { type: "folder" }>;

/** Progress Board is surfaced in the section overview header, not as a catalog card. */
const PROGRESS_BOARD_URL = "/components/progress-board";

async function getCatalogSource(pathPrefix: string): Promise<CatalogSource | undefined> {
  if (pathPrefix.startsWith("/components/")) return getComponentsSource();
  if (pathPrefix.startsWith("/foundations/")) return getFoundationsSource();
  if (pathPrefix.startsWith("/patterns/")) return getPatternsSource();
  return undefined;
}

/** 폴더의 대표 링크 url. index 페이지 우선, 없으면 첫 하위 페이지. */
function firstUrl(folder: FolderNode): string | undefined {
  if (folder.index) return folder.index.url;
  for (const node of folder.children) {
    if (node.type === "page") return node.url;
    if (node.type === "folder") {
      const url = firstUrl(node);
      if (url) return url;
    }
  }
  return undefined;
}

interface CatalogItem {
  key: string;
  title: ReactNode;
  url: string;
  coverImage?: string;
  coverImageFigmaId?: string;
}

export interface CatalogGridProps {
  /** 카탈로그로 나열할 섹션 경로 (예: "/components/", "/foundations/"). */
  pathPrefix: string;
}

/**
 * 섹션(components, foundation 등)의 top-level 항목을 카드 그리드로 나열한다.
 * pageTree 기준이라 하위 폴더(color 등)는 대표 카드 1개로 접힌다.
 */
export async function CatalogGrid({ pathPrefix }: CatalogGridProps) {
  const catalogSource = await getCatalogSource(pathPrefix);
  if (!catalogSource) return null;

  const isFoundations = pathPrefix.startsWith("/foundations/");
  const base = pathPrefix.replace(/\/$/, "");
  const pageByUrl = new Map(catalogSource.getPages().map((page) => [page.url, page]));

  const items: CatalogItem[] = [];
  if (pathPrefix.startsWith("/components/")) {
    for (const page of catalogSource.getPages()) {
      if (page.slugs.length !== 1) continue;
      if (page.url === base || page.url === PROGRESS_BOARD_URL) continue;
      if (page.data.frontmatter.deprecated) continue;
      items.push({
        key: page.url,
        title: page.data.title,
        url: page.url,
        coverImage: page.data.frontmatter.coverImage,
        coverImageFigmaId: page.data.frontmatter.coverImageFigmaId,
      });
    }
  }

  // 두 소스(components/foundations) 모두 해당 섹션 루트라 pageTree.children이 곧 상위 항목 목록이다.
  const nodes = catalogSource.pageTree.children;
  for (const node of nodes) {
    if (node.type === "separator") continue;

    if (node.type === "folder") {
      const url = firstUrl(node);
      if (!url) continue;
      // 대표 페이지는 deprecated 판별과 cover 이미지에만 쓰고, 제목은 폴더명을 쓴다.
      const repPage = pageByUrl.get(node.index?.url ?? url);
      if (repPage?.data.frontmatter.deprecated) continue;
      items.push({
        key: url,
        title: node.name as ReactNode,
        url,
        coverImage: repPage?.data.frontmatter.coverImage,
        coverImageFigmaId: repPage?.data.frontmatter.coverImageFigmaId,
      });
      continue;
    }

    if (node.url === base || node.url === PROGRESS_BOARD_URL) continue;
    if (items.some((item) => item.url === node.url)) continue;

    const page = pageByUrl.get(node.url);
    if (!page || page.data.frontmatter.deprecated) continue;
    items.push({
      key: node.url,
      title: page.data.title,
      url: node.url,
      coverImage: page.data.frontmatter.coverImage,
      coverImageFigmaId: page.data.frontmatter.coverImageFigmaId,
    });
  }

  const figmaImageIds = Array.from(
    new Set(
      items.flatMap((item) =>
        item.coverImage || !item.coverImageFigmaId ? [] : [item.coverImageFigmaId],
      ),
    ),
  );
  let figmaImageUrls = new Map<string, string>();
  if (figmaImageIds.length > 0 && env.figmaFileKey && client) {
    try {
      figmaImageUrls = await fetchFigmaImageUrls({
        client,
        fileKey: env.figmaFileKey,
        nodeIds: figmaImageIds,
        options: { scale: 3 },
        maxRetries: 1,
      });
    } catch (error) {
      console.warn(
        "[CatalogGrid] Failed to fetch Figma image URLs; rendering cards without Figma thumbnails.",
        error,
      );
    }
  }

  return (
    // SEED breakpoint lg(1280px) 이상에서 3열, 그 미만은 2열 (foundation/layout.mdx)
    <ul className="grid grid-cols-2 gap-x-x5 gap-y-x6 not-prose pb-10 min-[768px]:gap-x-x6 min-[768px]:gap-y-x8 min-[1280px]:grid-cols-3">
      {items.map((item) => {
        const coverImageSrc = item.coverImage
          ? resolveCoverImage(item.coverImage).thumbnail
          : item.coverImageFigmaId
            ? figmaImageUrls.get(item.coverImageFigmaId)
            : undefined;

        return (
          <li key={item.key}>
            <CatalogCard
              title={item.title}
              href={item.url}
              coverImageSrc={coverImageSrc}
              variant={isFoundations ? "showcase" : "default"}
            />
          </li>
        );
      })}
    </ul>
  );
}
