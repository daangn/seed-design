import type { DoctorReport, Severity } from "../types";

export interface HumanReportColorizers {
  error(text: string): string;
  warn(text: string): string;
  info(text: string): string;
  dim(text: string): string;
  path(text: string): string;
}

const identity = (text: string) => text;

const DEFAULT_COLORIZERS: HumanReportColorizers = {
  error: identity,
  warn: identity,
  info: identity,
  dim: identity,
  path: identity,
};

/**
 * 사람용 리포트 문자열을 만든다. 색은 호스트(CLI)가 colorizer로 주입한다 —
 * 코어는 터미널 라이브러리에 의존하지 않는다.
 */
export function formatHumanReport(
  report: DoctorReport,
  colorizers: Partial<HumanReportColorizers> = {},
): string {
  const colors = { ...DEFAULT_COLORIZERS, ...colorizers };
  const visibleFindings = report.findings.filter((finding) => !finding.suppressed);
  const lines: string[] = [];

  const byFile = new Map<string, typeof visibleFindings>();
  for (const finding of visibleFindings) {
    const group = byFile.get(finding.file) ?? [];
    group.push(finding);
    byFile.set(finding.file, group);
  }

  for (const [file, findings] of byFile) {
    lines.push(colors.path(file));
    for (const finding of findings) {
      const position = `${finding.line}:${finding.column ?? 1}`;
      const severityLabel = colorizeSeverity(finding.severity, colors);
      lines.push(
        `  ${colors.dim(position)}  ${severityLabel}  ${finding.message}  ${colors.dim(finding.ruleId)}`,
      );
      if (finding.remediation) {
        lines.push(`      ${colors.dim(`↳ ${finding.remediation}`)}`);
      }
    }
    lines.push("");
  }

  // 룰별 가이드는 finding마다 반복하지 않고 한 번만 모아 보여준다.
  // "무엇을 읽어야 하는지"가 리포트에서 사라지지 않게 하는 것이 이 블록의 목적.
  const guidanceByRule = new Map<string, (typeof visibleFindings)[number]["guidance"]>();
  for (const finding of visibleFindings) {
    if (!guidanceByRule.has(finding.ruleId)) guidanceByRule.set(finding.ruleId, finding.guidance);
  }

  for (const [ruleId, guidance] of guidanceByRule) {
    lines.push(colors.dim(`── ${ruleId}`));
    lines.push(`  ${guidance.context}`);
    lines.push(`  ${guidance.howToFix}`);
    for (const reference of guidance.references) {
      lines.push(`  ${colors.dim("읽어보기:")} ${reference.title} — ${reference.url}`);
    }
    lines.push("");
  }

  for (const diagnostic of report.diagnostics) {
    const location = [diagnostic.file, diagnostic.ruleId].filter(Boolean).join(" · ");
    lines.push(colors.dim(`[진단] ${location ? `${location}: ` : ""}${diagnostic.message}`));
  }
  if (report.diagnostics.length) lines.push("");

  const { summary } = report;
  const total = summary.error + summary.warn + summary.info;
  if (total === 0) {
    lines.push("발견된 문제가 없어요.");
  } else {
    lines.push(
      `문제 ${total}개 (error ${summary.error} · warn ${summary.warn} · info ${summary.info})`,
    );
  }
  if (summary.suppressed > 0) {
    lines.push(colors.dim(`억제된 finding ${summary.suppressed}개`));
  }

  return lines.join("\n");
}

function colorizeSeverity(severity: Severity, colors: HumanReportColorizers): string {
  if (severity === "error") return colors.error("error");
  if (severity === "warn") return colors.warn("warn ");
  return colors.info("info ");
}
