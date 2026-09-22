import { fetchDocsIndex, fetchLlmsTxt } from "@/src/utils/fetch";
import { object, or } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { optional } from "@optique/core/modifiers";
import { argument, command, constant } from "@optique/core/primitives";
import { string } from "@optique/core/valueparser";
import { analytics } from "../utils/analytics";
import { baseUrlOption, type ParsedOptions } from "../utils/cli-options";
import { highlight } from "../utils/color";
import { documentListings, findDocument, summaryOf } from "../utils/docs-address";
import { alignedLines, similarAddresses } from "../utils/docs-index";
import { searchDocs } from "../utils/docs-search";
import { CliError, ExitCode, exitCodeFor, reportCliError } from "../utils/error";
import { exampleFooter } from "../utils/help";
import type { DocsCategory } from "../schema";

/**
 * Three subcommands, one for each kind of answer, so what comes back is settled by the name
 * the caller typed rather than by the shape of the argument they passed.
 *
 *   docs list [섹션]      every document, or every document in one section
 *   docs search <질의>    the documents a query reaches, body text included
 *   docs read <주소>      that document's own text
 *
 * None of them draws the clack frame the other commands do: what they print is meant to be
 * piped or pasted back in, and a `│` down the left of every line is not. stdout carries the
 * answer and nothing else; reasons, counts and candidates all go to stderr. `read` holds the
 * strictest form of that rule — its stdout is the bytes the site sent, with not one
 * character of the CLI's own mixed in.
 *
 * `list` and `search` answer one entry to a line with its address as the first field, so a
 * line survives `grep` whole and `awk '{print $1}'` cuts the address back out of it.
 *
 * None of them reads the working directory, the project's config or the environment either,
 * so the same address names the same document from every directory and every session.
 */

interface Outcome {
  result: string;
  itemId?: string;
}

function suggestionFor(categories: DocsCategory[], query: string): string {
  const similar = similarAddresses(categories, query);
  if (similar.length === 0) return "";

  return `\n\n💡 이것을 의미했나요?\n${similar.map((address) => `   - ${address}`).join("\n")}`;
}

const listParser = command(
  "list",
  object({
    command: constant("docs list"),
    section: optional(
      argument(string({ metavar: "SECTION" }), {
        description: message`나열할 섹션의 id입니다. 주소의 첫 경로를 슬래시 없이 씁니다(예: react). 생략하면 모든 문서를 나열합니다.`,
      }),
    ),
    baseUrl: baseUrlOption,
  }),
  {
    brief: message`문서를 한 줄에 하나씩 주소순으로 나열합니다.`,
    footer: exampleFooter([
      "seed-design docs list",
      "seed-design docs list react",
      "seed-design docs list foundations",
    ]),
  },
);

const searchParser = command(
  "search",
  object({
    command: constant("docs search"),
    query: argument(string({ metavar: "QUERY" }), {
      errors: {
        endOfInput: message`찾을 내용이 필요합니다. 예: seed-design docs search "액션 버튼"`,
      },
    }),
    baseUrl: baseUrlOption,
  }),
  {
    brief: message`문서 본문까지 검색해 걸린 문서를 한 줄씩 출력합니다.`,
    footer: exampleFooter([
      'seed-design docs search "액션 버튼"',
      'seed-design docs search "바텀시트 스냅"',
      "seed-design docs search action-button",
    ]),
  },
);

const readParser = command(
  "read",
  object({
    command: constant("docs read"),
    address: argument(string({ metavar: "ADDRESS" }), {
      description: message`읽을 문서의 주소입니다. docs list·docs search가 출력한 주소를 슬래시까지 그대로 씁니다. 뒤에 붙은 #앵커는 무시하고 문서 전체를 출력합니다.`,
      errors: {
        endOfInput: message`읽을 문서가 필요합니다. 예: seed-design docs read /react/components/action-button`,
      },
    }),
    baseUrl: baseUrlOption,
  }),
  {
    brief: message`문서 본문을 출력합니다.`,
    footer: exampleFooter([
      "seed-design docs read /react/components/action-button",
      "seed-design docs read /react/components/action-button#usage",
      "seed-design docs read /react",
    ]),
  },
);

export const docsParser = command("docs", or(listParser, searchParser, readParser), {
  brief: message`문서를 나열하고, 찾고, 읽습니다.`,
});

/** Every one of the three ends the same way: the answer on stdout, or a reason on stderr. */
async function emit(
  command: "docs-list" | "docs-search" | "docs-read",
  verbose: boolean,
  run: () => Promise<Outcome>,
) {
  const startTime = Date.now();
  // Only telemetry reads the working directory, and only to find the opt-out. What document
  // an address names never depends on where the command was run.
  const cwd = process.cwd();

  try {
    const outcome = await run();

    try {
      await analytics.trackCommandOutcome(cwd, {
        command,
        status: "completed",
        result: outcome.result,
        properties: {
          item_id: outcome.itemId ?? null,
          duration_ms: Date.now() - startTime,
        },
      });
    } catch (telemetryError) {
      if (verbose) {
        console.error(`[Telemetry] ${command} 이벤트 전송에 실패했어요:`, telemetryError);
      }
    }
  } catch (error) {
    try {
      await analytics.trackCommandFailure(cwd, {
        command,
        error,
        properties: { duration_ms: Date.now() - startTime },
      });
    } catch (telemetryError) {
      if (verbose) {
        console.error(`[Telemetry] ${command} 이벤트 전송에 실패했어요:`, telemetryError);
      }
    }

    reportCliError(error, {
      defaultMessage: "문서 조회에 실패했어요.",
      defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
      verbose,
    });
    process.exit(exitCodeFor(error));
  }
}

export async function runDocsList({ section, baseUrl, verbose }: ParsedOptions<typeof listParser>) {
  await emit("docs-list", verbose, async () => {
    const { categories } = await fetchDocsIndex({ baseUrl });
    const listed =
      section === undefined ? categories : categories.filter((category) => category.id === section);

    if (section !== undefined && listed.length === 0) {
      throw new CliError({
        message: `${highlight(section)}: 없는 섹션이에요.\n\n${categories
          .map((category) => `   - ${category.id}`)
          .join("\n")}`,
        hint: "위에 나온 섹션 id 중 하나를 그대로 넣어주세요. 섹션 없이 `seed-design docs list`를 실행하면 모든 문서를 나열해요.",
        exit: ExitCode.answeredNegatively,
      });
    }

    console.log(alignedLines(documentListings(listed)).join("\n"));
    return { result: "listing" };
  });
}

export async function runDocsSearch({
  query,
  baseUrl,
  verbose,
}: ParsedOptions<typeof searchParser>) {
  await emit("docs-search", verbose, async () => {
    // A blank query matches every document, which is a listing wearing a search's clothes.
    if (query.trim().length === 0) {
      throw new CliError({
        message: "검색어가 필요해요.",
        hint: "예: `seed-design docs search 액션 버튼`. 전체 목록은 `seed-design docs list`로 확인할 수 있어요.",
      });
    }

    const [{ addresses, total }, { categories }] = await Promise.all([
      searchDocs({ baseUrl, query }),
      fetchDocsIndex({ baseUrl }),
    ]);

    if (addresses.length === 0) {
      throw new CliError({
        message: `${highlight(query)}: 일치하는 문서가 없어요.${suggestionFor(categories, query)}`,
        hint: "띄어쓰기를 바꾸거나 더 짧은 검색어로 찾아보세요. 전체 목록은 `seed-design docs list`로 확인할 수 있어요.",
        exit: ExitCode.answeredNegatively,
      });
    }

    // The count says how the list came out, which is not itself an answer.
    console.error(
      total > addresses.length
        ? `${total}개 문서를 찾았어요. 위에서부터 ${addresses.length}개를 표시하고 있어요.`
        : `${total}개 문서를 찾았어요.`,
    );

    // Unpadded, unlike a listing: an anchor's Hangul takes two columns that a character count
    // cannot line up.
    console.log(
      addresses
        .map((address) => {
          const item = findDocument(categories, address);
          return item ? `${address}  ${summaryOf(item)}` : address;
        })
        .join("\n"),
    );

    return { result: "matched" };
  });
}

export async function runDocsRead({ address, baseUrl, verbose }: ParsedOptions<typeof readParser>) {
  await emit("docs-read", verbose, async () => {
    const { categories } = await fetchDocsIndex({ baseUrl });
    const item = findDocument(categories, address);

    if (!item) {
      throw new CliError({
        message: `${highlight(address)}: 문서가 없어요.${suggestionFor(categories, address)}`,
        hint: "주소는 `seed-design docs list`나 `seed-design docs search <검색어>`가 출력한 그대로 넣어주세요.",
      });
    }

    // Not `console.log`: stdout carries the bytes the site sent and not one of ours, and
    // `console.log` would append a newline the document did not have.
    process.stdout.write(await fetchLlmsTxt({ url: `${baseUrl}${item.llmsUrl}` }));
    return { result: "item", itemId: item.id };
  });
}
