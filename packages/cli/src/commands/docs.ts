import { fetchDocsIndex } from "@/src/utils/fetch";
import * as p from "@clack/prompts";
import type { CAC } from "cac";
import { z } from "zod";
import { BASE_URL } from "../constants";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import {
  CliCancelError,
  CliError,
  handleCliError,
  isCliCancelError,
  isVerboseMode,
} from "../utils/error";
import type { DocsCategory, DocsItem, DocsSection } from "../schema";

const GITHUB_SNIPPET_BASE =
  "https://raw.githubusercontent.com/daangn/seed-design/refs/heads/dev/docs/registry";

const docsOptionsSchema = z.object({
  query: z.string().optional(),
  baseUrl: z.string().optional(),
});

function buildSnippetUrl(registryId: string, snippetPath: string): string {
  return `${GITHUB_SNIPPET_BASE}/${registryId}/${snippetPath}`;
}

function printDocsResult(item: DocsItem, baseUrl: string) {
  const docLink = `${baseUrl}${item.docUrl}`;
  const llmsLink = `${baseUrl}/llms${item.docUrl}.txt`;

  const lines = [item.id, `- docs: ${docLink}`, `- llms.txt: ${llmsLink}`];

  if (item.snippetKey && item.snippets && item.snippets.length > 0) {
    const [registryId] = item.snippetKey.split(":");
    if (registryId === "ui" || registryId === "breeze") {
      if (item.snippets.length === 1) {
        lines.push(`- snippet: ${buildSnippetUrl(registryId, item.snippets[0].path)}`);
      } else {
        lines.push("- snippet:");
        for (const snippet of item.snippets) {
          lines.push(`   - ${snippet.label}: ${buildSnippetUrl(registryId, snippet.path)}`);
        }
      }
    }
  }

  p.log.message(lines.join("\n"));
}

/**
 * Compute the Levenshtein (edit) distance between two strings.
 * Used to suggest similar valid paths when users make typos.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0),
      );
    }
  }
  return dp[m][n];
}

/**
 * Find candidates similar to `input` within `maxDistance` edits, sorted by distance.
 */
function findSimilar(input: string, candidates: string[], maxDistance = 3): string[] {
  const q = input.toLowerCase();
  return candidates
    .map((c) => ({ value: c, dist: levenshtein(q, c.toLowerCase()) }))
    .filter(({ dist }) => dist > 0 && dist <= maxDistance)
    .sort((a, b) => a.dist - b.dist)
    .map(({ value }) => value);
}

/**
 * Build a suggestion hint from a path query by fuzzy-matching each segment
 * against the docs index hierarchy.
 */
function buildSuggestionHint(segments: string[], categories: DocsCategory[]): string | undefined {
  const suggestions: string[] = [];

  // Try to fuzzy-match the first segment against category IDs
  const categoryIds = categories.map((c) => c.id);
  const similarCategories = findSimilar(segments[0], categoryIds);

  if (similarCategories.length === 0) {
    // No similar category — try to find similar full paths across everything
    const allPaths = categories.flatMap((cat) =>
      cat.sections.flatMap((sec) => sec.items.map((item) => `${cat.id}/${sec.id}/${item.id}`)),
    );
    const fullQuery = segments.join("/");
    const similarPaths = findSimilar(fullQuery, allPaths, 5);
    if (similarPaths.length > 0) {
      suggestions.push(...similarPaths.slice(0, 3));
    }
  } else {
    const bestCat = categories.find((c) => c.id === similarCategories[0]);
    if (bestCat && segments.length >= 2) {
      const sectionIds = bestCat.sections.map((s) => s.id);
      const similarSections = findSimilar(segments[1], sectionIds);

      if (similarSections.length > 0) {
        const bestSec = bestCat.sections.find((s) => s.id === similarSections[0]);
        if (bestSec && segments.length >= 3) {
          const itemIds = bestSec.items.map((i) => i.id);
          const similarItems = findSimilar(segments[2], itemIds);
          for (const item of similarItems.slice(0, 3)) {
            suggestions.push(`${bestCat.id}/${bestSec.id}/${item}`);
          }
        } else {
          for (const sec of similarSections.slice(0, 3)) {
            suggestions.push(`${bestCat.id}/${sec}`);
          }
        }
      } else {
        // Section not found, search items within category
        const allItemIds = bestCat.sections.flatMap((s) =>
          s.items.map((i) => ({ path: `${bestCat.id}/${s.id}/${i.id}`, id: i.id })),
        );
        const similarItems = findSimilar(
          segments[1],
          allItemIds.map((x) => x.id),
        );
        for (const itemId of similarItems.slice(0, 3)) {
          const found = allItemIds.find((x) => x.id === itemId);
          if (found) suggestions.push(found.path);
        }
      }
    } else {
      for (const cat of similarCategories.slice(0, 3)) {
        suggestions.push(cat);
      }
    }
  }

  if (suggestions.length === 0) return undefined;

  const lines = ["", "💡 이것을 의미했나요?"];
  for (const s of suggestions) {
    lines.push(`   - ${s}`);
  }
  return lines.join("\n");
}

/**
 * Parse a path-style query into segments.
 * e.g. "react/components/action-button" → ["react", "components", "action-button"]
 */
function parseQueryPath(query: string): string[] {
  return query
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Search all items across all categories/sections.
 */
function searchAllItems(
  categories: DocsCategory[],
  query: string,
): { item: DocsItem; categoryLabel: string; sectionLabel: string }[] {
  const q = query.toLowerCase();
  return categories.flatMap((cat) =>
    cat.sections.flatMap((sec) =>
      sec.items
        .filter((item) => item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q))
        .map((item) => ({
          item,
          categoryLabel: cat.label,
          sectionLabel: sec.label,
        })),
    ),
  );
}

async function selectItem(items: DocsItem[]): Promise<DocsItem> {
  const selected = await p.select({
    message: "항목을 선택해주세요",
    options: items.map((item) => ({
      label: `${item.deprecated ? "(deprecated) " : ""}${item.title}`,
      value: item,
      hint: item.description,
    })),
  });
  if (p.isCancel(selected)) throw new CliCancelError();
  return selected;
}

async function selectSection(sections: DocsSection[]): Promise<DocsSection> {
  const selected = await p.select({
    message: "섹션을 선택해주세요",
    options: sections.map((sec) => ({
      label: sec.label,
      value: sec,
      hint: `${sec.items.length}개 항목`,
    })),
  });
  if (p.isCancel(selected)) throw new CliCancelError();
  return selected;
}

async function selectCategory(categories: DocsCategory[]): Promise<DocsCategory> {
  const selected = await p.select({
    message: "카테고리를 선택해주세요",
    options: categories.map((cat) => ({
      label: cat.label,
      value: cat,
      hint: `${cat.sections.reduce((sum, s) => sum + s.items.length, 0)}개 항목`,
    })),
  });
  if (p.isCancel(selected)) throw new CliCancelError();
  return selected;
}

export const docsCommand = (cli: CAC) => {
  cli
    .command("docs [query]", "문서 링크, llms.txt 링크, 스니펫 링크를 조회합니다")
    .option("-u, --baseUrl <baseUrl>", `레지스트리의 기본 URL (기본값: ${BASE_URL})`, {
      default: BASE_URL,
    })
    .example("seed-design docs")
    .example("seed-design docs action-button")
    .example("seed-design docs react")
    .example("seed-design docs react/components")
    .example("seed-design docs react/components/action-button")
    .action(async (query, opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      p.intro("seed-design docs");

      try {
        const parsed = docsOptionsSchema.safeParse({ query, ...opts });
        if (!parsed.success) {
          throw parsed.error;
        }

        const { data: options } = parsed;
        const baseUrl = options.baseUrl ?? BASE_URL;

        const { start, stop } = p.spinner();
        start("문서 목록을 가져오고 있어요...");

        const docsIndex = await (async () => {
          try {
            const index = await fetchDocsIndex({ baseUrl });
            stop("문서 목록을 가져왔어요.");
            return index;
          } catch (error) {
            stop("문서 목록을 가져오지 못했어요.");
            throw error;
          }
        })();

        const { categories } = docsIndex;
        let selectedItem: DocsItem;

        if (options.query) {
          const segments = parseQueryPath(options.query);

          // Try to resolve as path: category / section / item
          const matchedCategory = categories.find((c) => c.id === segments[0]);

          if (matchedCategory && segments.length >= 2) {
            const matchedSection = matchedCategory.sections.find((s) => s.id === segments[1]);

            if (matchedSection && segments.length >= 3) {
              // Full path: category/section/item
              const matchedItem = matchedSection.items.find((i) => i.id === segments[2]);
              if (matchedItem) {
                selectedItem = matchedItem;
              } else {
                // Item not found in section — search within the section
                const q = segments[2].toLowerCase();
                const matched = matchedSection.items.filter(
                  (i) => i.id.toLowerCase().includes(q) || i.title.toLowerCase().includes(q),
                );
                if (matched.length === 0) {
                  const similarItems = findSimilar(
                    segments[2],
                    matchedSection.items.map((i) => i.id),
                  );
                  const suggestion =
                    similarItems.length > 0
                      ? `\n\n💡 이것을 의미했나요?\n${similarItems
                          .slice(0, 3)
                          .map((s) => `   - ${matchedCategory.id}/${matchedSection.id}/${s}`)
                          .join("\n")}`
                      : "";
                  throw new CliError({
                    message: `${highlight(options.query)}: 문서를 찾을 수 없어요.${suggestion}`,
                    hint: `\`seed-design docs ${matchedCategory.id}/${matchedSection.id}\`로 목록을 확인해보세요.`,
                  });
                }
                if (matched.length === 1) {
                  selectedItem = matched[0];
                } else {
                  selectedItem = await selectItem(matched);
                }
              }
            } else if (matchedSection) {
              // category/section — select item within section
              selectedItem = await selectItem(matchedSection.items);
            } else {
              // category/??? — search within category
              const q = segments[1].toLowerCase();
              const matched = matchedCategory.sections.flatMap((s) =>
                s.items
                  .filter(
                    (i) => i.id.toLowerCase().includes(q) || i.title.toLowerCase().includes(q),
                  )
                  .map((item) => ({ item, sectionLabel: s.label })),
              );

              if (matched.length === 0) {
                const sectionIds = matchedCategory.sections.map((s) => s.id);
                const similarSections = findSimilar(segments[1], sectionIds);
                const allItemIds = matchedCategory.sections.flatMap((s) =>
                  s.items.map((i) => ({ path: `${matchedCategory.id}/${s.id}/${i.id}`, id: i.id })),
                );
                const similarItems = findSimilar(
                  segments[1],
                  allItemIds.map((x) => x.id),
                );
                const suggestions: string[] = [
                  ...similarSections.slice(0, 2).map((s) => `${matchedCategory.id}/${s}`),
                  ...similarItems
                    .slice(0, 2)
                    .map((id) => allItemIds.find((x) => x.id === id)?.path)
                    .filter((p): p is string => p != null),
                ];
                const suggestion =
                  suggestions.length > 0
                    ? `\n\n💡 이것을 의미했나요?\n${suggestions.map((s) => `   - ${s}`).join("\n")}`
                    : "";
                throw new CliError({
                  message: `${highlight(options.query)}: 문서를 찾을 수 없어요.${suggestion}`,
                  hint: `\`seed-design docs ${matchedCategory.id}\`로 목록을 확인해보세요.`,
                });
              }
              if (matched.length === 1) {
                selectedItem = matched[0].item;
              } else {
                const selected = await p.select({
                  message: `${highlight(segments[1])}에 해당하는 항목을 선택해주세요`,
                  options: matched.map(({ item, sectionLabel }) => ({
                    label: `[${sectionLabel}] ${item.title}`,
                    value: item,
                    hint: item.description,
                  })),
                });
                if (p.isCancel(selected)) throw new CliCancelError();
                selectedItem = selected;
              }
            }
          } else if (matchedCategory) {
            // Single segment matching a category — drill into it
            if (matchedCategory.sections.length === 1) {
              selectedItem = await selectItem(matchedCategory.sections[0].items);
            } else {
              const section = await selectSection(matchedCategory.sections);
              selectedItem = await selectItem(section.items);
            }
          } else {
            // No category match — global search
            const matched = searchAllItems(categories, options.query);

            if (matched.length === 0) {
              const suggestion = buildSuggestionHint(segments, categories);
              throw new CliError({
                message: `${highlight(options.query)}: 문서를 찾을 수 없어요.${suggestion ?? ""}`,
                hint: "`seed-design docs`로 전체 목록을 확인해보세요.",
              });
            }
            if (matched.length === 1) {
              selectedItem = matched[0].item;
            } else {
              const selected = await p.select({
                message: `${highlight(options.query)}에 해당하는 항목을 선택해주세요`,
                options: matched.map(({ item, categoryLabel, sectionLabel }) => ({
                  label: `[${categoryLabel} > ${sectionLabel}] ${item.title}`,
                  value: item,
                  hint: item.description,
                })),
              });
              if (p.isCancel(selected)) throw new CliCancelError();
              selectedItem = selected;
            }
          }
        } else {
          // Full interactive flow: category → section → item
          const category = await selectCategory(categories);

          let section: DocsSection;
          if (category.sections.length === 1) {
            section = category.sections[0];
          } else {
            section = await selectSection(category.sections);
          }

          selectedItem = await selectItem(section.items);
        }

        printDocsResult(selectedItem, baseUrl);
        p.outro("완료했어요.");

        const duration = Date.now() - startTime;
        try {
          await analytics.track(process.cwd(), {
            event: "docs",
            properties: {
              query: options.query ?? null,
              item_id: selectedItem.id,
              has_snippet: !!(selectedItem.snippets && selectedItem.snippets.length > 0),
              duration_ms: duration,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] docs tracking failed:", telemetryError);
          }
        }
      } catch (error) {
        if (isCliCancelError(error)) {
          p.outro(highlight(error.message));
          process.exit(0);
        }

        handleCliError(error, {
          defaultMessage: "문서 조회에 실패했어요.",
          defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
          verbose,
        });
        process.exit(1);
      }
    });
};
