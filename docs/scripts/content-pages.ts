import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { type Section, sectionConfigs, shouldIncludeInFullText } from "../app/_llms/config";

/**
 * Convert a file path relative to its content dir into URL slugs.
 * Strips route groups (parenthesized dirs) and the .mdx extension.
 *
 * The section root `index.mdx` yields an empty array — it is a real page (the section
 * landing) that simply has no slug of its own, so callers must not read that as "skip".
 */
export function filePathToSlugs(relPath: string): string[] {
  // Remove .mdx extension
  let clean = relPath.replace(/\.mdx$/, "");

  // Remove route group directories (e.g., "(buttons)/")
  clean = clean.replace(/\([^)]+\)\//g, "");

  // Handle index files
  if (clean === "index") return [];
  if (clean.endsWith("/index")) {
    clean = clean.replace(/\/index$/, "");
  }

  return clean.split("/").filter(Boolean);
}

/**
 * Recursively collect all .mdx files from a directory.
 */
export function collectMdxFiles(dir: string, base = ""): string[] {
  if (!existsSync(dir)) return [];

  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const relPath = base ? `${base}/${entry}` : entry;
    if (statSync(fullPath).isDirectory()) {
      results.push(...collectMdxFiles(fullPath, relPath));
    } else if (entry.endsWith(".mdx")) {
      results.push(relPath);
    }
  }
  return results;
}

export interface ContentPage {
  /** Path relative to the section's content dir, e.g. `color/palette.mdx`. */
  relPath: string;
  slugs: string[];
}

/**
 * Every routable page of a section, with `excludePaths` applied.
 * `contentRoot` defaults to `content/` under the current working directory.
 */
export function listSectionPages(section: Section, contentRoot?: string): ContentPage[] {
  const root = contentRoot ?? path.join(process.cwd(), "content");
  const sourceDir = path.join(root, sectionConfigs[section].contentDir);

  return collectMdxFiles(sourceDir)
    .filter((relPath) => shouldIncludeInFullText(section, relPath))
    .map((relPath) => ({ relPath, slugs: filePathToSlugs(relPath) }));
}
