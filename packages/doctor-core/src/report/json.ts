import { JSON_SCHEMA_VERSION, type DoctorReport, type RunResult } from "../types";

export interface ReportMeta {
  tool: { name: string; version: string };
  cwd: string;
  fileCount: number;
  rulePacks: Array<{ name: string; version?: string }>;
  /** 테스트 재현성을 위해 주입 가능. 기본값은 현재 시각. */
  createdAt?: string;
}

/** RunResult를 스키마 버저닝된 JSON 리포트로 변환한다. obs 인제스트 계약이기도 하다. */
export function buildJsonReport(result: RunResult, meta: ReportMeta): DoctorReport {
  const summary = { error: 0, warn: 0, info: 0, suppressed: 0 };

  for (const finding of result.findings) {
    if (finding.suppressed) {
      summary.suppressed += 1;
    } else {
      summary[finding.severity] += 1;
    }
  }

  return {
    jsonSchemaVersion: JSON_SCHEMA_VERSION,
    tool: meta.tool,
    createdAt: meta.createdAt ?? new Date().toISOString(),
    target: { cwd: meta.cwd, fileCount: meta.fileCount },
    rulePacks: meta.rulePacks,
    findings: result.findings,
    diagnostics: result.diagnostics,
    summary,
  };
}
