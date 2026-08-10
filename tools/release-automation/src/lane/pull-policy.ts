import { activationOperationSpecs, assertActivationStateChange } from "../setup/activation";
import { isControlPlanePath } from "../sync/sync-control-plane";
import { isActivationOperation } from "../core/types";
import type { LaneConfig, LaneName, ReleaseControl, ReleaseMarker } from "../core/types";

const gitShaPattern = /^[0-9a-f]{40}$/;

export const releaseStateFiles = [
  ".changeset/config.json",
  ".changeset/pre.json",
  ".github/release/control.json",
  ".github/release/lanes.json",
] as const;

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

function assertExactFiles(files: string[], expected: readonly string[], label: string): void {
  const actual = [...new Set(files)].sort();
  const wanted = [...expected].sort();
  if (canonicalJson(actual) !== canonicalJson(wanted)) {
    throw new Error(`${label} PR은 ${wanted.join(", ")}만 변경할 수 있습니다.`);
  }
}

function assertDoesNotChange(files: string[], forbidden: readonly string[], label: string): void {
  const changed = files.filter((file) => forbidden.includes(file as (typeof forbidden)[number]));
  if (changed.length > 0) {
    throw new Error(`${label} PR은 릴리즈 상태 파일을 변경할 수 없습니다: ${changed.join(", ")}`);
  }
}

export function assertLanePullAllowed(input: {
  lane: LaneName;
  marker: ReleaseMarker | null;
  files: string[];
  control: ReleaseControl;
  config?: LaneConfig;
  proposedControl?: ReleaseControl;
  proposedConfig?: LaneConfig;
  headSha?: string;
}): void {
  const { lane, marker, files, control, config, proposedControl, proposedConfig, headSha } = input;

  if (!marker) {
    assertDoesNotChange(files, releaseStateFiles, "일반");
    const controlPlaneChanges = lane === "dev" ? [] : files.filter(isControlPlanePath);
    if (controlPlaneChanges.length > 0) {
      throw new Error(
        `${lane} 일반 PR은 trusted dev release control plane을 변경할 수 없습니다: ${controlPlaneChanges.join(", ")}`,
      );
    }
    return;
  }

  if (marker.type === "activation") {
    if (lane !== "dev" || marker.targetLane) {
      throw new Error("activation PR은 target lane 없이 dev control plane만 대상으로 합니다.");
    }
    if (!isActivationOperation(marker.tag)) {
      throw new Error(`지원하지 않는 activation operation입니다: ${marker.tag ?? "없음"}`);
    }
    const activationFile = activationOperationSpecs[marker.tag].stateFile;
    assertExactFiles(files, [activationFile], "activation");
    if (!config || !proposedControl || !proposedConfig) {
      throw new Error("activation PR의 current/proposed release state를 읽지 못했습니다.");
    }
    assertActivationStateChange(marker.tag ?? "", control, config, proposedControl, proposedConfig);
    return;
  }

  if (marker.type === "bootstrap") {
    if (
      (lane !== "minor" && lane !== "major") ||
      marker.targetLane !== lane ||
      marker.tag !== "beta" ||
      !headSha ||
      marker.expectedHeadSha !== headSha ||
      !gitShaPattern.test(headSha) ||
      !marker.controlSha ||
      !gitShaPattern.test(marker.controlSha) ||
      control.mode !== "dry-run" ||
      !control.rootageContractReady ||
      config?.sync.activation !== null
    ) {
      throw new Error("bootstrap PR이 exact lane/head/baseline 또는 dry-run 준비 상태와 다릅니다.");
    }
    assertExactFiles(files, [".changeset/config.json", ".changeset/pre.json"], "bootstrap");
    return;
  }

  if (marker.type === "sync") {
    assertDoesNotChange(files, releaseStateFiles, "sync");
    return;
  }

  if (marker.type === "code-promotion") {
    assertDoesNotChange(files, releaseStateFiles, "code promotion");
    const controlPlaneChanges = files.filter(isControlPlanePath);
    if (controlPlaneChanges.length > 0) {
      throw new Error(
        `code promotion PR은 trusted dev release control plane을 변경할 수 없습니다: ${controlPlaneChanges.join(", ")}`,
      );
    }
    return;
  }

  if (marker.type === "version") {
    assertDoesNotChange(
      files,
      [".changeset/config.json", ".github/release/control.json", ".github/release/lanes.json"],
      "Version Packages",
    );
    return;
  }

  throw new Error(`${marker.type} generated PR은 현재 릴리즈 운영 범위에서 허용되지 않습니다.`);
}
