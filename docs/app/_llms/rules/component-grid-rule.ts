import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { baseUrl } from "@/app/metadata";
import { getLLMMarkdownUrl } from "../config";
import type { Rule } from "./types";

export interface ComponentEntry {
  title: string;
  description: string;
  url: string;
}

type Frontmatter = {
  title?: string;
  description?: string;
  deprecated?: boolean;
};

const DEFAULT_PREFIX = "/components/";

/** "/foundations/" → ["foundation"], "/components/" → ["components"] */
function segmentsFromPrefix(pathPrefix: string): string[] {
  return pathPrefix
    .replace(/(^\/)|(\/$)/g, "")
    .split("/")
    .filter((segment) => segment && segment !== "docs");
}

function resolveSectionDir(segments: string[]): string | null {
  const rel = path.join("content", "docs", ...segments);
  const candidates = [
    path.resolve(process.cwd(), rel),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../", rel),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  console.warn(`[CatalogGrid] section directory not found; tried: ${candidates.join(", ")}`);
  return null;
}

// top-level .mdx만 나열한다. 하위 폴더(예: foundation/color)는 LLM 목록에서 빠지지만,
// 시각 카탈로그(grid.tsx)는 폴더를 대표 카드로 보여준다.
function loadEntries(segments: string[]): ComponentEntry[] {
  const dir = resolveSectionDir(segments);
  if (!dir) return [];

  const entries: ComponentEntry[] = [];
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!dirent.isFile() || !dirent.name.endsWith(".mdx")) continue;
    if (dirent.name === "index.mdx") continue;

    const source = fs.readFileSync(path.join(dir, dirent.name), "utf8");
    const fm = matter(source).data as Frontmatter;
    if (fm.deprecated) continue;

    const slug = dirent.name.slice(0, -".mdx".length);
    entries.push({
      title: fm.title ?? slug,
      description: fm.description ?? "",
      url: new URL(getLLMMarkdownUrl("docs", [...segments, slug]), baseUrl).toString(),
    });
  }
  return entries;
}

const entryCache = new Map<string, ComponentEntry[]>();

function getEntries(pathPrefix: string): ComponentEntry[] {
  const cached = entryCache.get(pathPrefix);
  if (cached) return cached;
  const entries = loadEntries(segmentsFromPrefix(pathPrefix));
  entryCache.set(pathPrefix, entries);
  return entries;
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

export const componentGridRule: Rule<MdxJsxFlowElement> = {
  name: "CatalogGrid",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "CatalogGrid",
  transform: (node) => {
    try {
      const entries = getEntries(readPathPrefix(node));
      if (entries.length === 0) return [node];
      return [{ type: "html", value: buildMarkdown(entries) }];
    } catch (error) {
      console.warn("[CatalogGrid] transform failed; falling back to original MDX node:", error);
      return [node];
    }
  },
};
