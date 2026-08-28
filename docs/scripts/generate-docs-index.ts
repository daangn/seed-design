import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "node:path";
import type { DocsCategory, DocsIndex, DocsItem, DocsSection } from "../../packages/cli/src/schema";
import {
  type Section,
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

  // 섹션 루트 index.mdx는 slug가 없어 묶일 첫 slug도 없다. 전용 섹션을 새로 만들면 그 id가
  // 항목 id("overview")와 겹쳐, CLI가 항목을 바로 열지 않고 1개짜리 선택 목록을 띄운다.
  // 선언 순서상 첫 섹션(대개 시작하기)에 넣으면 그 충돌 없이 자리를 찾는다.
  if (slugs.length === 0) return Object.keys(grouping.labels)[0] ?? section;

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

    // sectionId -> 항목 + 제목 중복 판정에 쓸 슬러그
    const sectionsMap = new Map<string, { item: DocsItem; slugs: string[] }[]>();

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

      const sectionId = resolveSectionId(section, slugs);
      const entries = sectionsMap.get(sectionId);
      if (entries) {
        entries.push({ item, slugs });
      } else {
        sectionsMap.set(sectionId, [{ item, slugs }]);
      }
    }

    if (sectionsMap.size === 0) continue;

    const docsSections: DocsSection[] = Array.from(sectionsMap.entries())
      .sort(([a], [b]) => compareSectionIds(section, a, b))
      .map(([sectionId, entries]) => {
        // A section is what the CLI picker lists, so two pages titled "Overview" in one
        // are indistinguishable there. Same disambiguation the llms.txt listings apply.
        const pages = entries.map(({ item, slugs }) => ({ data: { title: item.title }, slugs }));

        return {
          id: sectionId,
          label: resolveSectionLabel(section, sectionId),
          items: entries
            .map(({ item }, index) => ({ ...item, title: getDisplayTitle(pages[index], pages) }))
            .sort(compareDocsItems),
        };
      });

    categories.push({
      id: section,
      label: config.label,
      llmsIndexUrl: getSectionLLMIndexUrl(section),
      ...(config.fullText && { llmsFullUrl: `${config.baseUrl}/llms-full.txt` }),
      sections: docsSections,
    });
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
