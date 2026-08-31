import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "node:path";
import type { DocsCategory, DocsIndex, DocsItem } from "../../packages/cli/src/schema";
import {
  getDocUrl,
  getLLMMarkdownUrl,
  getSectionLLMIndexUrl,
  sectionConfigs,
  sections,
} from "../app/_llms/config";
import { getDisplayTitle } from "../app/_llms/utils";
import { listSectionPages } from "./content-pages";

type Frontmatter = {
  title?: string;
  description?: string;
  deprecated?: boolean;
};

export function compareDocsItems(a: DocsItem, b: DocsItem): number {
  if (a.id !== b.id) return a.id < b.id ? -1 : 1;
  if (a.docUrl === b.docUrl) return 0;
  return a.docUrl < b.docUrl ? -1 : 1;
}

async function main() {
  console.log(chalk.gray("Generating Docs Index..."));

  const contentDir = path.join(process.cwd(), "content");
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

    const entries: { item: DocsItem; slugs: string[] }[] = [];

    for (const { relPath, slugs } of listSectionPages(section, contentDir)) {
      const frontmatter = matter(readFileSync(path.join(sourceDir, relPath), "utf-8"))
        .data as Frontmatter;
      if (!frontmatter.title) continue;

      // 섹션 루트 index.mdx만 slug가 없다. frontmatter title이 죄다 "Overview"라
      // 제목에서 뽑을 수도 없어서, CLI가 `docs react/overview`로 부를 이름을 여기서 준다.
      const itemId = slugs.at(-1) ?? "overview";
      const item: DocsItem = {
        id: itemId,
        title: frontmatter.title,
        ...(frontmatter.description && { description: frontmatter.description }),
        docUrl: getDocUrl(section, slugs),
        llmsUrl: getLLMMarkdownUrl(section, slugs),
        ...(frontmatter.deprecated && { deprecated: true }),
      };

      entries.push({ item, slugs });
    }

    if (entries.length === 0) continue;

    // A category is one flat list, so two pages sharing a title are indistinguishable in it.
    // Same disambiguation the llms.txt listings apply.
    const pages = entries.map(({ item, slugs }) => ({ data: { title: item.title }, slugs }));

    categories.push({
      id: section,
      label: config.label,
      llmsIndexUrl: getSectionLLMIndexUrl(section),
      items: entries
        .map(({ item }, index) => ({ ...item, title: getDisplayTitle(pages[index], pages) }))
        .sort(compareDocsItems),
    });
  }

  const outDir = path.join(process.cwd(), "public", "__docs__");
  if (!existsSync(outDir)) {
    await fs.mkdir(outDir, { recursive: true });
  }

  const docsIndex: DocsIndex = { categories };
  await fs.writeFile(path.join(outDir, "index.json"), JSON.stringify(docsIndex, null, 2), "utf8");

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  console.log(
    chalk.green(`Docs Index Generated! (${categories.length} categories, ${totalItems} items)`),
  );
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(chalk.red("Failed to generate docs index:"), error);
    process.exit(1);
  });
}
