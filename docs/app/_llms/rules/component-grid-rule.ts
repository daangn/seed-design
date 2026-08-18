import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { baseUrl } from "@/app/metadata";
import { getComponentsSource, getFoundationsSource, getPatternsSource } from "@/app/source";
import { getLLMMarkdownUrl } from "../config";
import type { Section } from "../types";
import type { Rule } from "./types";

export interface ComponentEntry {
  title: string;
  description: string;
  url: string;
}

/** 섹션 키(`/components/` 등)별 카탈로그 항목. 키는 `toSectionKey`가 만든다. */
export type CatalogEntries = Record<string, ComponentEntry[]>;

const DEFAULT_PREFIX = "/components/";

const CATALOG_SECTIONS = [
  ["components", getComponentsSource],
  ["foundations", getFoundationsSource],
  ["patterns", getPatternsSource],
] as const satisfies ReadonlyArray<readonly [Section, unknown]>;

/** `pathPrefix` 값을 `CatalogEntries`의 키로 맞춘다. `/docs/components/`도 `/components/`로 본다. */
function toSectionKey(pathPrefix: string): string {
  const segments = pathPrefix
    .replace(/(^\/)|(\/$)/g, "")
    .split("/")
    .filter((segment) => segment && segment !== "docs");

  return `/${segments.join("/")}/`;
}

/**
 * 시각 카탈로그(`components/catalog/grid.tsx`)와 같은 pageTree를 걸어 섹션의 상위 항목을 모은다.
 * 폴더는 대표 페이지 하나로 접히므로 폴더 안쪽 페이지(예: foundations/color/palette)는 빠진다.
 */
export async function loadCatalogEntries(): Promise<CatalogEntries> {
  const sections = await Promise.all(
    CATALOG_SECTIONS.map(async ([section, getSource]) => {
      const source = await getSource();
      const pageByUrl = new Map(source.getPages().map((page) => [page.url, page]));

      const entries = source.pageTree.children.flatMap((node) => {
        if (node.type === "separator") return [];

        // index 없는 폴더(`components/(deprecated)`)는 대표로 삼을 페이지가 없어 빠진다.
        const url = node.type === "folder" ? node.index?.url : node.url;
        const page = url === undefined ? undefined : pageByUrl.get(url);
        // slugs가 비면 섹션 자신의 index다. 스스로를 목록에 넣지 않는다.
        if (!page || page.slugs.length === 0 || page.data.frontmatter.deprecated) return [];

        // 폴더 index의 title은 "Overview"라 목록에서 서로 구분되지 않는다. 시각 카탈로그와
        // 같이 폴더 이름을 쓰되, 아이콘이 섞여 문자열이 아니면 페이지 제목으로 물러난다.
        const title =
          node.type === "folder" && typeof node.name === "string" ? node.name : page.data.title;

        return [
          {
            title,
            description: page.data.description ?? "",
            url: new URL(getLLMMarkdownUrl(section, page.slugs), baseUrl).toString(),
          },
        ];
      });

      return [`/${section}/`, entries] as const;
    }),
  );

  return Object.fromEntries(sections);
}

function readPathPrefix(node: MdxJsxFlowElement): string {
  for (const attr of node.attributes) {
    if (
      attr.type === "mdxJsxAttribute" &&
      attr.name === "pathPrefix" &&
      typeof attr.value === "string"
    ) {
      return attr.value;
    }
  }
  return DEFAULT_PREFIX;
}

export function buildMarkdown(entries: ComponentEntry[]): string {
  return [...entries]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((entry) => {
      const suffix = entry.description ? ` — ${entry.description}` : "";
      return `- [${entry.title}](${entry.url})${suffix}`;
    })
    .join("\n");
}

/**
 * 항목을 인자로 받아 테스트가 실데이터 없이 룰을 만들 수 있게 한다.
 * `load`는 `init`이 한 번만 부르고, `transform`은 그 결과를 동기로 읽는다.
 */
export function createComponentGridRule(
  load: () => Promise<CatalogEntries>,
): Rule<MdxJsxFlowElement> {
  let catalogEntries: CatalogEntries | null = null;
  let initPromise: Promise<void> | null = null;

  return {
    name: "CatalogGrid",
    init: () => {
      initPromise ??= load().then((loaded) => {
        catalogEntries = loaded;
      });
      return initPromise;
    },
    match: (node): node is MdxJsxFlowElement =>
      node.type === "mdxJsxFlowElement" && node.name === "CatalogGrid",
    transform: (node) => {
      try {
        // init 전이면 null이다. 항목이 없을 때와 같이 원본 노드를 돌려준다.
        const entries = catalogEntries?.[toSectionKey(readPathPrefix(node))] ?? [];
        if (entries.length === 0) return [node];

        return [{ type: "html", value: buildMarkdown(entries) }];
      } catch (error) {
        console.warn("[CatalogGrid] transform failed; falling back to original MDX node:", error);
        return [node];
      }
    },
  };
}

export const componentGridRule = createComponentGridRule(loadCatalogEntries);
