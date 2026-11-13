/**
 * 문서 데이터의 유일한 진입점. fumadocs-core loader와 `@fumadocs/astro`를 이 모듈 안에 가둔다.
 *
 * 공개 면: listDocsPages, listSectionPages, loadDocsPage, getSectionNav, listCatalogItems(페이지),
 * listPages, getLlmsPage, getLlmsPages, getSearchDocuments(endpoint).
 * 숨기는 것: page tree·transformer(탭형 폴더, featured), archive 경로 재작성, 탭형 폴더의 제목 규칙,
 * changelog 예외, deprecated 판정(rootage), 섹션별 머리 부분 차이, Git 수정일, cacheKey 계산, collection 이름 규칙,
 * 검색 breadcrumb.
 *
 * 불변식
 * - fumadocs 타입(Page, PageTree.*)은 반환 타입에 나타나지 않는다. 바깥은 아래 도메인 타입만 본다.
 * - `DocsPageRef`는 JSON이다. getStaticPaths props에 함수가 들어가면 `parallelPrerender`를 켤 수 없다.
 * - render 중 네트워크·fs를 읽지 않는다. 예외는 Git 수정일 manifest 하나이고, 그 값은 페이지 자신의 것만 쓰므로
 *   cacheKey에 넣는다. 공유 빌드 데이터(Sanity 스냅숏·rootage·Lynx manifest·public 커버 목록)는 module import라서
 *   Astro의 route module graph hash가 무효화를 맡는다.
 * - `loadDocsPage`의 await는 route 맨 앞, 그 페이지의 모든 React renderer 호출보다 앞이다.
 */
import { createHash } from "node:crypto";
import { type MetaEntry, type PageEntry, toFumadocsSource } from "@fumadocs/astro/source";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { type CollectionKey, getCollection, render } from "astro:content";
import type { StructuredData } from "fumadocs-core/mdx-plugins/remark-structure";
import { findPath } from "fumadocs-core/page-tree";
import type * as PageTree from "fumadocs-core/page-tree";
import { type ContentStorage, loader, type PageTreeTransformer } from "fumadocs-core/source";
import { archivePaths } from "../../lib/docs-archive";
import { sectionLabel } from "../../lib/docs-sections";
import { getLLMMarkdownUrl } from "../../lib/llms/config";
import type { LLMPage, Section } from "../../lib/llms/types";
import { baseUrl } from "../../lib/metadata";
import { isFeatured, markFeatured } from "../../lib/featured";
import { getMarkdownPageLastModified } from "../../lib/git-timestamps";
import { TOC_TITLES_KEY, type TocTitleSegment } from "../../lib/satteri/rehype-toc-titles";
import type { LynxCompatibility } from "../../lib/lynx-compatibility";
import { getComponentStatus } from "../../lib/rootage";
import {
  buildDocsPageJsonLd,
  deprecatedTitle,
  docsPageOgImage,
  resolveCoverImage,
} from "../../lib/seo";
import {
  findTabbedFolder,
  isTabbedFolder,
  markTabbedFolder,
  type TabbedFolderNode,
  tabbedFolderLabel,
} from "../../lib/tabbed";
import type { NavFolder, NavGroup, NavLink, SectionNav } from "../shell/nav-model";
import { publicFileExists } from "./public-files";
import { getSectionConfig, type SectionConfig, type SectionId, sectionsForBuild } from "./sections";

// ───────────────────────── 도메인 타입 ─────────────────────────

/** getStaticPaths props. JSON만. */
export interface DocsPageRef {
  section: SectionId;
  slugs: string[];
}

export interface DocsStaticPath {
  params: { slug: string | undefined };
  props: DocsPageRef;
  /**
   * incremental build cacheKey = 본문 entry digest + 섹션 nav digest + 이 페이지의 Git 수정일.
   * 코드·공유 빌드 데이터 변경은 Astro가 module graph hash로 따로 감지한다.
   */
  cacheKey: string;
}

/** TOC 제목. 조각 배열이면 문자열은 일반 텍스트, `{ code }`는 inline code다(`lib/satteri/rehype-toc-titles.ts`). */
export type TocTitle = string | TocTitleSegment[];

export interface TocEntry {
  title: TocTitle;
  url: string;
  depth: number;
}

export interface PrevNextLink {
  label: string;
  href: string;
}

export interface TabStripItem {
  label: string;
  href: string;
  current: boolean;
}

export interface SeoHead {
  title: string;
  description?: string;
  /** 절대 URL. */
  canonical: string;
  ogImage: { url: string; width?: number; height?: number; alt?: string; type?: string };
  jsonLd: object;
  /** `<link rel="alternate" type="text/markdown">`. 섹션 루트면 `llmsTxtUrl`과 같다. */
  markdownUrl: string;
  /** `<link rel="describedby">`. */
  llmsTxtUrl: string;
  /** Updates 글이면 og:type이 `article`이 된다. */
  publishedTime?: string;
}

export interface DocsPageView {
  section: SectionConfig;
  url: string;
  Content: AstroComponentFactory;
  head: SeoHead;
  article: {
    title: string;
    description?: string;
    sectionLabel: string;
    coverImage?: { src: string; alt: string; width: number; height: number };
    /** 탭형 폴더의 상단 탭 스트립. 탭형이 아니면 undefined. */
    tabs?: { label: string; items: TabStripItem[] };
    /** components 섹션의 플랫폼 상태(Sanity 스냅숏)를 그릴 컴포넌트 id. 없으면 빈 배열. */
    platformStatusIds: string[];
    /** Lynx 문서 frontmatter `compatibility.lynx`. */
    lynxCompatibility?: LynxCompatibility;
    /** `prose`: get-started처럼 TOC 없는 넓은 산문 페이지. `overview`: 섹션 개요. */
    layout: "docs" | "overview" | "prose";
    /** 넓은 콘텐츠 폭(changelog, progress board). TOC 열을 예약하지 않는다. */
    full: boolean;
    showPageActions: boolean;
    /** changelog 페이지는 LLMS.txt 메뉴 대신 changelog 전용 메뉴를 쓴다. */
    changelog?: { platform: "react" | "lynx" };
    /** Updates 글. `post`는 가운데 정렬 에세이, `release`는 TOC 있는 릴리즈 노트다. */
    updates?: { release: boolean; publishedAt?: Date };
  };
  /** null이면 TOC 레일을 그리지 않는다(full·prose·overview). 빈 배열이면 열 폭만 예약한다. */
  toc: TocEntry[] | null;
  /** `layout: "no-sidebar"` 섹션이면 null. */
  nav: SectionNav | null;
  prevNext: { prev?: PrevNextLink; next?: PrevNextLink };
  lastModified?: Date;
}

// ───────────────────────── 공개 함수 ─────────────────────────

/** 모든 문서 섹션(`layout !== "custom"`)의 페이지. `src/pages/[...slug].astro`의 getStaticPaths. */
export async function listDocsPages(): Promise<DocsStaticPath[]> {
  const out: DocsStaticPath[] = [];
  for (const section of sectionsForBuild()) {
    if (section.layout === "custom") continue;
    out.push(...(await listSectionPages(section.id)));
  }
  return out;
}

/** 한 섹션의 페이지 경로. updates처럼 섹션 route가 따로 있는 곳이 쓴다. */
export async function listSectionPages(id: SectionId): Promise<DocsStaticPath[]> {
  const loaded = await getSection(id);
  return Promise.all(
    loaded.source.getPages().map(async (page) => {
      const entryDigest = loaded.digests.get(page.path);
      if (entryDigest === undefined)
        throw new Error(`content entry digest가 없습니다: ${id}:${page.path}`);
      const lastModified = await getMarkdownPageLastModified(page.absolutePath);
      return {
        // page.url은 loader baseUrl(archive 채널이면 `/react/v3` 같은 접두사)을 포함한다.
        params: { slug: page.url.replace(/^\//, "") || undefined },
        props: { section: id, slugs: page.slugs },
        cacheKey: `${entryDigest}:${loaded.nav.digest}:${lastModified?.getTime() ?? ""}`,
      };
    }),
  );
}

/** route가 한 번 부른다. 섹션별 차이(탭형 제목, changelog, 플랫폼 상태)는 여기서 모두 결정한다. */
export async function loadDocsPage(ref: DocsPageRef): Promise<DocsPageView> {
  const loaded = await getSection(ref.section);
  const { config, source, nav } = loaded;
  const page = source.getPage(ref.slugs);
  if (!page) throw new Error(`Missing docs page: ${ref.section}/${ref.slugs.join("/")}`);

  const entry = loaded.entries.get(page.path);
  if (!entry) throw new Error(`content entry가 없습니다: ${ref.section}:${page.path}`);
  const [{ body, toc }, { remarkPluginFrontmatter }, lastModified] = await Promise.all([
    page.data.load(),
    render(entry),
    getMarkdownPageLastModified(page.absolutePath),
  ]);
  const tocTitles = (remarkPluginFrontmatter[TOC_TITLES_KEY] ?? {}) as Record<
    string,
    TocTitleSegment[]
  >;
  const frontmatter = page.data as PageFrontmatter;
  const slugPath = page.slugs.join("/");

  const tabbedFolder = findTabbedFolder(source.getPageTree().children, page.url);
  const folderLabel = tabbedFolder ? tabbedFolderLabel(tabbedFolder) : undefined;
  const heading = folderLabel ?? frontmatter.heading ?? frontmatter.title;
  const deprecated = DEPRECATION_SECTIONS.has(config.id)
    ? getComponentStatus({ slug: page.slugs }, { deprecated: frontmatter.deprecated }).deprecated
    : false;
  const title = deprecatedTitle(heading, deprecated);
  const description = tabbedFolder
    ? typeof tabbedFolder.description === "string"
      ? tabbedFolder.description
      : undefined
    : frontmatter.description;
  const coverBase = tabbedFolder ? tabbedFolder.coverImage : frontmatter.coverImage;
  const cover =
    config.id !== "docs" && coverBase ? resolveCoverImage(coverBase, publicFileExists) : null;
  const isChangelog = config.platform !== undefined && slugPath === "updates/changelog";
  const full = isChangelog || frontmatter.full === true;
  // Updates 글: `post`는 TOC·설명 없이 커버와 가운데 정렬 제목, `release`는 TOC 있는 기본 조판(기존 updates route와 같다).
  const updates =
    config.id === "updates"
      ? {
          release: frontmatter.category === "release",
          publishedAt: frontmatter.publishedAt ? new Date(frontmatter.publishedAt) : undefined,
        }
      : undefined;
  const layout =
    config.layout === "no-sidebar"
      ? "prose"
      : frontmatter.layout === "overview"
        ? "overview"
        : "docs";

  const markdownUrl = getLLMMarkdownUrl(config.id as Section, page.slugs);
  const llmsTxtUrl = getLLMMarkdownUrl(config.id as Section, []);
  const ogImage = docsPageOgImage(
    { coverImage: frontmatter.coverImage, url: page.url },
    publicFileExists,
  );

  return {
    section: config,
    url: page.url,
    Content: body,
    head: {
      title,
      description: frontmatter.description,
      canonical: new URL(archivePaths.link(page.url), baseUrl).toString(),
      ogImage: { ...ogImage, url: new URL(archivePaths.asset(ogImage.url), baseUrl).toString() },
      jsonLd: buildDocsPageJsonLd({
        url: page.url,
        data: {
          title: frontmatter.title,
          description: frontmatter.description,
          frontmatter: { heading: frontmatter.heading, publishedAt: frontmatter.publishedAt },
        },
      }),
      markdownUrl,
      llmsTxtUrl,
      ...(updates?.publishedAt ? { publishedTime: updates.publishedAt.toISOString() } : {}),
    },
    article: {
      title,
      description: updates && !updates.release ? undefined : description,
      // 기존 `SectionLabel`은 docs·breeze 섹션에 라벨을 그리지 않았다.
      sectionLabel: config.id === "docs" || config.id === "breeze" ? "" : config.label,
      coverImage:
        cover && !updates?.release
          ? {
              src: archivePaths.asset(cover.thumbnail),
              alt: config.layout === "no-sidebar" ? "SEED Design System" : `${title} cover image`,
              width: updates ? 1600 : (cover.og.width ?? 0),
              height: updates ? 900 : (cover.og.height ?? 0),
            }
          : undefined,
      tabs: tabbedFolder ? tabStrip(tabbedFolder, page.url) : undefined,
      platformStatusIds:
        config.id === "components"
          ? (frontmatter.componentIds ?? (page.slugs.at(-1) ? [page.slugs.at(-1) as string] : []))
          : [],
      lynxCompatibility: frontmatter.compatibility?.lynx,
      layout,
      full,
      showPageActions: page.slugs.length > 0 && layout === "docs",
      changelog: isChangelog && config.platform ? { platform: config.platform } : undefined,
      updates,
    },
    toc:
      layout !== "docs" || full || (updates && !updates.release)
        ? null
        : (toc as TocEntry[]).map((item) => ({
            ...item,
            title: tocTitles[item.url.slice(1)] ?? item.title,
          })),
    nav: config.layout === "sidebar" ? nav : null,
    prevNext: prevNextOf(loaded.footerItems, page.url),
    lastModified,
  };
}

export async function getSectionNav(id: SectionId): Promise<SectionNav> {
  return (await getSection(id)).nav;
}

/** 섹션 페이지의 frontmatter 요약. endpoint(llms 목록, sitemap, 컴포넌트 검색)가 쓴다. JSON + Date만. */
export interface PageSummary {
  url: string;
  /** 섹션 content 디렉터리 기준 원천 경로. */
  path: string;
  slugs: string[];
  title: string;
  description?: string;
  deprecated?: boolean;
  keywords?: string[];
  coverImage?: string;
  componentIds?: string[];
  compatibility?: { lynx?: LynxCompatibility };
  publishedAt?: string | Date;
  lastModified?: Date;
}

/** 한 섹션의 모든 페이지(인덱스 포함) 요약. fumadocs loader의 페이지 열거 순서를 그대로 둔다. */
export async function listPages(id: SectionId): Promise<PageSummary[]> {
  const { source } = await getSection(id);
  return Promise.all(
    source.getPages().map(async (page) => {
      const data = page.data as PageFrontmatter & { keywords?: string[] };
      return {
        url: page.url,
        path: page.path,
        slugs: page.slugs,
        title: data.title ?? "",
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.deprecated !== undefined ? { deprecated: data.deprecated } : {}),
        ...(data.keywords ? { keywords: data.keywords } : {}),
        ...(data.coverImage ? { coverImage: data.coverImage } : {}),
        ...(data.componentIds ? { componentIds: data.componentIds } : {}),
        ...(data.compatibility ? { compatibility: data.compatibility } : {}),
        ...(data.publishedAt ? { publishedAt: data.publishedAt } : {}),
        lastModified: await getMarkdownPageLastModified(page.absolutePath),
      };
    }),
  );
}

/** `/llms/<section>/<slug>.txt` 하나의 입력. */
export async function getLlmsPage(ref: DocsPageRef): Promise<LLMPage> {
  const page = (await getSection(ref.section)).source.getPage(ref.slugs);
  if (!page) throw new Error(`Missing docs page: ${ref.section}/${ref.slugs.join("/")}`);
  return toLlmPage(page);
}

/** `/<section>/llms.txt` 목록의 입력. 섹션의 모든 페이지(인덱스 포함). */
export async function getLlmsPages(id: SectionId): Promise<LLMPage[]> {
  return (await getSection(id)).source.getPages().map(toLlmPage);
}

/** `/api/search.json` 문서 색인 한 줄. fumadocs `AdvancedIndex`와 같은 모양이다. */
export interface SearchDocument {
  id: string;
  title: string;
  description?: string;
  structuredData: StructuredData;
  /** 사이드바가 부르는 대로의 위치: 헤더 섹션, 그 위 폴더들. 검색 다이얼로그가 제목 위에 찍는다. */
  breadcrumbs: string[];
  tag: string;
  url: string;
}

/**
 * 이 빌드의 모든 섹션 문서 색인. 태그는 `SECTIONS`의 `searchTag`다. archive 빌드는 `sectionsForBuild()`가
 * 해당 플랫폼만 남긴다.
 */
export async function getSearchDocuments(): Promise<SearchDocument[]> {
  const groups = await Promise.all(
    sectionsForBuild().map(async (config) => {
      const { source } = await getSection(config.id);
      const tree = source.getPageTree();
      return Promise.all(
        source.getPages().map(async (page) => {
          const { structuredData } = await page.data.load();
          return {
            id: page.url,
            title: page.data.title ?? "",
            description: page.data.description,
            structuredData,
            breadcrumbs: searchBreadcrumbs(tree, page.url),
            tag: config.searchTag,
            url: page.url,
          } satisfies SearchDocument;
        }),
      );
    }),
  );
  return groups.flat();
}

export interface CatalogItem {
  key: string;
  title: string;
  url: string;
  coverImage?: string;
  coverImageFigmaId?: string;
}

/** 카탈로그로 나열하지 않는 components 섹션 페이지(Progress Board는 개요 머리, deprecated 안내는 사이드바에만). */
const NON_CATALOG_URLS = new Set(["/components/progress-board", "/components/deprecated"]);

/**
 * 섹션 개요의 카드 그리드(`CatalogGrid`) 항목. 섹션의 최상위 항목이고 하위 폴더는 대표 카드 하나로 접힌다.
 * 규칙은 기존 `components/catalog/grid.tsx`와 같다.
 */
export async function listCatalogItems(pathPrefix: string): Promise<CatalogItem[]> {
  const id: SectionId | undefined = pathPrefix.startsWith("/components/")
    ? "components"
    : pathPrefix.startsWith("/foundations/")
      ? "foundations"
      : pathPrefix.startsWith("/patterns/")
        ? "patterns"
        : undefined;
  if (!id) return [];
  const { source } = await getSection(id);
  const base = pathPrefix.replace(/\/$/, "");
  const pages = source.getPages();
  const pageByUrl = new Map(pages.map((page) => [page.url, page]));
  const data = (page: (typeof pages)[number] | undefined) =>
    page?.data as (PageFrontmatter & { coverImageFigmaId?: string }) | undefined;
  const item = (
    key: string,
    title: string,
    url: string,
    page: (typeof pages)[number] | undefined,
  ): CatalogItem => ({
    key,
    title,
    url,
    ...(data(page)?.coverImage ? { coverImage: data(page)?.coverImage } : {}),
    ...(data(page)?.coverImageFigmaId ? { coverImageFigmaId: data(page)?.coverImageFigmaId } : {}),
  });

  const items: CatalogItem[] = [];
  if (id === "components") {
    for (const page of pages) {
      if (page.slugs.length !== 1 || page.url === base || NON_CATALOG_URLS.has(page.url)) continue;
      if (data(page)?.deprecated) continue;
      items.push(item(page.url, String(page.data.title), page.url, page));
    }
  }

  const firstUrl = (folder: PageTree.Folder): string | undefined => {
    if (folder.index) return folder.index.url;
    for (const node of folder.children) {
      if (node.type === "page") return node.url;
      if (node.type === "folder") {
        const url = firstUrl(node);
        if (url) return url;
      }
    }
    return undefined;
  };

  for (const node of source.getPageTree().children) {
    if (node.type === "separator") continue;
    if (node.type === "folder") {
      const url = firstUrl(node);
      if (!url) continue;
      // 대표 페이지는 deprecated 판별과 커버에만 쓰고, 제목은 폴더명을 쓴다.
      const page = pageByUrl.get(node.index?.url ?? url);
      if (data(page)?.deprecated) continue;
      items.push(item(url, String(node.name), url, page));
      continue;
    }
    if (node.url === base || NON_CATALOG_URLS.has(node.url)) continue;
    if (items.some((existing) => existing.url === node.url)) continue;
    const page = pageByUrl.get(node.url);
    if (!page || data(page)?.deprecated) continue;
    items.push(item(node.url, String(page.data.title), node.url, page));
  }
  return items;
}

// ───────────────────────── 내부 ─────────────────────────

type SourcePage = ReturnType<LoadedSection["source"]["getPages"]>[number];

function toLlmPage(page: SourcePage): LLMPage {
  const data = page.data as PageFrontmatter;
  return {
    url: page.url,
    path: page.path,
    slugs: page.slugs,
    data: {
      title: data.title ?? "",
      description: data.description,
      deprecated: data.deprecated,
      componentIds: data.componentIds,
      compatibility: data.compatibility?.lynx ? { lynx: data.compatibility.lynx } : undefined,
      publishedAt: data.publishedAt,
      getText: (type) => page.data.getText(type),
    },
  };
}

/**
 * 검색 결과의 위치 표시: URL이 속한 헤더 섹션, 그다음 페이지 위의 폴더들. 폴더 이름이 문자열이 아닌 노드는
 * `[object Object]` 대신 뺀다. 섹션과 첫 폴더 이름이 같으면(`/components` 아래 "Components") 한 번만 쓴다.
 */
function searchBreadcrumbs(tree: PageTree.Root, url: string): string[] {
  const path = findPath(tree.children, (node) => node.type === "page" && node.url === url) ?? [];
  const trail = [
    sectionLabel(url),
    // `findPath`는 페이지 자신으로 끝난다. 그 제목은 결과 줄이 이미 말한다.
    ...path.slice(0, -1).map(({ name }) => (typeof name === "string" ? name : "")),
  ].filter(Boolean);
  return trail.filter((crumb, index) => crumb !== trail[index - 1]);
}

/** frontmatter 중 이 모듈이 읽는 필드(`lib/content/schemas.ts`). */
interface PageFrontmatter {
  title: string;
  category?: "post" | "release";
  publishedAt?: string | Date;
  description?: string;
  heading?: string;
  deprecated?: boolean;
  layout?: "docs" | "overview";
  full?: boolean;
  coverImage?: string;
  componentIds?: string[];
  compatibility?: { lynx?: LynxCompatibility };
}

/** rootage·frontmatter의 `(Deprecated)` 제목 규칙을 쓰는 섹션(기존 route와 같다). */
const DEPRECATION_SECTIONS = new Set<SectionId>([
  "react",
  "components",
  "foundations",
  "get-started",
  "docs",
  "patterns",
]);

function tabStrip(folder: TabbedFolderNode, url: string): DocsPageView["article"]["tabs"] {
  if (!folder.index) return undefined;
  const pages = [
    folder.index,
    ...folder.children.filter((child): child is PageTree.Item => child.type === "page"),
  ];
  if (pages.length < 2) return undefined;
  return {
    label: typeof folder.name === "string" ? folder.name : "Section",
    items: pages.map((item) => ({
      label: String(item.name),
      href: item.url,
      current: item.url === url,
    })),
  };
}

/** fumadocs `useFooterItems`와 같은 순서: 폴더 index 먼저, 외부 링크 제외. */
function flattenFooterItems(root: PageTree.Root): PrevNextLink[] {
  const list: PrevNextLink[] = [];
  const visit = (node: PageTree.Node) => {
    if (node.type === "folder") {
      if (node.index) visit(node.index);
      for (const child of node.children) visit(child);
    } else if (node.type === "page" && !node.external) {
      list.push({ label: String(node.name), href: node.url });
    }
  };
  for (const child of root.children) visit(child);
  return list;
}

function prevNextOf(items: PrevNextLink[], url: string): DocsPageView["prevNext"] {
  const norm = (value: string) => value.replace(/\/$/, "");
  const index = items.findIndex((item) => norm(item.href) === norm(url));
  if (index === -1) return {};
  return { prev: items[index - 1], next: items[index + 1] };
}

// meta.json `layout: "tabs"`를 폴더 노드에 기록해 탭형 헤더와 사이드바가 함께 사용한다.
function tabbedFolderTransformer<S extends ContentStorage>(): PageTreeTransformer<S> {
  return {
    folder(node, _folderPath, metaPath) {
      if (!metaPath || !node.index) return node;
      const meta = this.storage.read(metaPath);
      const data =
        meta?.format === "meta"
          ? (meta.data as { layout?: string; description?: string; coverImage?: string })
          : undefined;
      if (data?.layout !== "tabs") return node;

      markTabbedFolder(node);
      const tabbed = node as TabbedFolderNode;
      if (data.description) tabbed.description = data.description;
      if (data.coverImage) tabbed.coverImage = data.coverImage;
      return node;
    },
  };
}

function featuredTransformer<S extends ContentStorage>(): PageTreeTransformer<S> {
  return {
    file(node, filePath) {
      if (!filePath) return node;
      const file = this.storage.read(filePath);
      if (file?.format === "page" && (file.data as { featured?: boolean }).featured === true) {
        markFeatured(node);
      }
      return node;
    },
  };
}

/** page tree의 아이콘은 이름 문자열로 둔다(직렬화 가능). 사이드바는 아이콘을 그리지 않는다. */
const iconHandler = (icon: string | undefined) => (icon === "Lock" ? icon : undefined);

/** Fumadocs page tree → 직렬화 가능한 사이드바 그룹. `components/layout/docs-side-navigation-items.tsx`와 같은 규칙. */
function buildNavGroups(nodes: PageTree.Node[]): NavGroup[] {
  const name = (node: { name?: unknown }) => String(node.name);
  const leaf = (page: PageTree.Item, index: number, level: number): NavLink => ({
    kind: "link",
    key: page.$id ?? page.url ?? String(index),
    label: name(page),
    href: page.url,
    level,
    ...(page.external === true ? { external: true } : {}),
    ...(isFeatured(page) ? { featured: true } : {}),
  });
  const flatten = (
    node: PageTree.Node,
    level: number,
  ): Array<{ page: PageTree.Item; level: number }> => {
    if (node.type === "page") return [{ page: node, level }];
    if (node.type === "folder")
      return [
        ...(node.index ? [{ page: node.index, level }] : []),
        ...node.children.flatMap((child) => flatten(child, level + 1)),
      ];
    return [];
  };

  const groups: NavGroup[] = [];
  let current: NavGroup = { key: "__initial", items: [] };
  const flush = () => {
    if (current.items.length > 0 || current.label != null) groups.push(current);
  };

  nodes.forEach((node, index) => {
    if (node.type === "separator") {
      flush();
      current = {
        key: node.$id ?? `sep-${index}`,
        ...(node.name == null ? { divider: true } : { label: name(node) }),
        items: [],
      };
      return;
    }
    if (node.type === "page") {
      current.items.push(leaf(node, index, 0));
      return;
    }
    if (node.type !== "folder") return;
    // meta.pages에 명시한 "index"는 node.index가 아니라 children에 들어간다. 원천 경로로 찾는다.
    const indexPath = node.$ref ? `${node.$ref.folder}/index` : undefined;
    const indexPage =
      node.index ??
      node.children.find(
        (child): child is PageTree.Item =>
          child.type === "page" &&
          indexPath != null &&
          (child.$ref === `${indexPath}.mdx` || child.$ref === `${indexPath}.md`),
      );
    const indexUrl = indexPage?.url;
    // 탭형 subject 폴더는 펼치지 않고 leaf 하나로(인덱스로 링크). 자식 탭은 페이지 상단 탭 스트립에서만 보인다.
    if (isTabbedFolder(node) && indexUrl != null && indexPage) {
      current.items.push({
        kind: "link",
        key: node.$id ?? `tabbed-folder-${index}`,
        label: name(node),
        href: indexUrl,
        level: 0,
        ...(isFeatured(indexPage) ? { featured: true } : {}),
        alsoCurrentFor: flatten(node, 0)
          .map(({ page }) => page.url)
          .filter((url) => url !== indexUrl),
      });
      return;
    }
    const folder: NavFolder = {
      kind: "folder",
      key: node.$id ?? `folder-${index}`,
      label: name(node),
      defaultOpen: node.defaultOpen ?? false,
      collapsible: node.collapsible ?? true,
      ...(indexPage ? { index: leaf(indexPage, index, 0) } : {}),
      items: node.children
        .filter((child) => child.type !== "page" || child.url !== indexUrl)
        .flatMap((child) => flatten(child, 2))
        .map(({ page, level }, pageIndex) => leaf(page, pageIndex, level)),
    };
    current.items.push(folder);
  });
  flush();
  return groups;
}

async function createSection(config: SectionConfig) {
  const entries = await getCollection(config.id);
  const meta = config.hasMeta ? await getCollection(`${config.id}-meta` as CollectionKey) : [];
  const source = loader(toFumadocsSource(entries, meta), {
    baseUrl: config.baseUrl,
    icon: iconHandler,
    pageTree: { transformers: [tabbedFolderTransformer(), featuredTransformer()] },
  });
  const root = source.getPageTree();
  const groups = buildNavGroups(root.children);
  const nav: SectionNav = {
    section: config.id,
    label: config.label,
    groups,
    digest: createHash("sha256").update(JSON.stringify(groups)).digest("base64url").slice(0, 27),
  };
  // fumadocs page의 `path`가 content entry id다.
  const digests = new Map(entries.map((entry) => [entry.id, String(entry.digest ?? "")]));
  const entryById = new Map(entries.map((entry) => [entry.id, entry]));
  return {
    config,
    source,
    nav,
    digests,
    entries: entryById,
    footerItems: flattenFooterItems(root),
  };
}

type LoadedSection = Awaited<ReturnType<typeof createSection>>;
const sections = new Map<SectionId, Promise<LoadedSection>>();

/** 섹션당 한 번 만든다(module 캐시). parallelPrerender를 켜면 worker마다 따로 만들어진다. */
function getSection(id: SectionId): Promise<LoadedSection> {
  let section = sections.get(id);
  if (!section) {
    section = createSection(getSectionConfig(id));
    sections.set(id, section);
  }
  return section;
}
