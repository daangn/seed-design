import type { PackageDiff } from "./diff";

/** GitHub rejects comment bodies over 65,536 characters; the rest is headroom for the workflow's marker. */
const COMMENT_BUDGET = 60_000;

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
