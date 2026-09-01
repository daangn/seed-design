import { fetchDocsIndex, fetchLlmsTxt } from "@/src/utils/fetch";
import { object, or } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { optional } from "@optique/core/modifiers";
import { argument, command, constant } from "@optique/core/primitives";
import { string } from "@optique/core/valueparser";
import { analytics } from "../utils/analytics";
import { baseUrlOption, type ParsedOptions } from "../utils/cli-options";
import { highlight } from "../utils/color";
import {
  byAddress,
  childrenOf,
  type DocsListing,
  parseAddress,
  resolveDocuments,
  resolveScopes,
} from "../utils/docs-address";
import { alignedLines, similarAddresses } from "../utils/docs-index";
import { searchDocs } from "../utils/docs-search";
import { CliError, ExitCode, exitCodeFor, reportCliError } from "../utils/error";
import { exampleFooter } from "../utils/help";
import type { DocsCategory, DocsItem } from "../schema";

/**
 * Three subcommands, one for each kind of answer, so what comes back is settled by the name
 * the caller typed rather than by the shape of the argument they passed.
 *
 *   docs list [주소]      what the scope holds, one level down
 *   docs search <질의>    the addresses a query reaches, body text included
 *   docs read <주소>      that document's own text
 *
 * None of them draws the clack frame the other commands do: what they print is meant to be
 * piped or pasted back in, and a `│` down the left of every line is not. stdout carries the
 * answer and nothing else; reasons, counts and candidates all go to stderr. `read` holds the
 * strictest form of that rule — its stdout is the bytes the site sent, with not one
 * character of the CLI's own mixed in.
 *
 * None of them reads the working directory, the project's config or the environment either,
 * so the same address names the same document from every directory and every session.
 */

interface Outcome {
  result: string;
  itemId?: string;
}

/**
 * `llmsUrl` is missing from an index published before the field existed — the archived
 * `v1-x` sites, whose index is frozen in the old shape. The rule behind the field is the
 * document URL with `/llms` in front and `.txt` behind, so composing it reaches the same
 * route the site would have named.
 */
function llmsUrlFor(item: DocsItem, baseUrl: string): string {
  return `${baseUrl}${item.llmsUrl ?? `/llms${item.docUrl}.txt`}`;
}

function suggestionFor(categories: DocsCategory[], query: string): string {
  const similar = similarAddresses(categories, query);
  if (similar.length === 0) return "";

  return `\n\n💡 이것을 의미했나요?\n${similar.map((address) => `   - ${address}`).join("\n")}`;
}

function print(listings: DocsListing[]) {
  console.log(alignedLines(listings).join("\n"));
}

const listParser = command(
  "list",
  object({
    command: constant("docs list"),
    address: optional(argument(string({ metavar: "ADDRESS" }))),
    baseUrl: baseUrlOption,
  }),
  {
    brief: message`주소 아래 한 단계에 무엇이 있는지 나열합니다.`,
    footer: exampleFooter([
      "seed-design docs list",
      "seed-design docs list react/",
      "seed-design docs list react/components/",
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
    brief: message`문서 본문까지 검색해 주소를 출력합니다.`,
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
      "seed-design docs read action-button",
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

export async function runDocsList({ address, baseUrl, verbose }: ParsedOptions<typeof listParser>) {
  await emit("docs-list", verbose, async () => {
    const { categories } = await fetchDocsIndex({ baseUrl });
    const parsed = parseAddress(address ?? "");
    const scopes = resolveScopes(categories, parsed);

    const listings = Array.from(
      new Map(
        scopes
          .flatMap((scope) => childrenOf(categories, scope))
          .map((entry) => [entry.address, entry]),
      ).values(),
    ).sort(byAddress);

    if (listings.length === 0) {
      throw new CliError({
        message: `${highlight(address ?? "/")}: 하위 항목이 없어요.${suggestionFor(categories, address ?? "")}`,
        hint: "전체 목록은 `seed-design docs list`로, 이름 검색은 `seed-design docs search <이름>`으로 확인할 수 있어요.",
        exit: ExitCode.answeredNegatively,
      });
    }

    print(listings);
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
    const term = query.trim();
    if (term.length === 0) {
      throw new CliError({
        message: "검색어가 필요해요.",
        hint: "예: `seed-design docs search 액션 버튼`. 전체 목록은 `seed-design docs list`로 확인할 수 있어요.",
      });
    }

    const { addresses, total } = await searchDocs({ baseUrl, query: term });

    if (addresses.length === 0) {
      // Only reached once the search has already failed, so the extra index costs nothing an
      // answer would have paid for.
      const { categories } = await fetchDocsIndex({ baseUrl });

      throw new CliError({
        message: `${highlight(term)}: 일치하는 문서가 없어요.${suggestionFor(categories, term)}`,
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
    // One address per line and nothing else, so a later change to how documents are ranked
    // leaves every pipeline reading this untouched.
    console.log(addresses.join("\n"));

    return { result: "matched" };
  });
}

export async function runDocsRead({ address, baseUrl, verbose }: ParsedOptions<typeof readParser>) {
  await emit("docs-read", verbose, async () => {
    // `search` prints anchors, because a result reads better when it says which part of the
    // document matched. A document has one text, though, so an anchor names no less than the
    // whole of it — pasting a search result back in works, and prints the same thing.
    const parsed = parseAddress(address.split("#")[0]);

    // A trailing slash names a container, and a container has no text of its own. Answering
    // with whatever single document happens to sit underneath would make the same input mean
    // different things as the site grows.
    if (parsed.kind === "scope") {
      throw new CliError({
        message: `${highlight(address)}: 문서가 아니라 하위 항목들을 가리키는 주소예요.`,
        hint: `\`seed-design docs list ${address}\`로 하위 항목들을 확인할 수 있어요.`,
      });
    }

    const { categories } = await fetchDocsIndex({ baseUrl });
    const documents = resolveDocuments(categories, parsed);

    if (documents.length === 1) {
      // Not `console.log`: stdout carries the bytes the site sent and not one of ours, and
      // `console.log` would append a newline the document did not have.
      process.stdout.write(await fetchLlmsTxt({ url: llmsUrlFor(documents[0].item, baseUrl) }));
      return { result: "item", itemId: documents[0].item.id };
    }

    if (documents.length > 1) {
      throw new CliError({
        message: `${highlight(address)}: 여러 문서를 가리켜요.\n\n${documents
          .map((entry) => `   - ${entry.address}`)
          .join("\n")}`,
        hint: "위에 나온 주소 중 하나를 그대로 넣어주세요.",
      });
    }

    throw new CliError({
      message: `${highlight(address)}: 문서가 없어요.${suggestionFor(categories, address)}`,
      hint: "전체 목록은 `seed-design docs list`로, 이름 검색은 `seed-design docs search <이름>`으로 확인할 수 있어요.",
    });
  });
}
