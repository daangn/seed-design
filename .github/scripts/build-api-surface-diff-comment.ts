import { appendFileSync } from "node:fs";
import { parseArgs } from "node:util";

/** GitHub rejects comment bodies over 65,536 characters; the rest is headroom for the workflow's marker. */
const COMMENT_BUDGET = 60_000;

/**
 * GitHub drops a step summary over 1 MiB. `length` counts UTF-16 code units, and none takes more
 * than three UTF-8 bytes, so 340,000 × 3 stays under 1,048,576 with room for the omission note.
 */
const SUMMARY_BUDGET = 340_000;

export interface PackageDiff {
  name: string;
  /** Unified diff hunks, starting at the first `@@` line. */
  patch: string;
  added: number;
  removed: number;
}

/**
 * Splits `git diff --no-index <base> <head>` over two `extract-api-surface --out-dir` trees into
 * one diff per package. git keeps `base` and `head` in the paths exactly as they were passed.
 */
export function parsePackageDiffs(output: string, { base, head }: { base: string; head: string }) {
  return output
    .split(/^diff --git /m)
    .slice(1)
    .map((section) => {
      const lines = section.trimEnd().split("\n");
      const path =
        lines.find((line) => line.startsWith(`+++ b/${head}/`))?.slice(`+++ b/${head}/`.length) ??
        lines.find((line) => line.startsWith(`--- a/${base}/`))?.slice(`--- a/${base}/`.length);
      const hunkStart = lines.findIndex((line) => line.startsWith("@@"));
      if (!path?.endsWith(".txt") || hunkStart === -1)
        throw new Error(`표면 파일의 diff로 읽을 수 없습니다:\ndiff --git ${lines[0]}`);

      const hunks = lines.slice(hunkStart);

      return {
        name: path.slice(0, -".txt".length),
        patch: hunks.join("\n"),
        added: hunks.filter((line) => line.startsWith("+")).length,
        removed: hunks.filter((line) => line.startsWith("-")).length,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Omitted packages point to `details` when it holds them, and to the workflow log otherwise, which
 * always carries the full diff.
 */
export function buildComment(
  diffs: PackageDiff[],
  {
    baseLabel,
    budget = COMMENT_BUDGET,
    details,
  }: { baseLabel: string; budget?: number; details?: { url: string; packages: string[] } },
) {
  if (diffs.length === 0) return;

  const header = [
    "## API surface changes",
    "",
    `\`${baseLabel}\` 대비 공개 API 표면이 바뀐 패키지예요.`,
    "",
    "| Package | + | - |",
    "| --- | --: | --: |",
    ...diffs.map((diff) => `| \`${diff.name}\` | ${diff.added} | ${diff.removed} |`),
    "",
  ].join("\n");

  const sections: string[] = [];
  const omitted: string[] = [];
  let length = header.length;
  for (const diff of diffs) {
    const section = [
      `<details><summary><code>${diff.name}</code></summary>`,
      "",
      "```diff",
      diff.patch,
      "```",
      "",
      "</details>",
      "",
    ].join("\n");

    if (length + section.length > budget) {
      omitted.push(diff.name);
      continue;
    }

    sections.push(section);
    length += section.length;
  }

  const list = (names: string[]) => names.map((name) => `\`${name}\``).join(", ");
  const inDetails = omitted.filter((name) => details?.packages.includes(name));
  const inLog = omitted.filter((name) => !inDetails.includes(name));

  const body = [
    header,
    ...sections,
    ...(omitted.length > 0 ? ["길이 제한으로 일부 패키지의 diff는 생략했어요.", ""] : []),
    ...(details && inDetails.length > 0
      ? [`- [workflow 요약](${details.url})에서 확인해 주세요: ${list(inDetails)}`]
      : []),
    ...(inLog.length > 0 ? [`- workflow 로그에서 확인해 주세요: ${list(inLog)}`] : []),
  ].join("\n");

  return { body, omitted };
}

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      "base-label": { type: "string" },
      "details-url": { type: "string" },
      "summary-file": { type: "string" },
    },
  });
  const [base, head] = positionals;
  if (!base || !head)
    throw new Error(
      "Usage: bun .github/scripts/build-api-surface-diff-comment.ts <base-dir> <head-dir> [--base-label <label>] [--details-url <url>] [--summary-file <path>]",
    );

  // Prefixes are pinned so a user's diff.noprefix or diff.mnemonicPrefix can't change the paths parsed above.
  const git = Bun.spawnSync([
    "git",
    "diff",
    "--no-index",
    "--no-color",
    "--no-ext-diff",
    "--no-renames",
    "--src-prefix=a/",
    "--dst-prefix=b/",
    "--",
    base,
    head,
  ]);
  // Like `diff`, 1 means the trees differ.
  if (git.exitCode > 1) throw new Error(git.stderr.toString());

  const output = git.stdout.toString();
  const diffs = parsePackageDiffs(output, { base, head });
  const baseLabel = values["base-label"] ?? base;
  // stdout is the comment body. The full diff also goes to the workflow log, and to the step
  // summary when one is given, for packages the comment had to omit.
  process.stderr.write(output);

  const summaryFile = values["summary-file"];
  const detailsUrl = values["details-url"];
  const summary = summaryFile && buildComment(diffs, { baseLabel, budget: SUMMARY_BUDGET });
  if (summaryFile && summary) appendFileSync(summaryFile, summary.body);

  const comment = buildComment(diffs, {
    baseLabel,
    ...(detailsUrl &&
      summary && {
        details: {
          url: detailsUrl,
          packages: diffs
            .map((diff) => diff.name)
            .filter((name) => !summary.omitted.includes(name)),
        },
      }),
  });
  process.stdout.write(comment?.body ?? "");
}

if (import.meta.main) main();
