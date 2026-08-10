import { describe, expect, test } from "bun:test";
import type { LaneConfig, ReleaseControl, ReleaseMarker } from "../core/types";
import { assertLanePullAllowed } from "./pull-policy";

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
  sync: { activation: null, reconcileCron: "*/10 * * * *", conflictAlertHours: 1 },
};

const control: ReleaseControl = {
  $schema: "./control.schema.json",
  schemaVersion: 1,
  mode: "dry-run",
  rootageContractReady: true,
};

describe("steady-state lane pull policy", () => {
  test("일반 lane PR은 release state와 trusted control plane을 바꾸지 못한다", () => {
    expect(() =>
      assertLanePullAllowed({ lane: "dev", marker: null, files: ["packages/a/src/a.ts"], control }),
    ).not.toThrow();
    expect(() =>
      assertLanePullAllowed({
        lane: "minor",
        marker: null,
        files: ["tools/release-automation/src/core/config.ts"],
        control,
      }),
    ).toThrow("trusted dev release control plane");
    expect(() =>
      assertLanePullAllowed({
        lane: "dev",
        marker: null,
        files: [".github/release/control.json"],
        control,
      }),
    ).toThrow("릴리즈 상태 파일");
  });

  test("sync와 Version PR의 상태 파일 변경을 거부한다", () => {
    const sync: ReleaseMarker = { schemaVersion: 1, type: "sync", lane: "minor" };
    const version: ReleaseMarker = { schemaVersion: 1, type: "version", lane: "dev" };
    expect(() =>
      assertLanePullAllowed({
        lane: "minor",
        marker: sync,
        files: [".github/release/lanes.json"],
        control,
      }),
    ).toThrow("릴리즈 상태 파일");
    expect(() =>
      assertLanePullAllowed({
        lane: "dev",
        marker: version,
        files: [".changeset/config.json"],
        control,
      }),
    ).toThrow("릴리즈 상태 파일");
  });

  test("현재 범위 밖 generated marker를 fail closed한다", () => {
    expect(() =>
      assertLanePullAllowed({
        lane: "major",
        marker: {
          schemaVersion: 1,
          type: "unsupported",
          lane: "major",
        } as unknown as ReleaseMarker,
        files: [],
        control,
      }),
    ).toThrow("현재 릴리즈 운영 범위");
  });

  test("activation은 exact state file과 pure state change만 허용한다", () => {
    const marker: ReleaseMarker = {
      schemaVersion: 1,
      type: "activation",
      lane: "dev",
      tag: "enable-sync",
    };
    const proposedConfig: LaneConfig = {
      ...config,
      sync: { ...config.sync, activation: "2026-08-10T00:00:00.000Z" },
    };
    expect(() =>
      assertLanePullAllowed({
        lane: "dev",
        marker,
        files: [".github/release/lanes.json"],
        control,
        config,
        proposedControl: control,
        proposedConfig,
      }),
    ).not.toThrow();
  });

  test("enable-dry-run은 production에서 control mode만 낮춘다", () => {
    const production = { ...control, mode: "production" as const };
    const marker: ReleaseMarker = {
      schemaVersion: 1,
      type: "activation",
      lane: "dev",
      tag: "enable-dry-run",
    };
    expect(() =>
      assertLanePullAllowed({
        lane: "dev",
        marker,
        files: [".github/release/control.json"],
        control: production,
        config,
        proposedControl: { ...production, mode: "dry-run" },
        proposedConfig: config,
      }),
    ).not.toThrow();
    expect(() =>
      assertLanePullAllowed({
        lane: "dev",
        marker,
        files: [".github/release/control.json"],
        control: production,
        config,
        proposedControl: { ...production, mode: "dry-run", rootageContractReady: false },
        proposedConfig: config,
      }),
    ).toThrow("exact 상태 전이");
  });
});
