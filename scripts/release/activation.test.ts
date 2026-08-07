import { describe, expect, test } from "bun:test";
import { applyActivation } from "./activation";
import type { LaneConfig, ReleaseControl } from "./types";

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
  freeze: null,
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
});
