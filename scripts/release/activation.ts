import type { LaneConfig, ReleaseControl } from "./types";

export type ActivationOperation = "enable-rootage-contract" | "enable-sync" | "enable-production";

export interface ActivationResult {
  config: LaneConfig;
  control: ReleaseControl;
  changed: "config" | "control";
}

export function applyActivation(
  operation: string,
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
    return {
      config: { ...config, sync: { ...config.sync, activation: activatedAt } },
      control,
      changed: "config",
    };
  }

  if (operation === "enable-production") {
    if (!config.sync.activation) throw new Error("동기화를 먼저 활성화해야 합니다.");
    if (!control.rootageContractReady) throw new Error("DES-2201 계약이 준비되지 않았습니다.");
    if (control.freeze) throw new Error("승격 중에는 production을 활성화할 수 없습니다.");
    if (control.mode === "production") throw new Error("production이 이미 활성화되어 있습니다.");
    return {
      config,
      control: { ...control, mode: "production" },
      changed: "control",
    };
  }

  throw new Error(`지원하지 않는 activation 작업입니다: ${operation}`);
}
