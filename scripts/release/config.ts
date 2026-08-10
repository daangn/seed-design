import { readFile } from "node:fs/promises";
import type {
  BumpType,
  LaneConfig,
  LaneDefinition,
  LaneName,
  ReleaseControl,
  ReleaseFreeze,
} from "./types";
import { bumpTypes, laneNames } from "./types";

const laneSet = new Set<string>(laneNames);
const bumpSet = new Set<string>(bumpTypes);
const tagPattern = /^[a-z][a-z0-9-]{0,31}$/;
const shaPattern = /^[0-9a-f]{40}$/;

const lanePolicy: Record<LaneName, LaneDefinition> = {
  dev: { bump: "patch", prerelease: false, sources: [] },
  minor: { bump: "minor", prerelease: true, sources: ["dev"] },
  major: { bump: "major", prerelease: true, sources: ["dev", "minor"] },
};

function assertObject(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label}이 객체가 아닙니다.`);
  }
}

function assertExactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
  label: string,
): void {
  const actual = Object.keys(value);
  const missing = expected.filter((key) => !actual.includes(key));
  const unknown = actual.filter((key) => !expected.includes(key));
  if (missing.length > 0 || unknown.length > 0) {
    throw new Error(
      `${label} 키가 스키마와 다릅니다. 누락: ${missing.join(", ") || "없음"}, 알 수 없음: ${unknown.join(", ") || "없음"}`,
    );
  }
}

function isDateTime(value: string): boolean {
  return value.includes("T") && Number.isFinite(Date.parse(value));
}

export function isLaneName(value: string): value is LaneName {
  return laneSet.has(value);
}

export function isBumpType(value: string): value is BumpType {
  return bumpSet.has(value);
}

function assertLaneDefinition(value: unknown, lane: LaneName): asserts value is LaneDefinition {
  assertObject(value, `${lane} 레인 설정`);
  assertExactKeys(value, ["bump", "prerelease", "sources"], `${lane} 레인 설정`);

  if (typeof value.bump !== "string" || !isBumpType(value.bump)) {
    throw new Error(`${lane} 레인의 bump 설정이 올바르지 않습니다.`);
  }
  if (typeof value.prerelease !== "boolean" || !Array.isArray(value.sources)) {
    throw new Error(`${lane} 레인의 prerelease 또는 sources 설정이 올바르지 않습니다.`);
  }
  if (!value.sources.every((source) => typeof source === "string" && isLaneName(source))) {
    throw new Error(`${lane} 레인의 source에 알 수 없는 레인이 있습니다.`);
  }
  const expected = lanePolicy[lane];
  if (
    value.bump !== expected.bump ||
    value.prerelease !== expected.prerelease ||
    JSON.stringify(value.sources) !== JSON.stringify(expected.sources)
  ) {
    throw new Error(`${lane} 레인 정책이 고정 스키마와 다릅니다.`);
  }
}

export function parseLaneConfig(value: unknown): LaneConfig {
  assertObject(value, "릴리즈 레인 설정");
  assertExactKeys(
    value,
    [
      "$schema",
      "schemaVersion",
      "repository",
      "maintainerTeam",
      "protectedDistTags",
      "lanes",
      "sync",
    ],
    "릴리즈 레인 설정",
  );

  if (value.$schema !== "./lanes.schema.json") {
    throw new Error("릴리즈 레인 JSON Schema 참조가 올바르지 않습니다.");
  }
  if (value.schemaVersion !== 1 || value.repository !== "daangn/seed-design") {
    throw new Error("지원하지 않는 릴리즈 레인 설정입니다.");
  }
  if (
    typeof value.maintainerTeam !== "string" ||
    value.maintainerTeam.length === 0 ||
    !Array.isArray(value.protectedDistTags) ||
    !value.protectedDistTags.every((tag) => typeof tag === "string" && tagPattern.test(tag)) ||
    new Set(value.protectedDistTags).size !== value.protectedDistTags.length ||
    !value.protectedDistTags.includes("latest") ||
    !value.protectedDistTags.includes("stable")
  ) {
    throw new Error("maintainer 또는 보호 dist-tag 설정이 올바르지 않습니다.");
  }
  assertObject(value.lanes, "레인 정의");
  assertExactKeys(value.lanes, laneNames, "레인 정의");
  const dev = value.lanes.dev;
  const minor = value.lanes.minor;
  const major = value.lanes.major;
  assertLaneDefinition(dev, "dev");
  assertLaneDefinition(minor, "minor");
  assertLaneDefinition(major, "major");

  assertObject(value.sync, "동기화 설정");
  assertExactKeys(value.sync, ["activation", "reconcileCron", "conflictAlertHours"], "동기화 설정");
  if (
    (value.sync.activation !== null &&
      (typeof value.sync.activation !== "string" || !isDateTime(value.sync.activation))) ||
    typeof value.sync.reconcileCron !== "string" ||
    value.sync.reconcileCron.length === 0 ||
    !Number.isInteger(value.sync.conflictAlertHours) ||
    Number(value.sync.conflictAlertHours) < 1
  ) {
    throw new Error("동기화 설정 값이 올바르지 않습니다.");
  }

  return {
    $schema: "./lanes.schema.json",
    schemaVersion: 1,
    repository: "daangn/seed-design",
    maintainerTeam: value.maintainerTeam,
    protectedDistTags: value.protectedDistTags as string[],
    lanes: { dev, minor, major },
    sync: {
      activation: value.sync.activation as string | null,
      reconcileCron: value.sync.reconcileCron,
      conflictAlertHours: value.sync.conflictAlertHours as number,
    },
  };
}

function assertReleaseFreeze(value: unknown): asserts value is ReleaseFreeze {
  assertObject(value, "승격 freeze");
  assertExactKeys(
    value,
    ["promotionLane", "candidateSha", "phase", "frozenLanes", "startedAt"],
    "승격 freeze",
  );
  const promotionLane = value.promotionLane;
  const expectedFrozenLanes = promotionLane === "minor" ? ["minor"] : ["minor", "major"];
  if (
    (promotionLane !== "minor" && promotionLane !== "major") ||
    typeof value.candidateSha !== "string" ||
    !shaPattern.test(value.candidateSha) ||
    !["frozen", "integrating", "rebuilding"].includes(String(value.phase)) ||
    !Array.isArray(value.frozenLanes) ||
    JSON.stringify(value.frozenLanes) !== JSON.stringify(expectedFrozenLanes) ||
    typeof value.startedAt !== "string" ||
    !isDateTime(value.startedAt)
  ) {
    throw new Error("승격 freeze 설정이 스키마와 다릅니다.");
  }
}

export function parseReleaseControl(value: unknown): ReleaseControl {
  assertObject(value, "릴리즈 제어 설정");
  assertExactKeys(
    value,
    ["$schema", "schemaVersion", "mode", "rootageContractReady", "freeze"],
    "릴리즈 제어 설정",
  );

  if (value.$schema !== "./control.schema.json") {
    throw new Error("릴리즈 제어 JSON Schema 참조가 올바르지 않습니다.");
  }
  if (
    value.schemaVersion !== 1 ||
    typeof value.mode !== "string" ||
    !["dry-run", "production"].includes(value.mode)
  ) {
    throw new Error("지원하지 않는 릴리즈 제어 설정입니다.");
  }
  if (typeof value.rootageContractReady !== "boolean") {
    throw new Error("Rootage 계약 준비 상태가 없습니다.");
  }
  if (value.mode === "production" && !value.rootageContractReady) {
    throw new Error("DES-2201 계약 없이 production 상태를 선언할 수 없습니다.");
  }
  if (value.freeze !== null) {
    assertReleaseFreeze(value.freeze);
  }
  return {
    $schema: "./control.schema.json",
    schemaVersion: 1,
    mode: value.mode as ReleaseControl["mode"],
    rootageContractReady: value.rootageContractReady,
    freeze: value.freeze,
  };
}

export async function loadLaneConfig(path = ".github/release/lanes.json"): Promise<LaneConfig> {
  return parseLaneConfig(JSON.parse(await readFile(path, "utf8")));
}

export async function loadReleaseControl(
  path = ".github/release/control.json",
): Promise<ReleaseControl> {
  return parseReleaseControl(JSON.parse(await readFile(path, "utf8")));
}
