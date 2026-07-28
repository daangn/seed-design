import type { SourceFile } from "ts-morph";

/** `DoctorReport` JSON 출력의 스키마 버전. 필드가 깨지는 변경 시에만 올린다. */
export const JSON_SCHEMA_VERSION = "1";

export type Severity = "error" | "warn" | "info";

export type RuleKind = "static" | "agent";

/** 스캔 대상 파일. path는 스캔 루트 기준 posix 상대 경로. */
export interface ScannedFile {
  path: string;
  content: string;
}

interface RuleBase {
  /** 네임스페이스 포함 식별자. 예: "seed/no-deprecated-component" */
  id: string;
  kind: RuleKind;
  description: string;
  defaultSeverity: Severity;
  guidance: RuleGuidance;
}

export interface Reference {
  title: string;
  url: string;
}

/**
 * 룰이 전달하는 가이드. doctor는 문제를 지적하는 린터가 아니라 설명하는 도구이므로,
 * 모든 룰이 "왜 중요한지 · 무엇을 읽어야 하는지 · 어떻게 바꾸는지"를 갖는다.
 * static/agent 어느 쪽이든 같은 모양으로 전달된다 — kind는 해당 여부를 무엇이
 * 판정하느냐(코드냐 모델이냐)의 차이일 뿐이다.
 */
export interface RuleGuidance {
  /** 왜 중요한지 — 배경 맥락 */
  context: string;
  /** 무엇을 읽어야 하는지. 사용자가 가장 모르는 부분이라 finding마다 노출된다. */
  references: Reference[];
  /** 어떻게 바꾸는지 — 절차·명령어의 뼈대 */
  howToFix: string;
}

export interface ReportInput {
  message: string;
  /** 1-based */
  line: number;
  /** 1-based */
  column?: number;
  endLine?: number;
  endColumn?: number;
  /** 해결 방법 안내 (대체 API, codemod 명령, 문서 링크 등) */
  remediation?: string;
  /** JSON 직렬화 가능한 추가 정보. 예: { componentId: "fab" } */
  data?: Record<string, unknown>;
}

export interface RuleContext {
  file: ScannedFile;
  /** lazy 파싱된 AST. 호출 전까지 파싱하지 않으며, 결과는 캐시된다. */
  sourceFile(): SourceFile;
  report(finding: ReportInput): void;
}

export interface StaticRule extends RuleBase {
  kind: "static";
  /** 파일 사전 필터. 없으면 모든 스캔 파일에 적용. */
  match?: (filePath: string) => boolean;
  check(context: RuleContext): void;
}

/**
 * 에이전트 룰 — 결정론 엔진은 대상 선정과 핸드오프 생성까지만 담당하고,
 * 판정은 외부 에이전트가 수행한다. 엔진은 LLM을 호출하지 않는다.
 */
export interface AgentRule extends RuleBase {
  kind: "agent";
  target: {
    /**
     * 에이전트가 검토할 파일 필터. 없으면 모든 스캔 파일.
     * StaticRule.match와 달리 파일 전체를 받는다 — agent 룰의 대상 선정은 보통
     * 경로가 아니라 내용(어떤 컴포넌트를 쓰는지)으로 결정되기 때문이다.
     */
    match?: (file: ScannedFile) => boolean;
    /** 대상 선정 기준에 대한 사람용 설명 */
    description: string;
  };
  /**
   * 항목별 판정을 강제하는 명시적 기준.
   *
   * 생략하면 **참조 문서에서 기준을 도출하라**는 지시가 대신 나간다. 기준이 이미 문서에
   * 있는 경우(디자인 가이드라인 등) 룰에 베껴 두면 문서를 고쳐도 룰이 따라오지 않으므로,
   * 그럴 때는 생략하는 쪽이 옳다.
   */
  acceptanceCriteria?: string[];
}

export type Rule = StaticRule | AgentRule;

export interface RulePack {
  /** 예: "@seed-design/doctor-preset" */
  name: string;
  version?: string;
  rules: Rule[];
}

export interface Suppression {
  kind: "inline" | "next-line";
  ruleIds: string[];
  reason?: string;
  /** 억제가 적용되는 라인 (next-line은 이미 +1 해석된 값) */
  targetLine: number;
}

export interface Finding {
  ruleId: string;
  /** config 오버라이드가 반영된 최종 severity */
  severity: Severity;
  message: string;
  /** 스캔 루트 기준 posix 상대 경로 */
  file: string;
  line: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  /** 이 finding에 특화된 해결 안내. 룰 공통 가이드(guidance)를 보완한다. */
  remediation?: string;
  data?: Record<string, unknown>;
  /** 룰의 가이드. 리포트·JSON·핸드오프 모두에 실려서 "무엇을 읽어야 하는지"가 항상 따라간다. */
  guidance: RuleGuidance;
  suppressed: boolean;
  suppression?: { kind: Suppression["kind"]; reason?: string };
}

export interface DoctorConfig {
  /** 스캔에서 제외할 glob 패턴 (파일 발견 단계에서 호스트가 적용) */
  ignore?: string[];
  /** 룰별 severity 오버라이드 또는 비활성화 */
  rules?: Record<string, Severity | "off">;
}

/** 룰 실행·파싱 실패 등 엔진 수준 문제. finding이 아니라 진단으로 남긴다. */
export interface EngineDiagnostic {
  file?: string;
  ruleId?: string;
  message: string;
}

export interface RunResult {
  /** 억제된 finding도 포함된다 (suppressed 플래그로 구분) */
  findings: Finding[];
  diagnostics: EngineDiagnostic[];
}

export interface DoctorReport {
  jsonSchemaVersion: typeof JSON_SCHEMA_VERSION;
  tool: { name: string; version: string };
  createdAt: string;
  target: { cwd: string; fileCount: number };
  rulePacks: Array<{ name: string; version?: string }>;
  findings: Finding[];
  diagnostics: EngineDiagnostic[];
  /** error/warn/info는 비억제 finding 기준, suppressed는 억제된 finding 수 */
  summary: { error: number; warn: number; info: number; suppressed: number };
}
