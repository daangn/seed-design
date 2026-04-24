import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { baseUrl } from "@/app/metadata";
import { getLLMMarkdownUrl } from "../config";
import type { Rule } from "./types";

export interface ComponentEntry {
  category: string;
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

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function loadEntries(): ComponentEntry[] {
  const componentsDir = resolveComponentsDir();
  if (!componentsDir) return [];

  const entries: ComponentEntry[] = [];
  for (const dirent of fs.readdirSync(componentsDir, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const match = dirent.name.match(/^\(([^)]+)\)$/);
    if (!match) continue;

    const category = titleCase(match[1]);
    const categoryDir = path.join(componentsDir, dirent.name);

    for (const file of fs.readdirSync(categoryDir)) {
      if (!file.endsWith(".mdx")) continue;

      const source = fs.readFileSync(path.join(categoryDir, file), "utf8");
      const fm = matter(source).data as Frontmatter;
      if (fm.deprecated) continue;

      const slug = file.slice(0, -".mdx".length);
      entries.push({
        category,
        title: fm.title ?? slug,
        description: fm.description ?? "",
        url: new URL(getLLMMarkdownUrl("docs", ["components", slug]), baseUrl).toString(),
      });
    }
  }
  return entries;
}

let cachedEntries: ComponentEntry[] | null = null;

function getEntries(): ComponentEntry[] {
  if (cachedEntries === null) cachedEntries = loadEntries();
  return cachedEntries;
}

export function buildMarkdown(entries: ComponentEntry[]): string {
  const grouped = new Map<string, ComponentEntry[]>();
  for (const entry of entries) {
    if (!grouped.has(entry.category)) grouped.set(entry.category, []);
    grouped.get(entry.category)!.push(entry);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  const sections: string[] = [];
  for (const [category, list] of Array.from(grouped.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const lines = [`## ${category}`, ""];
    for (const entry of list) {
      const suffix = entry.description ? ` — ${entry.description}` : "";
      lines.push(`- [${entry.title}](${entry.url})${suffix}`);
    }
    sections.push(lines.join("\n"));
  }
  return sections.join("\n\n");
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
    } catch {
      return [node];
    }
  },
};
