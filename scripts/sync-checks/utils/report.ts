import type { CheckResult } from "../types";

export function formatMarkdownReport(results: CheckResult[]): string {
  if (results.length === 0) {
    return "## 🔗 Cross-Package Sync Check\n\n✅ 모든 동기화 체크를 통과했습니다.";
  }

  const warnings = results.filter((r) => r.severity === "warning");
  const infos = results.filter((r) => r.severity === "info");

  const lines: string[] = ["## 🔗 Cross-Package Sync Check", ""];

  if (warnings.length > 0) {
    lines.push("### ⚠️ 동기화 확인 필요", "");

    // 컴포넌트별로 그룹핑
    const grouped = groupByComponent(warnings);
    for (const [component, items] of grouped) {
      lines.push(`**\`${component}\`**`);
      lines.push("| 타겟 | 경로 | 상태 |");
      lines.push("|------|------|------|");
      for (const item of items) {
        lines.push(`| ${item.targetName} | \`${item.expectedTarget}\` | ❌ 없음 |`);
      }
      lines.push("");
    }
  }

  if (infos.length > 0) {
    lines.push("### ℹ️ 참고", "");
    lines.push("| 컴포넌트 | 타겟 | 경로 |");
    lines.push("|---------|------|------|");
    for (const item of infos) {
      lines.push(`| \`${item.component}\` | ${item.targetName} | \`${item.expectedTarget}\` |`);
    }
    lines.push("");
  }

  lines.push("> 의도적으로 동기화하지 않은 경우 이 코멘트를 무시해도 됩니다.");

  return lines.join("\n");
}

function groupByComponent(results: CheckResult[]): Map<string, CheckResult[]> {
  const map = new Map<string, CheckResult[]>();
  for (const r of results) {
    const existing = map.get(r.component) ?? [];
    existing.push(r);
    map.set(r.component, existing);
  }
  return map;
}

export async function postPrComment(report: string, prNumber: string, repo: string): Promise<void> {
  const marker = "<!-- cross-package-sync-check -->";
  const body = `${marker}\n${report}`;

  const { $ } = await import("bun");

  // 기존 코멘트 검색
  const existingComments =
    await $`gh api repos/${repo}/issues/${prNumber}/comments --jq '.[] | select(.body | startswith("${marker}")) | .id'`
      .text()
      .catch(() => "");

  const commentId = existingComments.trim().split("\n")[0];

  if (commentId) {
    // 기존 코멘트 업데이트
    await $`gh api repos/${repo}/issues/comments/${commentId} -X PATCH -f body=${body}`;
  } else {
    // 새 코멘트 생성
    await $`gh api repos/${repo}/issues/${prNumber}/comments -f body=${body}`;
  }
}
