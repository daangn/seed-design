import chalk from "chalk";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "node:path";

type DocsSnippet = {
  label: string;
  path: string;
};

type DocsItem = {
  id: string;
  title: string;
  description?: string;
  docUrl: string;
  deprecated?: boolean;
  snippetKey?: string;
  snippets?: DocsSnippet[];
};

type DocsSection = {
  id: string;
  label: string;
  items: DocsItem[];
};

type DocsCategory = {
  id: string;
  label: string;
  sections: DocsSection[];
};

type RegistryItem = {
  id: string;
  snippets: Array<{ path: string }>;
};

type RegistryIndex = {
  id: string;
  items: RegistryItem[];
};

const CATEGORY_LABELS: Record<string, string> = {
  docs: "Design",
  react: "React",
  breeze: "Breeze",
  lynx: "Lynx",
  "ai-integration": "AI Integration",
};

const CATEGORY_ORDER = ["docs", "react", "breeze", "lynx", "ai-integration"];

const SECTION_LABELS: Record<string, string> = {
  components: "컴포넌트",
  foundation: "파운데이션",
  guidelines: "가이드라인",
  migration: "마이그레이션",
  resources: "리소스",
  "getting-started": "시작하기",
  stackflow: "Stackflow",
  "developer-tools": "개발자 도구",
  updates: "업데이트",
  patterns: "패턴",
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
function filePathToSlugs(relPath: string): string[] | null {
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

const SNIPPET_EXT_LABELS: Record<string, string> = {
  ".tsx": "react",
  ".ts": "ts",
  ".jsx": "react",
  ".js": "js",
  ".css": "css",
  ".module.css": "css",
};

function getSnippetLabel(filePath: string): string {
  // Check longer extensions first (e.g. .module.css before .css)
  if (filePath.endsWith(".module.css")) return "css";
  const ext = path.extname(filePath);
  return SNIPPET_EXT_LABELS[ext] ?? ext.replace(".", "");
}

/**
 * Build a map of registry entries from public/__registry__/ index files.
 */
function buildRegistryMap(): Map<string, { registryId: string; snippets: DocsSnippet[] }> {
  const map = new Map<string, { registryId: string; snippets: DocsSnippet[] }>();

  for (const registryId of ["ui", "breeze"] as const) {
    try {
      const raw = readFileSync(
        path.join(process.cwd(), `public/__registry__/${registryId}/index.json`),
        "utf-8",
      );
      const registry = JSON.parse(raw) as RegistryIndex;
      for (const item of registry.items) {
        if (item.snippets.length > 0) {
          map.set(`${registryId}:${item.id}`, {
            registryId,
            snippets: item.snippets.map((s) => ({
              label: getSnippetLabel(s.path),
              path: s.path,
            })),
          });
        }
      }
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }

  return map;
}

async function main() {
  console.log(chalk.gray("Generating Docs Index..."));

  const contentDir = path.join(process.cwd(), "content");
  const registryMap = buildRegistryMap();

  const sources = [
    { dir: "docs", categoryId: "docs", baseUrl: "/docs" },
    { dir: "react", categoryId: "react", baseUrl: "/react" },
    { dir: "breeze", categoryId: "breeze", baseUrl: "/breeze" },
    { dir: "lynx", categoryId: "lynx", baseUrl: "/lynx" },
    { dir: "ai-integration", categoryId: "ai-integration", baseUrl: "/ai-integration" },
  ];

  // categoryId -> sectionId -> DocsItem[]
  const categorySectionsMap = new Map<string, Map<string, DocsItem[]>>();

  for (const { dir, categoryId, baseUrl } of sources) {
    const sourceDir = path.join(contentDir, dir);
    const mdxFiles = collectMdxFiles(sourceDir);

    for (const relPath of mdxFiles) {
      const slugs = filePathToSlugs(relPath);
      if (!slugs || slugs.length === 0) continue;

      const fullPath = path.join(sourceDir, relPath);
      const content = readFileSync(fullPath, "utf-8");
      const frontmatter = matter(content).data as Frontmatter;
      if (!frontmatter.title) continue;

      // Section ID is the first slug for multi-level categories,
      // or "components" as default for flat categories (breeze, lynx, ai-integration)
      const sectionId = categoryId === "docs" || categoryId === "react" ? slugs[0] : "components";

      const itemId = slugs[slugs.length - 1];
      const docUrl = `${baseUrl}/${slugs.join("/")}`;

      const registryEntry = registryMap.get(`ui:${itemId}`) ?? registryMap.get(`breeze:${itemId}`);

      const item: DocsItem = {
        id: itemId,
        title: frontmatter.title,
        ...(frontmatter.description && { description: frontmatter.description }),
        docUrl,
        ...(frontmatter.deprecated && { deprecated: true }),
        ...(registryEntry && {
          snippetKey: `${registryEntry.registryId}:${itemId}`,
          snippets: registryEntry.snippets,
        }),
      };

      if (!categorySectionsMap.has(categoryId)) {
        categorySectionsMap.set(categoryId, new Map());
      }
      const sectionsMap = categorySectionsMap.get(categoryId)!;
      if (!sectionsMap.has(sectionId)) {
        sectionsMap.set(sectionId, []);
      }
      sectionsMap.get(sectionId)!.push(item);
    }
  }

  // Build ordered categories
  const categories: DocsCategory[] = [];

  for (const categoryId of CATEGORY_ORDER) {
    const sectionsMap = categorySectionsMap.get(categoryId);
    if (!sectionsMap || sectionsMap.size === 0) continue;

    const sections: DocsSection[] = [];
    for (const [sectionId, items] of sectionsMap) {
      if (items.length > 0) {
        sections.push({
          id: sectionId,
          label: SECTION_LABELS[sectionId] ?? sectionId,
          items: items.sort((a, b) => a.id.localeCompare(b.id)),
        });
      }
    }

    // Sort sections: known ones first (by SECTION_LABELS order), unknown ones at the end
    const knownOrder = Object.keys(SECTION_LABELS);
    sections.sort((a, b) => {
      const ai = knownOrder.indexOf(a.id);
      const bi = knownOrder.indexOf(b.id);
      if (ai === -1 && bi === -1) return a.id.localeCompare(b.id);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    categories.push({
      id: categoryId,
      label: CATEGORY_LABELS[categoryId] ?? categoryId,
      sections,
    });
  }

  // Write output
  const outDir = path.join(process.cwd(), "public", "__docs__");
  if (!existsSync(outDir)) {
    await fs.mkdir(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, "index.json");
  await fs.writeFile(outPath, JSON.stringify({ categories }, null, 2), "utf8");

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

main().catch((error) => {
  console.error(chalk.red("Failed to generate docs index:"), error);
  process.exit(1);
});
