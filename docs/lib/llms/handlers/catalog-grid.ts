import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { baseUrl } from "@/app/metadata";
import { type CatalogGridManifestEntry, catalogGridManifest } from "../component-grid-manifest";
import type { LLMHandler } from "../types";

type CatalogGridManifest = Record<string, readonly CatalogGridManifestEntry[]>;

interface CatalogEntry {
  title: string;
  description: string;
  url: string;
}

const DEFAULT_PREFIX = "/components/";

/** "/foundations/" → ["foundation"], "/components/" → ["components"] */
function segmentsFromPrefix(pathPrefix: string): string[] {
  return pathPrefix
    .replace(/(^\/)|(\/$)/g, "")
    .split("/")
    .filter((segment) => segment && segment !== "docs");
}

function getEntries(manifest: CatalogGridManifest, pathPrefix: string): CatalogEntry[] {
  const segments = segmentsFromPrefix(pathPrefix);
  const entries = manifest[`/${segments.join("/")}/`];
  if (!entries) return [];

  return entries.map((entry) => ({
    title: entry.title,
    description: entry.description,
    url: new URL(getLLMMarkdownUrl("docs", [...segments, entry.slug]), baseUrl).toString(),
  }));
}

function buildMarkdown(entries: CatalogEntry[]): string {
  return [...entries]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(
      (entry) =>
        `- [${entry.title}](${entry.url})${entry.description ? ` — ${entry.description}` : ""}`,
    )
    .join("\n");
}

/**
 * `<CatalogGrid />`는 사이트에서 섹션의 카드 그리드를 그린다. llms 출력에서는 카드로
 * 보여줄 게 없으니, 각 문서의 마크다운 주소를 제목순 링크 목록으로 바꾼다.
 *
 * 나열할 문서를 찾지 못하면 태그를 그대로 둔다. 이 컴포넌트를 쓰는 페이지는 본문이
 * 이것뿐이라, 링크도 태그도 없으면 페이지가 빈 채로 남는다.
 *
 * 목록은 빌드 시점에 생성한 매니페스트에서 읽는다. 컨텐츠 디렉토리를 런타임에 뒤지면
 * Turbopack이 의존성을 추적하지 못하고, 번들된 빌드에서는 그 경로 자체가 없다. 어느
 * 페이지를 싣고 뺄지(deprecated·섹션 인덱스·제목 없는 문서)는 생성 스크립트가 정한다.
 */
export function createCatalogGridHandler(manifest: CatalogGridManifest): LLMHandler {
  return {
    names: ["CatalogGrid"],
    render: (_node, { attr }) => {
      const entries = getEntries(manifest, attr("pathPrefix") ?? DEFAULT_PREFIX);

      return entries.length > 0 ? buildMarkdown(entries) : undefined;
    },
  };
}

export const catalogGridHandler = createCatalogGridHandler(catalogGridManifest);
