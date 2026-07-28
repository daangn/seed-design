import type { DoctorConfig, Rule, Severity } from "./types";

const SEVERITY_VALUES: ReadonlyArray<Severity | "off"> = ["error", "warn", "info", "off"];

/** config 오버라이드를 반영한 룰의 최종 severity. "off"면 실행하지 않는다. */
export function resolveSeverity(rule: Rule, config?: DoctorConfig): Severity | "off" {
  return config?.rules?.[rule.id] ?? rule.defaultSeverity;
}

/**
 * 외부 입력(seed-doctor.json 등)을 DoctorConfig로 정규화한다.
 * 코어는 zod를 쓰지 않으므로(호스트별 zod 메이저 충돌 회피) 수기로 검증한다.
 */
export function parseDoctorConfig(input: unknown): { config: DoctorConfig; problems: string[] } {
  const problems: string[] = [];
  const config: DoctorConfig = {};

  if (input === undefined || input === null) return { config, problems };

  if (typeof input !== "object" || Array.isArray(input)) {
    problems.push("설정은 객체여야 해요.");
    return { config, problems };
  }

  const raw = input as Record<string, unknown>;

  if (raw.ignore !== undefined) {
    if (Array.isArray(raw.ignore)) {
      const valid = raw.ignore.filter((entry): entry is string => typeof entry === "string");
      if (valid.length !== raw.ignore.length) {
        problems.push("ignore에 문자열이 아닌 항목이 있어 무시했어요.");
      }
      config.ignore = valid;
    } else {
      problems.push("ignore는 문자열 배열이어야 해요.");
    }
  }

  if (raw.rules !== undefined) {
    if (typeof raw.rules === "object" && raw.rules !== null && !Array.isArray(raw.rules)) {
      const rules: DoctorConfig["rules"] = {};
      for (const [ruleId, value] of Object.entries(raw.rules)) {
        if (typeof value === "string" && SEVERITY_VALUES.includes(value as Severity | "off")) {
          rules[ruleId] = value as Severity | "off";
        } else {
          problems.push(
            `rules["${ruleId}"] 값이 올바르지 않아 무시했어요. (error/warn/info/off 중 하나여야 해요)`,
          );
        }
      }
      config.rules = rules;
    } else {
      problems.push("rules는 객체여야 해요.");
    }
  }

  return { config, problems };
}
