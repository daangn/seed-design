import { parseArgs } from "node:util";

/** GitHub rejects comment bodies over 65,536 characters; the rest is headroom for the workflow's marker. */
const COMMENT_BUDGET = 60_000;

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

export function buildComment(diffs: PackageDiff[], { baseLabel }: { baseLabel: string }) {
  if (diffs.length === 0) return;

  const header = [
    "## API surface changes",
    "",
    `\`${baseLabel}\` 대비 공개 API 표면이 바뀐 패키지예요. 로컬에서 비교하는 방법은 \`tools/extract-api-surface/README.md\`에 있어요.`,
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

    if (length + section.length > COMMENT_BUDGET) {
      omitted.push(diff.name);
      continue;
    }

    sections.push(section);
    length += section.length;
  }

  return [
    header,
    ...sections,
    ...(omitted.length > 0
      ? [
          `코멘트 길이 제한으로 다음 패키지의 diff는 생략했어요. workflow 로그에서 확인해 주세요: ${omitted.map((name) => `\`${name}\``).join(", ")}`,
        ]
      : []),
  ].join("\n");
}

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { "base-label": { type: "string" } },
  });
  const [base, head] = positionals;
  if (!base || !head)
    throw new Error(
      "Usage: bun .github/scripts/api-surface-comment.ts <base-dir> <head-dir> [--base-label <label>]",
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
  // stdout is the comment body; the full diff goes to the workflow log, which the comment points to
  // for packages it had to omit.
  process.stderr.write(output);
  process.stdout.write(
    buildComment(parsePackageDiffs(output, { base, head }), {
      baseLabel: values["base-label"] ?? base,
    }) ?? "",
  );
}

if (import.meta.main) main();
