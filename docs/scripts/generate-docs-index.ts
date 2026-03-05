import chalk from "chalk";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { promises as fs } from "fs";
import path from "node:path";

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

type RegistryItem = {
  id: string;
  snippets: Array<{ path: string }>;
};

type RegistryIndex = {
  id: string;
  items: RegistryItem[];
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

/**
 * Parse YAML frontmatter from an MDX file.
 * Returns null if no frontmatter is found.
 */
function parseFrontmatter(content: string): Record<string, string> | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const result: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    result[key] = value;
  }
  return result;
}

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

/**
 * Build a map of registry entries from public/__registry__/ index files.
 */
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
          map.set(`${registryId}:${item.id}`, {
            registryId,
            snippetPath: item.snippets[0].path,
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
    { dir: "docs", prefix: "docs", baseUrl: "/docs" },
    { dir: "react", prefix: "react", baseUrl: "/react" },
    { dir: "breeze", prefix: "breeze", baseUrl: "/breeze" },
    { dir: "lynx", prefix: "lynx", baseUrl: "/lynx" },
    { dir: "ai-integration", prefix: "ai-integration", baseUrl: "/ai-integration" },
  ];

  const sectionsMap = new Map<string, DocsItem[]>();

  for (const { dir, prefix, baseUrl } of sources) {
    const sourceDir = path.join(contentDir, dir);
    const mdxFiles = collectMdxFiles(sourceDir);

    for (const relPath of mdxFiles) {
      const slugs = filePathToSlugs(relPath);
      if (!slugs || slugs.length === 0) continue;

      const fullPath = path.join(sourceDir, relPath);
      const content = readFileSync(fullPath, "utf-8");
      const frontmatter = parseFrontmatter(content);
      if (!frontmatter?.title) continue;

      const sectionId =
        prefix === "docs" || prefix === "react"
          ? `${prefix}/${slugs[0]}`
          : prefix === "breeze"
            ? "breeze/components"
            : prefix;

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
          snippetPath: registryEntry.snippetPath,
        }),
      };

      if (!sectionsMap.has(sectionId)) {
        sectionsMap.set(sectionId, []);
      }
      sectionsMap.get(sectionId)!.push(item);
    }
  }

  // Build ordered sections
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

  // Append any sections not in SECTION_ORDER
  for (const [sectionId, items] of sectionsMap) {
    if (items.length > 0) {
      sections.push({
        id: sectionId,
        label: SECTION_LABELS[sectionId] ?? sectionId,
        items: items.sort((a, b) => a.id.localeCompare(b.id)),
      });
    }
  }

  // Write output
  const outDir = path.join(process.cwd(), "public", "__docs__");
  if (!existsSync(outDir)) {
    await fs.mkdir(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, "index.json");
  await fs.writeFile(outPath, JSON.stringify({ sections }, null, 2), "utf8");

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  console.log(
    chalk.green(`Docs Index Generated! (${sections.length} sections, ${totalItems} items)`),
  );
}

main().catch((error) => {
  console.error(chalk.red("Failed to generate docs index:"), error);
  process.exit(1);
});
