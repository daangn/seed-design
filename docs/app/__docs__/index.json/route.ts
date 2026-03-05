import { readFileSync } from "fs";
import path from "path";
import type { LLMPage } from "@/app/_llms/types";
import {
  docsSource,
  reactSource,
  breezeSource,
  lynxSource,
  aiIntegrationSource,
} from "@/app/source";

export const dynamic = "force-static";

type RegistryItem = {
  id: string;
  snippets: Array<{ path: string }>;
};

type RegistryIndex = {
  id: string;
  items: RegistryItem[];
};

type DocsItem = {
  id: string;
  title: string;
  description?: string;
  docUrl: string;
  deprecated?: boolean;
  snippetKey?: string;
  snippetPath?: string;
};

type DocsSection = {
  id: string;
  label: string;
  items: DocsItem[];
};

const SECTION_LABELS: Record<string, string> = {
  "docs/components": "UI 컴포넌트 가이드라인",
  "docs/foundation": "파운데이션",
  "docs/guidelines": "가이드라인",
  "docs/migration": "마이그레이션",
  "docs/resources": "리소스",
  "react/components": "React 컴포넌트",
  "react/getting-started": "React 시작하기",
  "react/stackflow": "Stackflow",
  "react/developer-tools": "개발자 도구",
  "react/migration": "React 마이그레이션",
  "react/updates": "React 업데이트",
  "react/patterns": "React 패턴",
  "breeze/components": "Breeze 컴포넌트",
  lynx: "Lynx",
  "ai-integration": "AI Integration",
};

const SECTION_ORDER = [
  "docs/components",
  "docs/foundation",
  "docs/guidelines",
  "docs/migration",
  "docs/resources",
  "react/components",
  "react/getting-started",
  "react/stackflow",
  "react/developer-tools",
  "react/migration",
  "react/updates",
  "react/patterns",
  "breeze/components",
  "lynx",
  "ai-integration",
];

function buildRegistryMap(): Map<string, { registryId: string; snippetPath: string }> {
  const map = new Map<string, { registryId: string; snippetPath: string }>();

  for (const registryId of ["ui", "breeze"] as const) {
    try {
      const raw = readFileSync(
        path.join(process.cwd(), `public/__registry__/${registryId}/index.json`),
        "utf-8",
      );
      const registry = JSON.parse(raw) as RegistryIndex;
      for (const item of registry.items) {
        if (item.snippets.length > 0) {
          // composite key to avoid collision across registries
          map.set(`${registryId}:${item.id}`, {
            registryId,
            snippetPath: item.snippets[0].path,
          });
        }
      }
    } catch (err) {
      // only ignore missing registry files; surface other errors (parse failures, permission issues, etc.)
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }

  return map;
}

export async function GET() {
  const registryMap = buildRegistryMap();

  const sources = [
    { source: docsSource, prefix: "docs" },
    { source: reactSource, prefix: "react" },
    { source: breezeSource, prefix: "breeze" },
    { source: lynxSource, prefix: "lynx" },
    { source: aiIntegrationSource, prefix: "ai-integration" },
  ];

  const sectionsMap = new Map<string, DocsItem[]>();

  for (const { source, prefix } of sources) {
    const pages = source.getPages() as LLMPage[];

    for (const page of pages) {
      if (page.slugs.length === 0) continue;

      const sectionId =
        prefix === "docs" || prefix === "react"
          ? `${prefix}/${page.slugs[0]}`
          : prefix === "breeze"
            ? "breeze/components"
            : prefix;

      const itemId = page.slugs[page.slugs.length - 1];
      // look up by composite key matching the format used in buildRegistryMap
      const registryEntry = registryMap.get(`ui:${itemId}`) ?? registryMap.get(`breeze:${itemId}`);

      const item: DocsItem = {
        id: itemId,
        title: page.data.title,
        ...(page.data.description && { description: page.data.description }),
        docUrl: page.url,
        ...((page.data as { deprecated?: boolean }).deprecated && { deprecated: true }),
        ...(registryEntry && {
          snippetKey: `${registryEntry.registryId}:${itemId}`,
          snippetPath: registryEntry.snippetPath,
        }),
      };

      if (!sectionsMap.has(sectionId)) {
        sectionsMap.set(sectionId, []);
      }
      sectionsMap.get(sectionId)!.push(item);
    }
  }

  const sections: DocsSection[] = [];

  for (const sectionId of SECTION_ORDER) {
    const items = sectionsMap.get(sectionId);
    if (items && items.length > 0) {
      sections.push({
        id: sectionId,
        label: SECTION_LABELS[sectionId] ?? sectionId,
        items: items.sort((a, b) => a.id.localeCompare(b.id)),
      });
      sectionsMap.delete(sectionId);
    }
  }

  for (const [sectionId, items] of sectionsMap) {
    if (items.length > 0) {
      sections.push({
        id: sectionId,
        label: SECTION_LABELS[sectionId] ?? sectionId,
        items: items.sort((a, b) => a.id.localeCompare(b.id)),
      });
    }
  }

  return Response.json({ sections });
}
