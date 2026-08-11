import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { assertWorktreeUnchanged, releaseVerifySteps } from "./verify";

describe("release verification plan", () => {
  test("root aliases는 workspace runner 로그 없이 고정 local entrypoint를 실행한다", async () => {
    const rootPackage = JSON.parse(
      await readFile(join(import.meta.dir, "../../../..", "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };
    expect(rootPackage.scripts["release:doctor"]).toBe(
      "bun tools/release-automation/src/local/doctor.ts",
    );
    expect(rootPackage.scripts["release:verify"]).toBe(
      "bun tools/release-automation/src/local/verify.ts",
    );
    expect(rootPackage.scripts.release).toBeUndefined();
  });

  test("기본 명령은 clean setup부터 production write 없는 전체 gate를 실행한다", () => {
    const steps = releaseVerifySteps({ skipSetup: false });
    expect(steps.slice(0, 3).map((step) => step.command)).toEqual([
      ["bun", "install", "--frozen-lockfile"],
      ["bun", "ecosystem:build"],
      ["bun", "install", "--frozen-lockfile"],
    ]);
    expect(steps.map((step) => step.command.join(" "))).toContain("bun packages:build");
    expect(steps.map((step) => step.command.join(" "))).toContain("bun test:all");
    expect(steps.map((step) => step.command.join(" "))).toContain(
      "bun test --timeout 30000 tools/release-automation/src tools/rootage-cdn/src",
    );
    expect(steps.map((step) => step.command.join(" "))).toContain(
      "bun biome check tools/release-automation tools/rootage-cdn/src",
    );
    expect(steps.map((step) => step.command.join(" "))).toContain(
      "bun --filter @seed-design/release-automation typecheck",
    );
    expect(steps.map((step) => step.command.join(" "))).toContain("git diff --check");
    expect(steps.map((step) => step.command.join(" "))).toContain(
      "bun tools/release-automation/src/local/dry-run.ts",
    );
    expect(steps.flatMap((step) => step.command)).not.toContain("publish");
  });

  test("CI prepared mode도 동일한 verification gate를 사용한다", () => {
    const local = releaseVerifySteps({ skipSetup: false });
    const prepared = releaseVerifySteps({ skipSetup: true });
    expect(prepared).toEqual(local.slice(3));
  });

  test("Wrangler 로그는 workspace 밖 임시 경로를 사용한다", () => {
    const wrangler = releaseVerifySteps({ skipSetup: true }).find(
      (step) => step.command.at(-1) === "wrangler:dry-run",
    );
    expect(wrangler?.env?.WRANGLER_LOG_PATH).toStartWith("/tmp/");
  });

  test("검증 전후 source 상태 차이를 거부한다", () => {
    expect(() => assertWorktreeUnchanged("same", "same")).not.toThrow();
    expect(() => assertWorktreeUnchanged("before", "after")).toThrow("source 상태");
  });
});
