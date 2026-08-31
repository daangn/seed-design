import {
  fetchDocsIndex,
  fetchLlmsTxt,
  LlmsTxtNotFoundError,
  tryFetchLlmsTxt,
} from "@/src/utils/fetch";
import type { CAC } from "cac";
import { z } from "zod";
import { BASE_URL } from "../constants";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import {
  alignedLines,
  findByPath,
  parseQueryPath,
  pathOf,
  pathsNamed,
  similarPaths,
} from "../utils/docs-index";
import { CliError, formatCliError, isVerboseMode } from "../utils/error";
import type { DocsCategory, DocsItem, DocsSection } from "../schema";

/**
 * Nothing here draws the clack frame the other commands do. What this one prints is meant
 * to be piped or pasted back in, and a `│` down the left of every line is not.
 *
 * stdout carries the answer in the currency the address calls for: the document's own text
 * when the query names a document, the paths it holds when the query names a container.
 * Everything else, progress and reasons and errors alike, is stderr.
 */

/**
 * This command resolves an address. It does not search, and it does not consult the
 * project's configured framework, so the same query names the same document from every
 * directory and every session. `seed-design docs-search` is where a name becomes a set
 * of candidates, and the failure below points at it.
 *
 * The whole of the accepted grammar:
 *
 *   (nothing)                                   every category
 *   react                                       what the category holds
 *   react/components                            what the section holds
 *   react/components/action-button              that document's text
 *   react/components/concepts/composition       the same, nested deeper
 *   react/overview                              a category's own landing page
 *
 * Addresses come from `pathOf`, so anything printed here is accepted back verbatim. Every
 * one of them is distinct, and none collides with a container path.
 */

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
});

interface Outcome {
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

function countItems(category: DocsCategory): number {
  return category.sections.reduce((sum, section) => sum + section.items.length, 0);
}

function itemLines(category: DocsCategory, sections: DocsSection[]): string[] {
  return alignedLines(
    sections.flatMap((section) =>
      section.items.map((item) => ({
        path: pathOf(category, item),
        note: item.deprecated ? "(deprecated)" : undefined,
      })),
    ),
  );
}

/**
 * A miss, told apart into the two things it usually is.
 *
 * A bare name is the common one: `action-button` is a document id three times over and an
 * address none of the times. Naming those three addresses answers the question the caller
 * was really asking without this command guessing which of them they meant.
 */
function notFound(categories: DocsCategory[], query: string): CliError {
  const segments = parseQueryPath(query);
  const name = segments[segments.length - 1] ?? query;
  const named = pathsNamed(categories, name);

  if (named.length > 0) {
    return new CliError({
      message: `${highlight(query)}: 그런 경로가 없어요.\n\n이 이름을 가진 문서는 아래 경로에 있어요.\n${named
        .map((path) => `   - ${path}`)
        .join("\n")}`,
      hint: `이름으로 찾으려면 \`seed-design docs-search ${name}\` 명령을 사용해보세요.`,
    });
  }

  const similar = similarPaths(categories, query);
  const suggestion =
    similar.length > 0
      ? `\n\n💡 이것을 의미했나요?\n${similar.map((path) => `   - ${path}`).join("\n")}`
      : "";

  return new CliError({
    message: `${highlight(query)}: 그런 경로가 없어요.${suggestion}`,
    hint: "`seed-design docs`로 전체 목록을, `seed-design docs-search <이름>`으로 이름 검색을 해보세요.",
  });
}

/** What a container path answers with, or `undefined` when the path names no container. */
function containerLines(categories: DocsCategory[], segments: string[]): string[] | undefined {
  const category = categories.find((candidate) => candidate.id === segments[0]);
  if (!category) return undefined;

  if (segments.length === 1) {
    // Sections first where a category has several: `react` spreads 110 documents over 7 of
    // them, and 110 lines is not a list anyone reads.
    if (category.sections.length > 1) {
      return alignedLines(
        category.sections.map((section) => ({
          path: `${category.id}/${section.id}`,
          note: `${section.items.length}개 항목`,
        })),
      );
    }
    return itemLines(category, category.sections);
  }

  if (segments.length === 2) {
    const section = category.sections.find((candidate) => candidate.id === segments[1]);
    if (section) return itemLines(category, [section]);
  }

  return undefined;
}

/**
 * The whole of what this command does, for every query it accepts. A document is answered
 * with its own text, a container with the addresses it holds, and neither answer prompts
 * or guesses: a query is an address or it is a miss.
 */
async function emit({
  baseUrl,
  categories,
  query,
}: {
  baseUrl: string;
  categories: DocsCategory[];
  query: string | undefined;
}): Promise<Outcome> {
  if (!query) {
    console.log(
      alignedLines(
        categories.map((category) => ({
          path: category.id,
          note: `${countItems(category)}개 항목`,
        })),
      ).join("\n"),
    );
    return { result: "listing" };
  }

  const segments = parseQueryPath(query);
  const path = segments.join("/");

  const item = findByPath(categories, path);
  if (item) {
    console.log(await fetchLlmsTxt({ url: llmsUrlFor(item, baseUrl) }));
    return { result: "item", itemId: item.id };
  }

  const lines = containerLines(categories, segments);
  if (lines) {
    console.log(lines.join("\n"));
    return { result: "listing" };
  }

  // Not in the index at all. The changelog routes are generated per package and version
  // rather than from the content tree, so composing their URL is the only way to reach
  // them. A path the site publishes nothing for is the miss it looked like all along.
  try {
    console.log(await tryFetchLlmsTxt({ baseUrl, query: path }));
  } catch (error) {
    if (error instanceof LlmsTxtNotFoundError) throw notFound(categories, path);

    throw error;
  }

  return { result: "composed-url" };
}

export const docsCommand = (cli: CAC) => {
  cli
    .command("docs [...query]", "문서 경로로 llms.txt 문서 내용을 조회합니다")
    .option("-u, --baseUrl <baseUrl>", `레지스트리의 기본 URL (기본값: ${BASE_URL})`, {
      default: BASE_URL,
    })
    .option("--cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .example("seed-design docs")
    .example("seed-design docs react")
    .example("seed-design docs react/components")
    .example("seed-design docs react/components/action-button")
    .example("seed-design docs react/components/layout/box")
    .example("seed-design docs react/overview")
    .example("seed-design docs react/updates/changelog")
    .action(async (query, opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      let trackCwd = process.cwd();

      try {
        const parsed = docsOptionsSchema.safeParse({ query, ...opts });
        if (!parsed.success) {
          throw parsed.error;
        }

        const { data: options } = parsed;
        trackCwd = options.cwd;
        const baseUrl = options.baseUrl ?? BASE_URL;

        const { categories } = await fetchDocsIndex({ baseUrl });
        const outcome = await emit({ baseUrl, categories, query: options.query });

        try {
          await analytics.trackCommandOutcome(trackCwd, {
            command: "docs",
            status: "completed",
            result: outcome.result,
            properties: {
              query: options.query ?? null,
              item_id: outcome.itemId ?? options.query ?? null,
              duration_ms: Date.now() - startTime,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] docs 이벤트 전송에 실패했어요:", telemetryError);
          }
        }
      } catch (error) {
        try {
          await analytics.trackCommandFailure(trackCwd, {
            command: "docs",
            error,
            properties: {
              duration_ms: Date.now() - startTime,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] docs 이벤트 전송에 실패했어요:", telemetryError);
          }
        }

        console.error(
          formatCliError(error, {
            defaultMessage: "문서 조회에 실패했어요.",
            defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
            verbose,
          }).join("\n"),
        );
        process.exit(1);
      }
    });
};
