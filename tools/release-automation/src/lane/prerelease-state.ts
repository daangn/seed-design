import type { LaneName, PrereleaseOperation } from "../core/types";

export interface PrereleaseState {
  mode: "pre" | "exit";
  tag: string;
  initialVersions: Record<string, string>;
  changesets: string[];
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}이 객체가 아닙니다.`);
  }
  return value as Record<string, unknown>;
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}

function assertSameJson(actual: unknown, expected: unknown, label: string): void {
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    throw new Error(`${label}이 exact expected state와 다릅니다.`);
  }
}

export function parsePrereleaseState(value: unknown, label: string): PrereleaseState {
  const state = asRecord(value, label);
  assertSameJson(
    Object.keys(state).sort(),
    ["changesets", "initialVersions", "mode", "tag"],
    `${label} key`,
  );
  if (state.mode !== "pre" && state.mode !== "exit") {
    throw new Error(`${label} mode가 pre 또는 exit가 아닙니다.`);
  }
  if (state.tag !== "beta") throw new Error(`${label} tag는 beta여야 합니다.`);
  const initialVersions = asRecord(state.initialVersions, `${label} initialVersions`);
  if (
    Object.keys(initialVersions).length === 0 ||
    !Object.values(initialVersions).every(
      (version) =>
        typeof version === "string" && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version),
    )
  ) {
    throw new Error(`${label} initialVersions가 비어 있지 않은 SemVer 문자열 map이 아닙니다.`);
  }
  if (
    !Array.isArray(state.changesets) ||
    !state.changesets.every(
      (changeset) => typeof changeset === "string" && /^[a-z0-9][a-z0-9-]*$/.test(changeset),
    ) ||
    new Set(state.changesets).size !== state.changesets.length
  ) {
    throw new Error(`${label} changesets가 고유한 changeset ID 배열이 아닙니다.`);
  }
  return {
    mode: state.mode,
    tag: state.tag,
    initialVersions: initialVersions as Record<string, string>,
    changesets: state.changesets as string[],
  };
}

export function parseOptionalPrereleaseState(
  text: string | null,
  label: string,
): PrereleaseState | null {
  if (text === null) return null;
  try {
    return parsePrereleaseState(JSON.parse(text) as unknown, label);
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`${label}이 올바른 JSON이 아닙니다.`);
    throw error;
  }
}

export function classifyPrereleaseState(
  lane: LaneName,
  state: PrereleaseState | null,
): "stable" | "dormant" | "active" | "exiting" {
  if (lane === "dev") {
    if (state) throw new Error("dev에는 prerelease state가 존재할 수 없습니다.");
    return "stable";
  }
  if (!state) return "dormant";
  return state.mode === "pre" ? "active" : "exiting";
}

export function assertPrereleaseTransition(input: {
  lane: LaneName;
  operation: PrereleaseOperation;
  base: PrereleaseState | null;
  proposed: PrereleaseState | null;
  workspaceVersions?: Record<string, string>;
}): void {
  const { base, lane, operation, proposed, workspaceVersions } = input;
  if (lane === "dev") throw new Error("dev에서는 prerelease enter/exit를 실행할 수 없습니다.");
  if (operation === "enter") {
    if (base) throw new Error(`${lane}은 이미 prerelease 상태입니다.`);
    if (!proposed || proposed.mode !== "pre" || proposed.changesets.length !== 0) {
      throw new Error("enter 결과는 exact beta pre state여야 합니다.");
    }
    if (workspaceVersions) {
      assertSameJson(
        proposed.initialVersions,
        workspaceVersions,
        "enter initialVersions workspace baseline",
      );
    }
    return;
  }
  if (!base || base.mode !== "pre") {
    throw new Error(`${lane}은 active prerelease 상태가 아니므로 exit할 수 없습니다.`);
  }
  if (!proposed) throw new Error("exit intent는 pre.json을 삭제할 수 없습니다.");
  assertSameJson(proposed, { ...base, mode: "exit" }, "exit intent state");
}

export function isWorkspaceDirectory(directory: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (!pattern.endsWith("/*")) return directory === pattern;
    const prefix = pattern.slice(0, -1);
    return directory.startsWith(prefix) && !directory.slice(prefix.length).includes("/");
  });
}
