import { fetchDocsIndex, fetchLlmsTxt, tryFetchLlmsTxt } from "@/src/utils/fetch";
import * as p from "@clack/prompts";
import type { CAC } from "cac";
import { z } from "zod";
import { BASE_URL } from "../constants";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import { getRawConfig } from "../utils/get-config";
import { CliError, handleCliError, isVerboseMode } from "../utils/error";
import type { DocsCategory, DocsItem, DocsSection } from "../schema";

/**
 * Scripts and agents read this command more often than people do, so its outcome has to
 * survive being reduced to a number. A separate code for "several documents matched" lets
 * a caller retry with one of the printed candidates rather than rewrite the query.
 */
const EXIT_AMBIGUOUS = 2;

const docsOptionsSchema = z.object({
  query: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((query) => {
      const normalized = Array.isArray(query) ? query.join(" ") : query;
      const trimmed = normalized?.trim();
      return trimmed ? trimmed : undefined;
    }),
  baseUrl: z.string().optional(),
  cwd: z.string().default(process.cwd()),
  framework: z.enum(["react", "lynx"]).optional(),
  raw: z.boolean(),
});

type Resolution =
  | { kind: "item"; item: DocsItem }
  /** The query named a container, so listing what sits inside it is the answer. */
  | { kind: "listing"; heading: string; lines: string[] }
  /** The query named several documents. Only the caller can pick one. */
  | { kind: "ambiguous"; heading: string; lines: string[] };

interface Outcome {
  exitCode: number;
  result: string;
  itemId?: string;
}

/**
 * `llmsUrl` is missing from an index published before it existed: the site between a CLI
 * release and its next deploy, and the archived `v1-x` sites, whose index is frozen in
 * the old shape. Both still serve the composed route.
 */
function llmsUrlFor(item: DocsItem, baseUrl: string): string {
  return `${baseUrl}${item.llmsUrl ?? `/llms${item.docUrl}.txt`}`;
}

function printDocsResult(item: DocsItem, baseUrl: string) {
  p.log.message(
    [item.id, `- docs: ${baseUrl}${item.docUrl}`, `- llms.txt: ${llmsUrlFor(item, baseUrl)}`].join(
      "\n",
    ),
  );
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
 * The path a caller can paste straight back into the command.
 */
function pathOf(category: DocsCategory, section: DocsSection, item: DocsItem): string {
  return `${category.id}/${section.id}/${item.id}`;
}

function countItems(category: DocsCategory): number {
  return category.sections.reduce((sum, section) => sum + section.items.length, 0);
}

function alignedLines(entries: { path: string; note?: string }[]): string[] {
  const width = Math.max(...entries.map((entry) => entry.path.length));
  return entries.map(({ path, note }) => (note ? `${path.padEnd(width)}  ${note}` : path));
}

function itemLines(category: DocsCategory, sections: DocsSection[]): string[] {
  return alignedLines(
    sections.flatMap((section) =>
      section.items.map((item) => ({
        path: pathOf(category, section, item),
        note: item.deprecated ? "(deprecated)" : undefined,
      })),
    ),
  );
}

function notFound(query: string, suggestions: string[], hint: string): CliError {
  const suggestion =
    suggestions.length > 0
      ? `\n\n💡 이것을 의미했나요?\n${suggestions.map((s) => `   - ${s}`).join("\n")}`
      : "";

  return new CliError({
    message: `${highlight(query)}: 문서를 찾을 수 없어요.${suggestion}`,
    hint,
  });
}

/**
 * Build suggestions from a path query by fuzzy-matching each segment
 * against the docs index hierarchy.
 */
function suggestionsFor(segments: string[], categories: DocsCategory[]): string[] {
  if (segments.length === 0) return [];

  const suggestions: string[] = [];
  const categoryIds = categories.map((c) => c.id);
  const similarCategories = findSimilar(segments[0], categoryIds);

  if (similarCategories.length === 0) {
    // No similar category — try to find similar full paths across everything
    const allPaths = categories.flatMap((cat) =>
      cat.sections.flatMap((sec) => sec.items.map((item) => `${cat.id}/${sec.id}/${item.id}`)),
    );
    const similarPaths = findSimilar(segments.join("/"), allPaths, 5);
    return similarPaths.slice(0, 3);
  }

  const bestCat = categories.find((c) => c.id === similarCategories[0]);
  if (!bestCat || segments.length < 2) {
    return similarCategories.slice(0, 3);
  }

  const similarSections = findSimilar(
    segments[1],
    bestCat.sections.map((s) => s.id),
  );

  if (similarSections.length === 0) {
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
    return suggestions;
  }

  const bestSec = bestCat.sections.find((s) => s.id === similarSections[0]);
  if (bestSec && segments.length >= 3) {
    const similarItems = findSimilar(
      segments[2],
      bestSec.items.map((i) => i.id),
    );
    for (const item of similarItems.slice(0, 3)) {
      suggestions.push(`${bestCat.id}/${bestSec.id}/${item}`);
    }
    return suggestions;
  }

  return similarSections.slice(0, 3).map((sec) => `${bestCat.id}/${sec}`);
}

/**
 * Parse a path-style query into segments.
 * e.g. "react/components/action-button" → ["react", "components", "action-button"]
 */
function parseQueryPath(query: string): string[] {
  return query
    .split(/[/\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeRegistryKeySegment(segment: string): string {
  const [, itemId] = segment.split(":");
  return itemId ?? segment;
}

/**
 * Whether scoping `segments` under `category` would actually resolve to something.
 *
 * Mirrors the lookup the category branch of `resolveQuery` performs, so a `true`
 * here means the scoped query has somewhere to land.
 */
function categoryContains(category: DocsCategory, head: string): boolean {
  const q = head.toLowerCase();
  return category.sections.some(
    (section) =>
      section.id === head ||
      section.items.some(
        (item) => item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q),
      ),
  );
}

function normalizeDocsQuery({
  query,
  framework,
  categories,
}: {
  query?: string;
  framework?: string;
  categories: DocsCategory[];
}): string | undefined {
  if (!query) return undefined;

  const segments = parseQueryPath(query).map(normalizeRegistryKeySegment);
  if (!segments.length) return undefined;

  const [firstSegment] = segments;
  if (categories.some((category) => category.id === firstSegment)) {
    return segments.join("/");
  }

  // Scope to the configured framework, but only when that scope has a match — otherwise
  // a query like `spacing` (which lives under `foundations`) would be rewritten to
  // `react/spacing` and hard-fail instead of falling through to the global search.
  const frameworkCategory = categories.find((category) => category.id === framework);
  if (frameworkCategory && categoryContains(frameworkCategory, firstSegment)) {
    return [framework, ...segments].join("/");
  }

  return segments.join("/");
}

function searchAllItems(
  categories: DocsCategory[],
  query: string,
): { item: DocsItem; path: string }[] {
  const q = query.toLowerCase();
  return categories.flatMap((category) =>
    category.sections.flatMap((section) =>
      section.items
        .filter((item) => item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q))
        .map((item) => ({ item, path: pathOf(category, section, item) })),
    ),
  );
}

function resolveWithinSection(
  category: DocsCategory,
  section: DocsSection,
  needle: string,
  docsQuery: string,
): Resolution {
  const exact = section.items.find((item) => item.id === needle);
  if (exact) return { kind: "item", item: exact };

  const q = needle.toLowerCase();
  const matched = section.items.filter(
    (item) => item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q),
  );

  if (matched.length === 0) {
    const similar = findSimilar(
      needle,
      section.items.map((item) => item.id),
    );
    throw notFound(
      docsQuery,
      similar.slice(0, 3).map((id) => `${category.id}/${section.id}/${id}`),
      `\`seed-design docs ${category.id}/${section.id}\`로 목록을 확인해보세요.`,
    );
  }
  if (matched.length === 1) return { kind: "item", item: matched[0] };

  return {
    kind: "ambiguous",
    heading: `${highlight(needle)}에 해당하는 문서가 여러 개예요`,
    lines: matched.map((item) => pathOf(category, section, item)),
  };
}

function resolveWithinCategory(
  category: DocsCategory,
  needle: string,
  docsQuery: string,
): Resolution {
  // An exact id wins outright: `components` and `foundations` hold every page in one
  // section, so `components/action-button` lands here rather than in the section branch
  // above, and substring matching alone would tie `action-button` with
  // `floating-action-button`.
  const exact = category.sections.flatMap((s) => s.items).find((item) => item.id === needle);
  if (exact) return { kind: "item", item: exact };

  const q = needle.toLowerCase();
  const matched = category.sections.flatMap((section) =>
    section.items
      .filter((item) => item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q))
      .map((item) => ({ item, section })),
  );

  if (matched.length === 0) {
    const allItems = category.sections.flatMap((section) =>
      section.items.map((item) => ({ path: pathOf(category, section, item), id: item.id })),
    );
    const similarSections = findSimilar(
      needle,
      category.sections.map((s) => s.id),
    );
    const similarItems = findSimilar(
      needle,
      allItems.map((entry) => entry.id),
    );
    const suggestions = [
      ...similarSections.slice(0, 2).map((id) => `${category.id}/${id}`),
      ...similarItems
        .slice(0, 2)
        .map((id) => allItems.find((entry) => entry.id === id)?.path)
        .filter((path): path is string => path != null),
    ];
    throw notFound(
      docsQuery,
      suggestions,
      `\`seed-design docs ${category.id}\`로 목록을 확인해보세요.`,
    );
  }
  if (matched.length === 1) return { kind: "item", item: matched[0].item };

  return {
    kind: "ambiguous",
    heading: `${highlight(needle)}에 해당하는 문서가 여러 개예요`,
    lines: matched.map(({ item, section }) => pathOf(category, section, item)),
  };
}

/**
 * Turn a query into one document, a list of what a named container holds, or a list of
 * the documents that tie for it. Nothing here prompts: a non-TTY used to cancel the
 * picker this replaced, and that cancellation was reported as success.
 */
function resolveQuery(categories: DocsCategory[], docsQuery: string | undefined): Resolution {
  if (!docsQuery) {
    return {
      kind: "listing",
      heading: "카테고리",
      lines: alignedLines(
        categories.map((category) => ({
          path: category.id,
          note: `${countItems(category)}개 항목`,
        })),
      ),
    };
  }

  const segments = parseQueryPath(docsQuery);
  const matchedCategory = categories.find((category) => category.id === segments[0]);

  if (matchedCategory && segments.length >= 2) {
    const matchedSection = matchedCategory.sections.find((section) => section.id === segments[1]);

    if (matchedSection && segments.length >= 3) {
      return resolveWithinSection(matchedCategory, matchedSection, segments[2], docsQuery);
    }
    if (matchedSection) {
      return {
        kind: "listing",
        heading: `${matchedCategory.label} > ${matchedSection.label}`,
        lines: itemLines(matchedCategory, [matchedSection]),
      };
    }
    return resolveWithinCategory(matchedCategory, segments[1], docsQuery);
  }

  if (matchedCategory) {
    // Sections first where a category has several: `react` spreads 110 documents over 7 of
    // them, and 110 lines is not a list anyone reads.
    if (matchedCategory.sections.length > 1) {
      return {
        kind: "listing",
        heading: matchedCategory.label,
        lines: alignedLines(
          matchedCategory.sections.map((section) => ({
            path: `${matchedCategory.id}/${section.id}`,
            note: `${section.items.length}개 항목`,
          })),
        ),
      };
    }
    return {
      kind: "listing",
      heading: matchedCategory.label,
      lines: itemLines(matchedCategory, matchedCategory.sections),
    };
  }

  const matched = searchAllItems(categories, docsQuery);

  if (matched.length === 0) {
    throw notFound(
      docsQuery,
      suggestionsFor(segments, categories),
      "`seed-design docs`로 전체 목록을 확인해보세요.",
    );
  }
  if (matched.length === 1) return { kind: "item", item: matched[0].item };

  return {
    kind: "ambiguous",
    heading: `${highlight(docsQuery)}에 해당하는 문서가 여러 개예요`,
    lines: matched.map(({ path }) => path),
  };
}

function emitLinks({
  baseUrl,
  categories,
  docsQuery,
}: {
  baseUrl: string;
  categories: DocsCategory[];
  docsQuery: string | undefined;
}): Outcome {
  const resolution = resolveQuery(categories, docsQuery);

  if (resolution.kind === "item") {
    printDocsResult(resolution.item, baseUrl);
    p.outro("완료했어요.");
    return { exitCode: 0, result: "item", itemId: resolution.item.id };
  }

  p.log.message([resolution.heading, "", ...resolution.lines].join("\n"));

  if (resolution.kind === "listing") {
    p.outro("완료했어요.");
    return { exitCode: 0, result: "listing" };
  }

  p.outro(highlight("경로를 하나로 좁혀서 다시 실행해주세요."));
  return { exitCode: EXIT_AMBIGUOUS, result: "ambiguous" };
}

async function emitRaw({
  baseUrl,
  categories,
  docsQuery,
}: {
  baseUrl: string;
  categories: DocsCategory[];
  docsQuery: string;
}): Promise<Outcome> {
  // A bare category has no single page. Its overview llms.txt answers for it where the
  // index publishes one; an index from before that field existed publishes none, and the
  // archived sites are all in that state.
  const sectionIndexUrl = categories.find((category) => category.id === docsQuery)?.llmsIndexUrl;
  if (sectionIndexUrl) {
    console.log(await fetchLlmsTxt({ url: `${baseUrl}${sectionIndexUrl}` }));
    return { exitCode: 0, result: "section-index" };
  }

  // Deeper than category/section/item: the changelog routes are generated per package and
  // version rather than from the content tree, so the index has no item to match.
  const deep = parseQueryPath(docsQuery).length > 3;
  let resolution: Resolution | undefined;
  if (!deep) {
    try {
      resolution = resolveQuery(categories, docsQuery);
    } catch {
      // Not in the index. The composed URL below still reaches the generated routes.
    }
  }

  if (resolution?.kind === "item") {
    console.log(await fetchLlmsTxt({ url: llmsUrlFor(resolution.item, baseUrl) }));
    return { exitCode: 0, result: "item", itemId: resolution.item.id };
  }

  if (resolution) {
    // stdout carries document text in raw mode, so candidates go to stderr and the exit
    // code carries the outcome.
    console.error([resolution.heading, "", ...resolution.lines].join("\n"));
    return { exitCode: EXIT_AMBIGUOUS, result: resolution.kind };
  }

  console.log(await tryFetchLlmsTxt({ baseUrl, query: docsQuery }));
  return { exitCode: 0, result: "composed-url" };
}

export const docsCommand = (cli: CAC) => {
  cli
    .command("docs [...query]", "문서 링크와 llms.txt 링크를 조회합니다")
    .option("-u, --baseUrl <baseUrl>", `레지스트리의 기본 URL (기본값: ${BASE_URL})`, {
      default: BASE_URL,
    })
    .option("--cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .option("-f, --framework <framework>", "프레임워크 (react 또는 lynx)")
    .option("--raw", "llms.txt 내용을 직접 가져와 출력합니다. LLM 파이프에 유용합니다.", {
      default: false,
    })
    .example("seed-design docs")
    .example("seed-design docs action-button")
    .example("seed-design docs react")
    .example("seed-design docs lynx action-button")
    .example("seed-design docs react/components")
    .example("seed-design docs react/components/action-button")
    .example("seed-design docs react/updates/changelog --raw")
    .action(async (query, opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      const raw = opts.raw ?? false;
      let trackCwd = process.cwd();

      if (!raw) p.intro("seed-design docs");

      try {
        const parsed = docsOptionsSchema.safeParse({ query, ...opts });
        if (!parsed.success) {
          throw parsed.error;
        }

        const { data: options } = parsed;
        trackCwd = options.cwd;
        const baseUrl = options.baseUrl ?? BASE_URL;
        const rawConfig = await getRawConfig(options.cwd).catch(() => null);
        const framework = options.framework ?? rawConfig?.framework;

        const docsIndex = await (async () => {
          if (raw) {
            return await fetchDocsIndex({ baseUrl });
          }
          const { start, stop } = p.spinner();
          start("문서 목록을 가져오고 있어요...");
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
        const docsQuery = normalizeDocsQuery({
          query: options.query,
          framework,
          categories,
        });

        if (raw && !docsQuery) {
          throw new CliError({
            message: "--raw 모드에서는 쿼리가 필요해요.",
            hint: "예: `seed-design docs react/updates/changelog --raw`",
          });
        }

        const outcome =
          raw && docsQuery
            ? await emitRaw({ baseUrl, categories, docsQuery })
            : emitLinks({ baseUrl, categories, docsQuery });

        const duration = Date.now() - startTime;
        try {
          await analytics.trackCommandOutcome(trackCwd, {
            command: "docs",
            status: outcome.exitCode === 0 ? "completed" : "failed",
            result: outcome.result,
            properties: {
              query: options.query ?? null,
              item_id: outcome.itemId ?? options.query ?? null,
              raw_mode: raw,
              duration_ms: duration,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] docs 이벤트 전송에 실패했어요:", telemetryError);
          }
        }

        if (outcome.exitCode !== 0) {
          process.exit(outcome.exitCode);
        }
      } catch (error) {
        try {
          await analytics.trackCommandFailure(trackCwd, {
            command: "docs",
            error,
            properties: {
              raw_mode: raw,
              duration_ms: Date.now() - startTime,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] docs 이벤트 전송에 실패했어요:", telemetryError);
          }
        }

        if (raw) {
          const msg = error instanceof Error ? error.message : String(error);
          console.error(msg);
          process.exit(1);
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
