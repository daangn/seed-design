import { describe, expect, test } from "bun:test";
import { applyActivation, assertActivationStateChange } from "./activation";
import type { LaneConfig, ReleaseControl } from "../core/types";

const config: LaneConfig = {
  $schema: "./lanes.schema.json",
  schemaVersion: 1,
  repository: "daangn/seed-design",
  maintainerTeam: "design-system",
  protectedDistTags: ["latest", "stable"],
  lanes: {
    dev: { bump: "patch", prerelease: false, sources: [] },
    minor: { bump: "minor", prerelease: true, sources: ["dev"] },
    major: { bump: "major", prerelease: true, sources: ["dev", "minor"] },
  },
  sync: { activation: null, reconcileCron: "*/10 * * * *", conflictAlertHours: 24 },
};

const control: ReleaseControl = {
  $schema: "./control.schema.json",
  schemaVersion: 1,
  mode: "dry-run",
  rootageContractReady: false,
};

describe("릴리즈 자동화 활성화", () => {
  test("Rootage 계약 준비 상태를 활성화한다", () => {
    const result = applyActivation(
      "enable-rootage-contract",
      control,
      config,
      "2026-08-07T00:00:00.000Z",
    );

    expect(result.changed).toBe("control");
    expect(result.control.rootageContractReady).toBe(true);
    expect(control.rootageContractReady).toBe(false);
  });

  test("Rootage 계약 준비 상태의 중복 활성화를 거부한다", () => {
    expect(() =>
      applyActivation(
        "enable-rootage-contract",
        { ...control, rootageContractReady: true },
        config,
        "2026-08-07T00:00:00.000Z",
      ),
    ).toThrow("이미 준비");
  });

  test("동기화는 준비된 dry-run 상태에서만 exact state change로 활성화한다", () => {
    const prepared = { ...control, rootageContractReady: true };
    expect(() =>
      applyActivation("enable-sync", control, config, "2026-08-07T00:00:00.000Z"),
    ).toThrow("Rootage 계약");

    const result = applyActivation("enable-sync", prepared, config, "2026-08-07T00:00:00.000Z");
    expect(result.config.sync.activation).toBe("2026-08-07T00:00:00.000Z");
    expect(() =>
      assertActivationStateChange("enable-sync", prepared, config, result.control, result.config),
    ).not.toThrow();
    expect(() =>
      assertActivationStateChange("enable-sync", prepared, config, result.control, {
        ...result.config,
        maintainerTeam: "unexpected",
      }),
    ).toThrow("exact 상태 전이");
  });

  test("동기화와 Rootage 계약 준비 후에만 production을 활성화한다", () => {
    expect(() =>
      applyActivation("enable-production", control, config, "2026-08-07T00:00:00.000Z"),
    ).toThrow("동기화를 먼저");

    const activatedConfig = {
      ...config,
      sync: { ...config.sync, activation: "2026-08-07T00:00:00.000Z" },
    };
    expect(() =>
      applyActivation("enable-production", control, activatedConfig, "2026-08-07T00:00:00.000Z"),
    ).toThrow("DES-2201 계약");

    const result = applyActivation(
      "enable-production",
      { ...control, rootageContractReady: true },
      activatedConfig,
      "2026-08-07T00:00:00.000Z",
    );
    expect(result.control.mode).toBe("production");
  });

  test("production을 dry-run으로 exact state change한다", () => {
    const production = { ...control, mode: "production" as const, rootageContractReady: true };
    const result = applyActivation(
      "enable-dry-run",
      production,
      config,
      "2026-08-10T00:00:00.000Z",
    );

    expect(result).toEqual({
      config,
      control: { ...production, mode: "dry-run" },
      changed: "control",
    });
    expect(() =>
      assertActivationStateChange(
        "enable-dry-run",
        production,
        config,
        result.control,
        result.config,
      ),
    ).not.toThrow();
    expect(() =>
      assertActivationStateChange(
        "enable-dry-run",
        production,
        config,
        { ...result.control, rootageContractReady: false },
        result.config,
      ),
    ).toThrow("exact 상태 전이");
  });

  test("dry-run 중복 활성화를 거부한다", () => {
    expect(() =>
      applyActivation("enable-dry-run", control, config, "2026-08-10T00:00:00.000Z"),
    ).toThrow("이미 활성화");
  });
});
