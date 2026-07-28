export { parseDoctorConfig, resolveSeverity } from "./config";
export { getNodePosition } from "./engine/rule-context";
export { runStaticRules, type RunStaticRulesOptions } from "./engine/run-static-rules";
export {
  generateAgentHandoff,
  matchAgentRules,
  type AgentRuleMatch,
  type HandoffInput,
  type HandoffMeta,
} from "./agent/handoff";
export { buildJsonReport, type ReportMeta } from "./report/json";
export { formatHumanReport, type HumanReportColorizers } from "./report/human";
export { applySuppressions } from "./suppression/apply";
export { parseSuppressions } from "./suppression/parse";
export {
  JSON_SCHEMA_VERSION,
  type AgentRule,
  type DoctorConfig,
  type DoctorReport,
  type EngineDiagnostic,
  type Finding,
  type Reference,
  type ReportInput,
  type Rule,
  type RuleContext,
  type RuleGuidance,
  type RuleKind,
  type RulePack,
  type RunResult,
  type ScannedFile,
  type Severity,
  type StaticRule,
  type Suppression,
} from "./types";

// 룰 팩이 ts-morph를 직접 의존하지 않아도 되도록 AST 타입·가드·SyntaxKind를 재노출한다.
export { Node, SyntaxKind } from "ts-morph";
export type { SourceFile } from "ts-morph";
