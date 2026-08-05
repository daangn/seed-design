import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { type Section, sectionConfigs, shouldIncludeInFullText } from "../app/_llms/config";

/**
 * Convert a file path relative to its content dir into URL slugs.
 * Strips route groups (parenthesized dirs) and the .mdx extension.
 * Returns null for index files at the content dir root.
 */
export function filePathToSlugs(relPath: string): string[] | null {
  // Remove .mdx extension
  let clean = relPath.replace(/\.mdx$/, "");

  // Remove route group directories (e.g., "(buttons)/")
  clean = clean.replace(/\([^)]+\)\//g, "");

  // Handle index files
  if (clean === "index") return null;
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
 * Every routable page of a section, with `excludePaths` and root index files applied.
 * `contentRoot` defaults to `content/` under the current working directory.
 */
export function listSectionPages(section: Section, contentRoot?: string): ContentPage[] {
  const root = contentRoot ?? path.join(process.cwd(), "content");
  const sourceDir = path.join(root, sectionConfigs[section].contentDir);

  return collectMdxFiles(sourceDir).flatMap((relPath) => {
    if (!shouldIncludeInFullText(section, relPath)) return [];

    const slugs = filePathToSlugs(relPath);
    if (!slugs || slugs.length === 0) return [];

    return [{ relPath, slugs }];
  });
}
