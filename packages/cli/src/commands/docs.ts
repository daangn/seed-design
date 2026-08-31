import {
  fetchDocsIndex,
  fetchLlmsTxt,
  LlmsTxtNotFoundError,
  tryFetchLlmsTxt,
} from "@/src/utils/fetch";
import { object, or } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { optional } from "@optique/core/modifiers";
import { argument, command, constant } from "@optique/core/primitives";
import { string } from "@optique/core/valueparser";
import { analytics } from "../utils/analytics";
import { baseUrlOption, type ParsedOptions } from "../utils/cli-options";
import { highlight } from "../utils/color";
import {
  type Address,
  childrenOf,
  type DocsListing,
  parseAddress,
  resolveDocuments,
  resolveScopes,
} from "../utils/docs-address";
import { alignedLines, matchItems, similarAddresses } from "../utils/docs-index";
import { CliError, formatCliError } from "../utils/error";
import type { DocsCategory, DocsItem } from "../schema";

/**
 * Three subcommands, one for each kind of answer, so what comes back is settled by the name
 * the caller typed rather than by the shape of the argument they passed.
 *
 *   docs list [주소]      what the scope holds, one level down
 *   docs search <질의>    the addresses a name reaches
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
 * `llmsUrl` is missing from an index published before it existed: the site between a CLI
 * release and its next deploy, and the archived `v1-x` sites, whose index is frozen in
 * the old shape. Both still serve the composed route.
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
    brief: message`그 범위 바로 아래에 무엇이 있는지 한 단계 나열합니다`,
    footer: message`예시:
  seed-design docs list
  seed-design docs list react/
  seed-design docs list react/components/`,
  },
);

const searchParser = command(
  "search",
  object({
    command: constant("docs search"),
    query: argument(string({ metavar: "QUERY" }), {
      errors: {
        endOfInput: message`찾을 이름이 필요해요. 예: seed-design docs search action-button`,
      },
    }),
    baseUrl: baseUrlOption,
  }),
  {
    brief: message`이름과 제목으로 문서를 찾아 주소를 출력합니다`,
    footer: message`예시:
  seed-design docs search action-button
  seed-design docs search sheet
  seed-design docs search color`,
  },
);

const readParser = command(
  "read",
  object({
    command: constant("docs read"),
    address: argument(string({ metavar: "ADDRESS" }), {
      errors: {
        endOfInput: message`읽을 주소가 필요해요. 예: seed-design docs read /react/components/action-button`,
      },
    }),
    baseUrl: baseUrlOption,
  }),
  {
    brief: message`그 주소의 문서 본문을 출력합니다`,
    footer: message`예시:
  seed-design docs read /react/components/action-button
  seed-design docs read action-button
  seed-design docs read /react`,
  },
);

export const docsParser = command("docs", or(listParser, searchParser, readParser), {
  brief: message`문서를 나열하고, 찾고, 읽습니다`,
});

/** Every one of the three ends the same way: the answer on stdout, or a reason on stderr. */
async function emit(
  command: "docs list" | "docs search" | "docs read",
  run: () => Promise<Outcome>,
) {
  const startTime = Date.now();
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
    } catch {
      // Telemetry never speaks on stdout, and a failure to report is not a failure to answer.
    }
  } catch (error) {
    try {
      await analytics.trackCommandFailure(cwd, {
        command,
        error,
        properties: { duration_ms: Date.now() - startTime },
      });
    } catch {
      // as above
    }

    console.error(
      formatCliError(error, {
        defaultMessage: "문서 조회에 실패했어요.",
        defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
        verbose: false,
      }).join("\n"),
    );
    process.exit(1);
  }
}

export async function runDocsList({ address, baseUrl }: ParsedOptions<typeof listParser>) {
  await emit("docs list", async () => {
    const { categories } = await fetchDocsIndex({ baseUrl });
    const parsed = parseAddress(address ?? "/");
    const scopes = resolveScopes(categories, parsed);

    const listings = Array.from(
      new Map(
        scopes
          .flatMap((scope) => childrenOf(categories, scope))
          .map((entry) => [entry.address, entry]),
      ).values(),
    ).sort((a, b) => a.address.localeCompare(b.address));

    if (listings.length === 0) {
      throw new CliError({
        message: `${highlight(address ?? "/")}: 그 아래에 나열할 것이 없어요.${suggestionFor(categories, address ?? "")}`,
        hint: "`seed-design docs list`로 전체 목록을, `seed-design docs search <이름>`으로 이름 검색을 해보세요.",
      });
    }

    print(listings);
    return { result: "listing" };
  });
}

export async function runDocsSearch({ query, baseUrl }: ParsedOptions<typeof searchParser>) {
  await emit("docs search", async () => {
    const { categories } = await fetchDocsIndex({ baseUrl });
    const matched = matchItems(categories, query);

    if (matched.length === 0) {
      throw new CliError({
        message: `${highlight(query)}: 일치하는 문서가 없어요.${suggestionFor(categories, query)}`,
        hint: "`seed-design docs list`로 전체 목록을 확인해보세요.",
      });
    }

    // The count says how the list came out, which is not itself an answer.
    console.error(`${matched.length}개 문서를 찾았어요.`);
    // One address per line and nothing else, so a later change to how names are matched
    // leaves every pipeline reading this untouched.
    console.log(matched.map((entry) => entry.address).join("\n"));

    return { result: "matched" };
  });
}

export async function runDocsRead({ address, baseUrl }: ParsedOptions<typeof readParser>) {
  await emit("docs read", async () => {
    const { categories } = await fetchDocsIndex({ baseUrl });
    const parsed = parseAddress(address);
    const documents = resolveDocuments(categories, parsed);

    if (documents.length === 1) {
      console.log(await fetchLlmsTxt({ url: llmsUrlFor(documents[0].item, baseUrl) }));
      return { result: "item", itemId: documents[0].item.id };
    }

    if (documents.length > 1) {
      throw new CliError({
        message: `${highlight(address)}: 여러 문서를 가리켜요.\n\n${documents
          .map((entry) => `   - ${entry.address}`)
          .join("\n")}`,
        hint: "앞에 슬래시를 붙인 전체 주소를 그대로 넣으면 하나로 좁혀져요.",
      });
    }

    // Not in the index at all. The changelog routes are generated per package and version
    // rather than from the content tree, so composing their URL is the only way to reach
    // them. A path the site publishes nothing for is the miss it looked like all along.
    try {
      console.log(await tryFetchLlmsTxt({ baseUrl, query: addressPath(parsed) }));
    } catch (error) {
      if (!(error instanceof LlmsTxtNotFoundError)) throw error;

      throw new CliError({
        message: `${highlight(address)}: 그런 문서가 없어요.${suggestionFor(categories, address)}`,
        hint: "`seed-design docs list`로 전체 목록을, `seed-design docs search <이름>`으로 이름 검색을 해보세요.",
      });
    }

    return { result: "composed-url" };
  });
}

/** The path a composed URL is built from, with the leading slash the route does not carry. */
function addressPath(address: Address): string {
  const path = address.kind === "tail" ? `/${address.segments.join("/")}` : address.path;
  return path.replace(/^\//, "");
}
