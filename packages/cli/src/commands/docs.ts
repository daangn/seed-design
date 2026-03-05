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
import type { DocsItem } from "../schema";

const GITHUB_SNIPPET_BASE =
  "https://raw.githubusercontent.com/daangn/seed-design/refs/heads/dev/docs/registry";

const docsOptionsSchema = z.object({
  query: z.string().optional(),
  baseUrl: z.string().optional(),
});

function buildSnippetUrl(item: DocsItem): string | null {
  if (!item.snippetKey || !item.snippetPath) return null;
  const [registryId] = item.snippetKey.split(":");
  if (registryId !== "ui" && registryId !== "breeze") return null;
  return `${GITHUB_SNIPPET_BASE}/${registryId}/${item.snippetPath}`;
}

function printDocsResult(item: DocsItem, baseUrl: string) {
  const docLink = `${baseUrl}${item.docUrl}`;
  const llmsLink = `${baseUrl}/llms${item.docUrl}.txt`;
  const snippetLink = buildSnippetUrl(item);

  const lines = [
    item.id,
    `- docs: ${docLink}`,
    `- llms.txt: ${llmsLink}`,
    ...(snippetLink ? [`- snippet: ${snippetLink}`] : []),
  ];

  p.log.message(lines.join("\n"));
}

export const docsCommand = (cli: CAC) => {
  cli
    .command("docs [query]", "문서 링크, llms.txt 링크, 스니펫 링크를 조회합니다")
    .option("-u, --baseUrl <baseUrl>", `레지스트리의 기본 URL (기본값: ${BASE_URL})`, {
      default: BASE_URL,
    })
    .example("seed-design docs")
    .example("seed-design docs action-button")
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

        let selectedItem: DocsItem;

        if (options.query) {
          // Direct search flow
          const q = options.query.toLowerCase();
          const matched = docsIndex.sections.flatMap((section) =>
            section.items
              .filter(
                (item) => item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q),
              )
              .map((item) => ({ item, sectionLabel: section.label })),
          );

          if (matched.length === 0) {
            throw new CliError({
              message: `${highlight(options.query)}: 문서를 찾을 수 없어요.`,
              hint: "`seed-design docs`로 전체 목록을 확인해보세요.",
            });
          }

          if (matched.length === 1) {
            selectedItem = matched[0].item;
          } else {
            const selected = await p.select({
              message: `${highlight(options.query)}에 해당하는 항목을 선택해주세요`,
              options: matched.map(({ item, sectionLabel }) => ({
                label: `[${sectionLabel}] ${item.title}`,
                value: item,
                hint: item.description,
              })),
            });

            if (p.isCancel(selected)) {
              throw new CliCancelError();
            }

            selectedItem = selected;
          }
        } else {
          // Interactive flow — section selection first
          const sectionSelected = await p.select({
            message: "섹션을 선택해주세요",
            options: docsIndex.sections.map((section) => ({
              label: section.label,
              value: section,
              hint: `${section.items.length}개 항목`,
            })),
          });

          if (p.isCancel(sectionSelected)) {
            throw new CliCancelError();
          }

          const itemSelected = await p.select({
            message: "항목을 선택해주세요",
            options: sectionSelected.items.map((item) => ({
              label: `${item.deprecated ? "(deprecated) " : ""}${item.title}`,
              value: item,
              hint: item.description,
            })),
          });

          if (p.isCancel(itemSelected)) {
            throw new CliCancelError();
          }

          selectedItem = itemSelected;
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
              has_snippet: buildSnippetUrl(selectedItem) !== null,
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
