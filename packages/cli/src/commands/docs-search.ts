import { fetchDocsIndex } from "@/src/utils/fetch";
import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { multiple } from "@optique/core/modifiers";
import { argument, command, constant } from "@optique/core/primitives";
import { string } from "@optique/core/valueparser";
import { analytics } from "../utils/analytics";
import { baseUrlOption, cwdLongOption, type ParsedOptions } from "../utils/cli-options";
import { highlight } from "../utils/color";
import { alignedLines, matchItems, similarPaths } from "../utils/docs-index";
import { CliError, formatCliError } from "../utils/error";

/**
 * The other half of `docs`, which resolves an address and nothing else.
 *
 * Here a name is allowed to mean several documents, because that is what a name does. What
 * comes back is a list of addresses, and `docs` takes any of them verbatim. Several results
 * is the ordinary outcome rather than a failure, so this exits 0 for any number of hits and
 * 1 only when there are none.
 *
 * Output follows the same rule as `docs`: no clack frame, answers on stdout, everything
 * else on stderr.
 */

export const docsSearchParser = command(
  "docs-search",
  object({
    command: constant("docs-search"),
    query: multiple(argument(string({ metavar: "QUERY" }))),
    baseUrl: baseUrlOption,
    cwd: cwdLongOption,
  }),
  {
    brief: message`이름과 제목으로 문서를 찾아 경로를 출력합니다. 레지스트리 항목 검색이 아니에요.`,
    footer: message`예시:
  seed-design docs-search action-button
  seed-design docs-search sheet
  seed-design docs-search 색상`,
  },
);

export async function runDocsSearch({
  verbose,
  ...options
}: ParsedOptions<typeof docsSearchParser>) {
  const startTime = Date.now();
  const trackCwd = options.cwd;
  const query = options.query.join(" ").trim() || undefined;

  try {
    const { baseUrl } = options;

    if (!query) {
      throw new CliError({
        message: "찾을 이름이 필요해요.",
        hint: "예: `seed-design docs-search action-button`. 전체 목록은 `seed-design docs`로 보세요.",
      });
    }

    const { categories } = await fetchDocsIndex({ baseUrl });
    const matched = matchItems(categories, query);

    if (matched.length === 0) {
      const similar = similarPaths(categories, query);
      const suggestion =
        similar.length > 0
          ? `\n\n💡 이것을 의미했나요?\n${similar.map((path) => `   - ${path}`).join("\n")}`
          : "";

      throw new CliError({
        message: `${highlight(query)}: 일치하는 문서가 없어요.${suggestion}`,
        hint: "`seed-design docs`로 전체 목록을 확인해보세요.",
      });
    }

    // The count says how the list came out, which is not itself an answer.
    console.error(`${matched.length}개 문서를 찾았어요.`);
    console.log(
      alignedLines(
        matched.map(({ item, path }) => ({
          path,
          note: item.deprecated ? `${item.title} (deprecated)` : item.title,
        })),
      ).join("\n"),
    );

    try {
      await analytics.trackCommandOutcome(trackCwd, {
        command: "docs-search",
        status: "completed",
        result: "matched",
        properties: {
          query,
          match_count: matched.length,
          duration_ms: Date.now() - startTime,
        },
      });
    } catch (telemetryError) {
      if (verbose) {
        console.error("[Telemetry] docs-search 이벤트 전송에 실패했어요:", telemetryError);
      }
    }
  } catch (error) {
    try {
      await analytics.trackCommandFailure(trackCwd, {
        command: "docs-search",
        error,
        properties: { duration_ms: Date.now() - startTime },
      });
    } catch (telemetryError) {
      if (verbose) {
        console.error("[Telemetry] docs-search 이벤트 전송에 실패했어요:", telemetryError);
      }
    }

    console.error(
      formatCliError(error, {
        defaultMessage: "문서 검색에 실패했어요.",
        defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
        verbose,
      }).join("\n"),
    );
    process.exit(1);
  }
}
