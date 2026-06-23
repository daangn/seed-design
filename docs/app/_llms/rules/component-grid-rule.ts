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

function resolveComponentsDir(): string | null {
  const candidates = [
    path.resolve(process.cwd(), "content/docs/components"),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../content/docs/components"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  console.warn(`[ComponentGrid] components directory not found; tried: ${candidates.join(", ")}`);
  return null;
}

function loadEntries(): ComponentEntry[] {
  const componentsDir = resolveComponentsDir();
  if (!componentsDir) return [];

  const entries: ComponentEntry[] = [];
  for (const dirent of fs.readdirSync(componentsDir, { withFileTypes: true })) {
    if (!dirent.isFile() || !dirent.name.endsWith(".mdx")) continue;
    if (dirent.name === "index.mdx") continue;

    const source = fs.readFileSync(path.join(componentsDir, dirent.name), "utf8");
    const fm = matter(source).data as Frontmatter;
    if (fm.deprecated) continue;

    const slug = dirent.name.slice(0, -".mdx".length);
    entries.push({
      title: fm.title ?? slug,
      description: fm.description ?? "",
      url: new URL(getLLMMarkdownUrl("docs", ["components", slug]), baseUrl).toString(),
    });
  }
  return entries;
}

let cachedEntries: ComponentEntry[] | null = null;

function getEntries(): ComponentEntry[] {
  if (cachedEntries === null) cachedEntries = loadEntries();
  return cachedEntries;
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

export const componentGridRule: Rule = {
  name: "ComponentGrid",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "ComponentGrid",
  transform: (node) => {
    try {
      const entries = getEntries();
      if (entries.length === 0) return [node];
      return [{ type: "html", value: buildMarkdown(entries) }];
    } catch (error) {
      console.warn("[ComponentGrid] transform failed; falling back to original MDX node:", error);
      return [node];
    }
  },
};
