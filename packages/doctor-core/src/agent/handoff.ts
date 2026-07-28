import {
  JSON_SCHEMA_VERSION,
  type AgentRule,
  type Finding,
  type Reference,
  type Rule,
  type ScannedFile,
} from "../types";

export interface AgentRuleMatch {
  rule: AgentRule;
  matchedFiles: string[];
}

/** agent 룰별 대상 파일을 결정론적으로 선정한다. 판정은 하지 않는다. */
export function matchAgentRules(files: ScannedFile[], rules: Rule[]): AgentRuleMatch[] {
  const agentRules = rules.filter((rule): rule is AgentRule => rule.kind === "agent");

  return agentRules
    .map((rule) => ({
      rule,
      matchedFiles: files
        .filter((file) => (rule.target.match ? rule.target.match(file) : true))
        .map((file) => file.path),
    }))
    .filter((match) => match.matchedFiles.length > 0);
}

export interface HandoffMeta {
  tool: { name: string; version: string };
  cwd: string;
}

export interface HandoffInput {
  /** 결정론 룰이 알아낸 사실. 에이전트가 맥락 없이 판단하지 않도록 함께 넘긴다. */
  findings: Finding[];
  /** 에이전트에게 판단을 위임할 룰과 대상 파일 */
  agentMatches: AgentRuleMatch[];
}

/**
 * 에이전트 핸드오프 마크다운을 생성한다.
 *
 * 이 문서 하나만으로 임의의 에이전트가 작업할 수 있어야 한다. 그래서 판단 요청뿐 아니라
 * **결정론 룰이 알아낸 사실도 함께 싣는다** — 버전이 얼마나 뒤졌는지, 어떤 스니펫이
 * 구세대인지 같은 사실이 빠지면 에이전트가 맥락 없이 판단하게 된다.
 */
export function generateAgentHandoff(input: HandoffInput, meta: HandoffMeta): string {
  const { findings, agentMatches } = input;
  const visibleFindings = findings.filter((finding) => !finding.suppressed);
  const sections: string[] = [];

  sections.push(
    [
      "# SEED Doctor — 에이전트 핸드오프",
      "",
      `> ${meta.tool.name}@${meta.tool.version} · 대상 프로젝트: ${meta.cwd}`,
      "",
      "SEED 디자인 시스템을 쓰는 프로젝트를 진단한 결과입니다. 아래 순서로 작업하세요.",
      "",
      '> **이 작업은 진단입니다. 파일을 수정하지 마세요.** 아래 "해결 방법"과 `remediation`은 사용자에게 전달할 **안내 문구**이지 지금 실행할 명령이 아닙니다. 코드 변경이나 재설치는 사용자가 별도로 지시할 때만 합니다.',
      "",
      "1. **참조 문서를 먼저 읽으세요.** 각 항목에 링크가 붙어 있습니다. 판단의 근거는 이 문서들이어야 합니다.",
      "2. **확인된 사실**은 이미 검증된 내용이니 다시 조사하지 말고 그대로 활용하세요.",
      "3. **검토 요청**은 판정 기준 항목별로 판정하세요. 자유 서술 총평이 아닙니다. 기준이 나열돼 있지 않으면 참조 문서에서 도출합니다.",
      "4. **판정 결과는 보고서 본문에 표로 남기고, 아래 출력 형식의 JSON에는 `fail`만 담으세요.** 각 항목에는 코드 증거(파일/라인)가 있어야 합니다.",
    ].join("\n"),
  );

  if (visibleFindings.length > 0) {
    sections.push(renderFacts(visibleFindings));
  }

  if (agentMatches.length > 0) {
    sections.push("## 검토 요청");
    for (const match of agentMatches) {
      sections.push(renderAgentRule(match));
    }
  }

  sections.push(renderOutputContract(meta.cwd));

  return `${sections.join("\n\n")}\n`;
}

/** 결정론 룰의 finding을 룰별로 묶어 "확인된 사실"로 렌더한다. */
function renderFacts(findings: Finding[]): string {
  const byRule = new Map<string, Finding[]>();
  for (const finding of findings) {
    const group = byRule.get(finding.ruleId) ?? [];
    group.push(finding);
    byRule.set(finding.ruleId, group);
  }

  const lines: string[] = ["## 확인된 사실"];

  for (const [ruleId, group] of byRule) {
    lines.push("");
    lines.push(`### ${ruleId}`);
    lines.push("");
    lines.push(group[0].guidance.context);
    lines.push("");
    for (const finding of group) {
      const position = `${finding.file}:${finding.line}`;
      lines.push(`- \`${position}\` — ${finding.message}`);
      if (finding.remediation) {
        lines.push(`  - ${finding.remediation}`);
      }
    }
    lines.push("");
    lines.push(`**해결 방법**: ${group[0].guidance.howToFix}`);
    lines.push(...renderReferences(group[0].guidance.references));
  }

  return lines.join("\n");
}

function renderAgentRule({ rule, matchedFiles }: AgentRuleMatch): string {
  const lines: string[] = [];

  lines.push(`### ${rule.id}`);
  lines.push("");
  lines.push(rule.description);
  lines.push("");
  lines.push(rule.guidance.context);
  lines.push("");
  lines.push(`**대상 선정 기준**: ${rule.target.description}`);
  lines.push("");
  lines.push(`**대상 파일 (${matchedFiles.length}개)**:`);
  lines.push("");
  for (const file of matchedFiles) {
    lines.push(`- ${file}`);
  }
  lines.push("");
  if (rule.acceptanceCriteria?.length) {
    lines.push("**판정 기준** (항목별로 판정):");
    lines.push("");
    rule.acceptanceCriteria.forEach((criterion, index) => {
      lines.push(`${index + 1}. ${criterion}`);
    });
  } else {
    // 기준이 참조 문서에 있는 경우. 룰에 베껴 두지 않으므로 문서를 고치면 판정도 따라온다.
    lines.push("**판정 기준은 아래 참조 문서에서 도출하세요.**");
    lines.push("");
    lines.push(
      "- 문서를 **원문(raw)으로** 읽으세요. 요약을 거치면 `DontImage`의 `body`처럼 규칙이 담긴 속성이 사라집니다.",
    );
    lines.push(
      "- **Guidelines**(문서에 따라 `Usage`) 절이 기준의 주 출처입니다. 다른 절(Properties 등)에도 규범 문장이 있으면 함께 뽑고, 어느 절에서 왔는지 표시하세요.",
    );
    lines.push(
      '- 규범 문장은 **위반이 성립하는 모든 문장**입니다 — "~해야 합니다"·"~하지 않습니다"·"~을 권장합니다"뿐 아니라 **제약을 서술하는 평서문**("최대 480px까지 보여집니다", "스크롤은 content area 내에서 발생합니다")도 포함합니다. 반면 허용문("~할 수 있습니다")과 Figma 전용 팁은 위반이 성립하지 않으므로 제외합니다.',
    );
    lines.push(
      "- **`DoImage`/`DontImage`의 `body` 텍스트는 그 자체로 하나의 기준입니다.** 이미지는 못 보더라도 `body`만으로 판정하세요. 바로 옆 본문과 내용이 같으면 하나로 셉니다.",
    );
    lines.push(
      '- 조건절이 붙은 기준("~하는 경우 …")은, **조건이 성립하지 않음을 코드로 확인했으면 `pass`**, 조건 성립 여부 자체를 알 수 없으면 `unknown`입니다.',
    );
    lines.push(
      "- 뽑은 기준에 번호를 매겨 항목별로 판정하고, 판정 표에 그 문장을 그대로 인용하세요.",
    );
    lines.push(
      "- **문서에 없는 규칙을 만들지 마세요.** 일반적인 모범 사례라도 문서에 근거가 없으면 판정하지 않습니다.",
    );
  }
  lines.push("");
  lines.push(`**위반 시 수정 방법**: ${rule.guidance.howToFix}`);
  lines.push(...renderReferences(rule.guidance.references));

  return lines.join("\n");
}

function renderReferences(references: Reference[]): string[] {
  if (!references.length) return [];

  const lines = ["", "**읽어야 할 문서**:", ""];
  for (const reference of references) {
    lines.push(`- [${reference.title}](${reference.url})`);
  }
  return lines;
}

function renderOutputContract(cwd: string): string {
  return [
    "## 출력 형식",
    "",
    "**판정 표** — 검토 요청의 판정 기준 전 항목을 보고서 본문에 남깁니다.",
    "",
    "| # | 기준 | 판정 | 근거 |",
    "|---|------|------|------|",
    "| 1 | 기준 문장 그대로 (도출한 경우 출처 절도) | `pass` / `fail` / `unknown` | 파일:라인 또는 판정하지 못한 이유 |",
    "",
    "`unknown`은 정보가 부족해 판정할 수 없을 때 씁니다. **확인해서 통과한 것(`pass`)과 확인하지 못한 것을 같은 칸에 넣지 마세요.**",
    "",
    "**위반 목록** — `fail` 항목만 아래 JSON 객체의 배열로 보고합니다.",
    "",
    "```jsonc",
    "{",
    `  // jsonSchemaVersion: "${JSON_SCHEMA_VERSION}"`,
    '  "ruleId": "<판정한 룰 id>",',
    '  "severity": "error" | "warn" | "info",',
    '  "message": "<위반 내용 한 문장>",',
    `  "file": "<${cwd} 기준 상대 경로 — 대상 파일이 아니라 **실제로 고쳐야 할 위치**. import한 파일에 결함이 있으면 그 파일>",`,
    '  "line": 1,',
    '  "column": 1,',
    '  "remediation": "<수정 방법 — 참조 문서 근거 포함. 지금 실행하지 말고 안내만>",',
    '  "data": { "criterion": "<위반한 판정 기준 번호>" }',
    "}",
    "```",
    "",
    "**severity 기준**:",
    "",
    "- `error` — 지금 사용자에게 실제 문제가 되는 것 (동작 오류, 깨진 접근성 참조, 잘못된 값)",
    "- `warn` — 지금 동작하지만 고쳐야 하는 것 (디자인 시스템 이탈, 제공되는 기능의 중복 구현, 다음 메이저에서 깨질 것)",
    "- `info` — 알고만 있으면 되는 것",
    "",
    "한 criterion에 위반 근거가 여러 개면 **파일당 한 건으로 묶고** message에 요약, remediation에 각각을 적습니다.",
  ].join("\n");
}
