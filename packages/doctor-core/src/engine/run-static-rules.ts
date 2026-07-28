import { resolveSeverity } from "../config";
import { applySuppressions } from "../suppression/apply";
import { parseSuppressions } from "../suppression/parse";
import type {
  DoctorConfig,
  EngineDiagnostic,
  Finding,
  Rule,
  RuleContext,
  RunResult,
  ScannedFile,
  StaticRule,
} from "../types";
import { createSourceFileStore } from "./rule-context";

export interface RunStaticRulesOptions {
  files: ScannedFile[];
  rules: Rule[];
  config?: DoctorConfig;
}

/**
 * static 룰 전체를 파일들에 실행한다. agent 룰은 무시한다(핸드오프 경로에서 별도 처리).
 * 룰이 던진 예외·파싱 실패는 finding이 아니라 diagnostics로 수집한다 — 한 룰의 실패가
 * 전체 실행을 죽이면 안 된다.
 */
export function runStaticRules(options: RunStaticRulesOptions): RunResult {
  const { files, rules, config } = options;
  const staticRules = rules.filter((rule): rule is StaticRule => rule.kind === "static");

  const store = createSourceFileStore();
  const findings: Finding[] = [];
  const diagnostics: EngineDiagnostic[] = [];

  for (const file of files) {
    const sourceFile = store.createAccessor(file);

    for (const rule of staticRules) {
      const severity = resolveSeverity(rule, config);
      if (severity === "off") continue;
      if (rule.match && !rule.match(file.path)) continue;

      const context: RuleContext = {
        file,
        sourceFile,
        report(input) {
          findings.push({
            ruleId: rule.id,
            severity,
            file: file.path,
            guidance: rule.guidance,
            suppressed: false,
            ...input,
          });
        },
      };

      try {
        rule.check(context);
      } catch (error) {
        diagnostics.push({
          file: file.path,
          ruleId: rule.id,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  // 억제 적용 — finding이 있는 파일만 디렉티브를 파싱한다.
  const filesWithFindings = new Set(findings.map((finding) => finding.file));
  const contentByPath = new Map(files.map((file) => [file.path, file.content]));
  let result = findings;

  for (const filePath of filesWithFindings) {
    const content = contentByPath.get(filePath);
    if (!content) continue;

    const suppressions = parseSuppressions(content);
    if (!suppressions.length) continue;

    result = result.map((finding) =>
      finding.file === filePath ? applySuppressions([finding], suppressions)[0] : finding,
    );
  }

  return { findings: result, diagnostics };
}
