import chalk from "chalk";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "node:path";
import type { DocsCategory, DocsIndex, DocsItem, DocsSection } from "../../packages/cli/src/schema";
import {
  type Section,
  sectionConfigs,
  sections,
  shouldIncludeInFullText,
} from "../app/_llms/config";

type DocsSnippet = NonNullable<DocsItem["snippets"]>[number];

type RegistryItem = {
  id: string;
  snippets: Array<{ path: string }>;
};

type RegistryIndex = {
  id: string;
  items: RegistryItem[];
};

type Frontmatter = {
  title?: string;
  description?: string;
  deprecated?: boolean;
};

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
function collectMdxFiles(dir: string, base = ""): string[] {
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

const SNIPPET_EXT_LABELS: Record<string, string> = {
  ".tsx": "react",
  ".ts": "ts",
  ".jsx": "react",
  ".js": "js",
  ".css": "css",
  ".module.css": "css",
};

export function getSnippetLabel(filePath: string): string {
  // Check longer extensions first (e.g. .module.css before .css)
  if (filePath.endsWith(".module.css")) return "css";
  const ext = path.extname(filePath);
  return SNIPPET_EXT_LABELS[ext] ?? ext.replace(".", "");
}

/**
 * Build `"{framework}/{registryId}:{itemId}" -> snippets` from the public registry
 * indexes that any section actually references.
 */
function buildRegistryMap(): Map<string, DocsSnippet[]> {
  const map = new Map<string, DocsSnippet[]>();
  const registryIds = new Set(sections.flatMap((s) => sectionConfigs[s].snippetRegistries));

  for (const registryId of registryIds) {
    try {
      const raw = readFileSync(
        path.join(process.cwd(), `public/__registry__/${registryId}/index.json`),
        "utf-8",
      );
      const registry = JSON.parse(raw) as RegistryIndex;
      for (const item of registry.items) {
        if (item.snippets.length > 0) {
          map.set(
            `${registryId}:${item.id}`,
            item.snippets.map((s) => ({ label: getSnippetLabel(s.path), path: s.path })),
          );
        }
      }
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }

  return map;
}

/**
 * Resolve the section an item belongs to within its category.
 *
 * `byFirstSlug` needs at least two slugs to have a first slug distinct from the item;
 * a page sitting directly under the section root falls back to the section itself
 * rather than becoming a section named after its only member.
 */
function resolveSectionId(section: Section, slugs: string[]): string {
  const { grouping } = sectionConfigs[section];
  if (grouping.kind === "flat") return grouping.id;
  return slugs.length >= 2 ? slugs[0] : section;
}

function resolveSectionLabel(section: Section, sectionId: string): string {
  const { grouping } = sectionConfigs[section];
  if (grouping.kind === "flat") return grouping.label;

  // `satisfies`가 리터럴 키를 보존해서 labels는 Record가 아니라 구체 형태로 좁혀진다.
  const labels: Record<string, string> = grouping.labels;
  return labels[sectionId] ?? sectionId;
}

/** Declared label order first, unknown sections alphabetically at the end. */
function compareSectionIds(section: Section, a: string, b: string): number {
  const { grouping } = sectionConfigs[section];
  const order = grouping.kind === "flat" ? [] : Object.keys(grouping.labels);
  const ai = order.indexOf(a);
  const bi = order.indexOf(b);
  if (ai === -1 && bi === -1) return a.localeCompare(b);
  if (ai === -1) return 1;
  if (bi === -1) return -1;
  return ai - bi;
}

export function compareDocsItems(a: DocsItem, b: DocsItem): number {
  if (a.id !== b.id) return a.id < b.id ? -1 : 1;
  if (a.docUrl === b.docUrl) return 0;
  return a.docUrl < b.docUrl ? -1 : 1;
}

async function main() {
  console.log(chalk.gray("Generating Docs Index..."));

  const contentDir = path.join(process.cwd(), "content");
  const registryMap = buildRegistryMap();
  const categories: DocsCategory[] = [];

  for (const section of sections) {
    const config = sectionConfigs[section];
    const sourceDir = path.join(contentDir, config.contentDir);

    // Every section in the registry names a directory that must exist. Skipping a missing one
    // would drop its whole section from the index while the build still reports success.
    if (!existsSync(sourceDir)) {
      throw new Error(
        `Content directory not found: ${sourceDir}. Update \`sectionConfigs\` if it moved.`,
      );
    }

    // sectionId -> DocsItem[]
    const sectionsMap = new Map<string, DocsItem[]>();

    for (const relPath of collectMdxFiles(sourceDir)) {
      if (!shouldIncludeInFullText(section, relPath)) continue;

      const slugs = filePathToSlugs(relPath);
      if (!slugs || slugs.length === 0) continue;

      const frontmatter = matter(readFileSync(path.join(sourceDir, relPath), "utf-8"))
        .data as Frontmatter;
      if (!frontmatter.title) continue;

      const itemId = slugs[slugs.length - 1];
      const snippetKey = config.snippetRegistries
        .map((registryId) => `${registryId}:${itemId}`)
        .find((key) => registryMap.has(key));

      const item: DocsItem = {
        id: itemId,
        title: frontmatter.title,
        ...(frontmatter.description && { description: frontmatter.description }),
        docUrl: `${config.baseUrl}/${slugs.join("/")}`,
        ...(frontmatter.deprecated && { deprecated: true }),
        ...(snippetKey && { snippetKey, snippets: registryMap.get(snippetKey) }),
      };

      const sectionId = resolveSectionId(section, slugs);
      const items = sectionsMap.get(sectionId);
      if (items) {
        items.push(item);
      } else {
        sectionsMap.set(sectionId, [item]);
      }
    }

    if (sectionsMap.size === 0) continue;

    const docsSections: DocsSection[] = Array.from(sectionsMap.entries())
      .sort(([a], [b]) => compareSectionIds(section, a, b))
      .map(([sectionId, items]) => ({
        id: sectionId,
        label: resolveSectionLabel(section, sectionId),
        items: items.sort(compareDocsItems),
      }));

    categories.push({ id: section, label: config.label, sections: docsSections });
  }

  const outDir = path.join(process.cwd(), "public", "__docs__");
  if (!existsSync(outDir)) {
    await fs.mkdir(outDir, { recursive: true });
  }

  const docsIndex: DocsIndex = { categories };
  await fs.writeFile(path.join(outDir, "index.json"), JSON.stringify(docsIndex, null, 2), "utf8");

  const totalItems = categories.reduce(
    (sum, c) => sum + c.sections.reduce((s, sec) => s + sec.items.length, 0),
    0,
  );
  const totalSections = categories.reduce((sum, c) => sum + c.sections.length, 0);
  console.log(
    chalk.green(
      `Docs Index Generated! (${categories.length} categories, ${totalSections} sections, ${totalItems} items)`,
    ),
  );
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(chalk.red("Failed to generate docs index:"), error);
    process.exit(1);
  });
}
