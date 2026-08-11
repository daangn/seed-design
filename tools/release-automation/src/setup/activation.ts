import { isActivationOperation } from "../core/types";
import type { ActivationOperation, LaneConfig, ReleaseControl } from "../core/types";

export const activationOperationSpecs = {
  "enable-rootage-contract": {
    stateFile: ".github/release/control.json",
    requiresBootstrapReadiness: false,
  },
  "enable-sync": {
    stateFile: ".github/release/lanes.json",
    requiresBootstrapReadiness: true,
  },
  "enable-dry-run": {
    stateFile: ".github/release/control.json",
    requiresBootstrapReadiness: false,
  },
  "enable-production": {
    stateFile: ".github/release/control.json",
    requiresBootstrapReadiness: false,
  },
} as const satisfies Record<
  ActivationOperation,
  {
    stateFile: ".github/release/control.json" | ".github/release/lanes.json";
    requiresBootstrapReadiness: boolean;
  }
>;

export interface ActivationResult {
  config: LaneConfig;
  control: ReleaseControl;
  changed: "config" | "control";
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

export function applyActivation(
  operation: ActivationOperation,
  control: ReleaseControl,
  config: LaneConfig,
  activatedAt: string,
): ActivationResult {
  if (operation === "enable-rootage-contract") {
    if (control.rootageContractReady) throw new Error("Rootage 계약이 이미 준비되어 있습니다.");
    return {
      config,
      control: { ...control, rootageContractReady: true },
      changed: "control",
    };
  }

  if (operation === "enable-sync") {
    if (config.sync.activation) throw new Error("동기화가 이미 활성화되어 있습니다.");
    if (control.mode !== "dry-run" || !control.rootageContractReady) {
      throw new Error("동기화는 Rootage 계약이 준비된 dry-run 상태에서만 활성화할 수 있습니다.");
    }
    if (!activatedAt.includes("T") || !Number.isFinite(Date.parse(activatedAt))) {
      throw new Error("동기화 activation 시각이 올바르지 않습니다.");
    }
    return {
      config: { ...config, sync: { ...config.sync, activation: activatedAt } },
      control,
      changed: "config",
    };
  }

  if (operation === "enable-dry-run") {
    if (control.mode === "dry-run") throw new Error("dry-run이 이미 활성화되어 있습니다.");
    return {
      config,
      control: { ...control, mode: "dry-run" },
      changed: "control",
    };
  }

  if (operation === "enable-production") {
    if (!config.sync.activation) throw new Error("동기화를 먼저 활성화해야 합니다.");
    if (!control.rootageContractReady) throw new Error("DES-2201 계약이 준비되지 않았습니다.");
    if (control.mode === "production") throw new Error("production이 이미 활성화되어 있습니다.");
    return {
      config,
      control: { ...control, mode: "production" },
      changed: "control",
    };
  }

  operation satisfies never;
  throw new Error("지원하지 않는 activation 작업입니다.");
}

export function assertActivationStateChange(
  operation: string,
  currentControl: ReleaseControl,
  currentConfig: LaneConfig,
  proposedControl: ReleaseControl,
  proposedConfig: LaneConfig,
): void {
  if (!isActivationOperation(operation)) {
    throw new Error(`지원하지 않는 activation 작업입니다: ${operation}`);
  }
  const activatedAt =
    operation === "enable-sync"
      ? (proposedConfig.sync.activation ?? "")
      : "1970-01-01T00:00:00.000Z";
  const expected = applyActivation(operation, currentControl, currentConfig, activatedAt);
  if (
    canonicalJson(expected.control) !== canonicalJson(proposedControl) ||
    canonicalJson(expected.config) !== canonicalJson(proposedConfig)
  ) {
    throw new Error(`${operation} activation PR이 허용된 exact 상태 전이와 다릅니다.`);
  }
}
