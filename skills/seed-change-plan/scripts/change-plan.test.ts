import { afterEach, describe, expect, it } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { planSeedChange } from "./change-plan";

const fixtures: string[] = [];

function createFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "seed-change-plan-"));
  fixtures.push(root);
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      name: "@seed-design/project",
      private: true,
      scripts: { "generate:all": "generate", "test:all": "test" },
    }),
  );
  return root;
}

function writeFixtureFile(root: string, path: string, value: unknown): void {
  const target = join(root, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, typeof value === "string" ? value : JSON.stringify(value));
}

function writePackage(root: string, directory: string, name: string): void {
  writeFixtureFile(root, `${directory}/package.json`, { name, version: "1.0.0", private: false });
}

function git(root: string, args: string[]): string {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function commit(root: string, message: string): void {
  git(root, ["add", "-A"]);
  git(root, [
    "-c",
    "user.name=Seed Test",
    "-c",
    "user.email=seed@example.com",
    "commit",
    "-m",
    message,
  ]);
}

function createGitFixture(): string {
  const root = createFixture();
  writePackage(root, "packages/source", "@seed-design/source");
  writePackage(root, "packages/target", "@seed-design/target");
  writePackage(root, "packages/removed", "@seed-design/removed");
  writeFixtureFile(root, "packages/source/src/item.ts", "export const item = 1;\n");
  writeFixtureFile(root, "packages/removed/src/index.ts", "export {};\n");
  git(root, ["init"]);
  commit(root, "base");
  const commonBase = git(root, ["rev-parse", "HEAD"]);
  git(root, ["update-ref", "refs/remotes/origin/dev", commonBase]);
  git(root, ["update-ref", "refs/remotes/origin/major", commonBase]);
  writeFixtureFile(root, "lane-only.md", "minor lane\n");
  writeFixtureFile(root, "packages/source/src/lane-only.ts", "export const laneOnly = true;\n");
  commit(root, "minor lane");
  git(root, ["update-ref", "refs/remotes/origin/minor", "HEAD"]);
  mkdirSync(join(root, "packages/target/src"), { recursive: true });
  renameSync(join(root, "packages/source/src/item.ts"), join(root, "packages/target/src/item.ts"));
  rmSync(join(root, "packages/removed"), { recursive: true });
  commit(root, "feature change");
  return root;
}

afterEach(() => {
  for (const fixture of fixtures.splice(0)) rmSync(fixture, { recursive: true, force: true });
});

describe("seed-change-plan", () => {
  it("릴리스가 없는 스킬 변경은 dev와 필수 저장소 검증을 선택한다", async () => {
    const root = createFixture();
    const result = await planSeedChange({
      root,
      changedPaths: ["skills/seed-design/SKILL.md"],
    });

    expect(result.branch).toMatchObject({
      targetBranch: "dev",
      targetRef: "origin/dev",
      prBase: "dev",
    });
    expect(result.impact.platforms).toEqual(["tooling"]);
    expect(result.verification.map((step) => step.command).filter(Boolean)).toEqual(
      expect.arrayContaining(["bun generate:all", "bun test:all"]),
    );
  });

  it("skills 루트 정책 파일을 개별 스킬 디렉터리로 취급하지 않는다", async () => {
    const root = createFixture();
    const result = await planSeedChange({
      root,
      changedPaths: ["skills/AGENTS.md"],
    });

    expect(result.branch.targetBranch).toBe("dev");
    expect(result.verification.some((step) => step.id === "skill-tests")).toBe(false);
  });

  it("Lynx 예제 변경은 제거된 검증 스킬 대신 수동 런타임 확인을 안내한다", async () => {
    const root = createFixture();
    const result = await planSeedChange({
      root,
      changedPaths: ["docs/examples/lynx/action-button/index.tsx"],
      releaseDecision: "confirmed-none",
    });
    const runtimeStep = result.verification.find((step) => step.id === "lynx-example-runtime");

    expect(runtimeStep).toMatchObject({
      kind: "manual",
      source: "skills/seed-write-lynx-component-docs/references/verification.md",
    });
    expect(runtimeStep?.skill).toBeUndefined();
  });

  it("Git 브랜치 근거가 불완전하면 docs-only 변경도 기준 브랜치를 확정하지 않는다", async () => {
    const root = createFixture();
    const result = await planSeedChange({
      root,
      changedPaths: ["docs/plans/example.md"],
      releaseDecision: "confirmed-none",
      branchEvidenceComplete: false,
      branchEvidenceErrors: ["origin/minor diff를 읽지 못했습니다."],
    });

    expect(result.branch.targetBranch).toBe("unknown");
    expect(result.branchEvidence.complete).toBe(false);
    expect(result.branchEvidence.errors).toEqual(["origin/minor diff를 읽지 못했습니다."]);
  });

  it("lane 경로 교집합은 후보로 남기고 명시적으로 확정한 lane만 사용한다", async () => {
    const root = createFixture();
    const path = "skills/seed-design/SKILL.md";
    const candidate = await planSeedChange({
      root,
      changedPaths: [path],
      releaseDecision: "confirmed-none",
      laneCandidates: { minor: [path], major: [] },
    });
    const confirmed = await planSeedChange({
      root,
      changedPaths: [path],
      releaseDecision: "confirmed-none",
      laneCandidates: { minor: [path], major: [] },
      confirmedLane: "minor",
    });

    expect(candidate.branch.targetBranch).toBe("unknown");
    expect(confirmed.branch.targetBranch).toBe("minor");
  });

  it("확정 lane과 bump가 충돌하면 기준 브랜치를 확정하지 않는다", async () => {
    const root = createFixture();
    mkdirSync(join(root, "packages/react/src"), { recursive: true });
    writeFileSync(
      join(root, "packages/react/package.json"),
      JSON.stringify({ name: "@seed-design/react", private: false }),
    );
    const changedPath = "packages/react/src/Button.tsx";
    const result = await planSeedChange({
      root,
      changedPaths: [changedPath],
      confirmedBumps: ["major"],
      laneCandidates: { minor: [changedPath], major: [] },
      confirmedLane: "minor",
    });

    expect(result.branch).toMatchObject({
      targetBranch: "unknown",
      targetRef: "unknown",
      prBase: "unknown",
    });
    expect(result.branch.reason).toContain("충돌");
    expect(result.uncertainties).toContain(result.branch.reason);
  });

  it("공개 패키지의 bump가 미확정이면 확정 lane보다 release gate를 우선한다", async () => {
    const root = createFixture();
    writePackage(root, "packages/react", "@seed-design/react");
    const input = {
      root,
      changedPaths: ["packages/react/src/Button.tsx"],
      laneCandidates: { minor: ["packages/react/src/Button.tsx"], major: [] },
      confirmedLane: "minor" as const,
    };
    const unconfirmed = await planSeedChange(input);
    const confirmed = await planSeedChange({ ...input, confirmedBumps: ["minor"] });

    expect(unconfirmed.branch.targetBranch).toBe("unknown");
    expect(unconfirmed.branch.reason).toContain("bump가 아직 확정되지 않았습니다");
    expect(confirmed.branch.targetBranch).toBe("minor");
  });

  it("명시 base ref 이후 feature rename과 삭제의 이전·새 경로만 수집한다", () => {
    const root = createGitFixture();
    const script = join(import.meta.dir, "change-plan.ts");
    const execution = spawnSync(process.execPath, [script, "--base-ref", "origin/minor"], {
      cwd: root,
      encoding: "utf8",
    });
    expect(execution.status).toBe(0);
    const result = JSON.parse(execution.stdout);

    expect(result.paths.changed).toEqual(
      expect.arrayContaining([
        "packages/source/src/item.ts",
        "packages/target/src/item.ts",
        "packages/removed/package.json",
      ]),
    );
    expect(result.paths.changed).not.toContain("lane-only.md");
    expect(result.impact.packages.map((item: { name: string }) => item.name)).toEqual(
      expect.arrayContaining([
        "@seed-design/source",
        "@seed-design/target",
        "@seed-design/removed",
      ]),
    );
    expect(result.branchEvidence.baseRef).toBe("origin/minor");
  });

  it("디렉터리 계획과 lane 파일의 겹침은 실제 파일 근거로 남기고 lane 확정을 요구한다", () => {
    const root = createGitFixture();
    const script = join(import.meta.dir, "change-plan.ts");
    const run = (args: string[]) => {
      const execution = spawnSync(process.execPath, [script, ...args], {
        cwd: root,
        encoding: "utf8",
      });
      expect(execution.status).toBe(0);
      return JSON.parse(execution.stdout);
    };
    const options = ["--path", "packages/source/", "--base-ref", "origin/minor", "--no-release"];
    const candidate = run(options);
    const confirmed = run([...options, "--lane", "minor"]);
    const repositoryRoot = run(["--path", "./", "--base-ref", "origin/minor", "--no-release"]);

    expect(candidate.paths.changed).toEqual(["packages/source"]);
    expect(candidate.branchEvidence.laneCandidates.minor).toEqual([
      "packages/source/src/lane-only.ts",
    ]);
    expect(candidate.branch.targetBranch).toBe("unknown");
    expect(confirmed.branch.targetBranch).toBe("minor");
    expect(repositoryRoot.paths.changed).toEqual(["."]);
    expect(repositoryRoot.branchEvidence.laneCandidates.minor).toContain("lane-only.md");
  });

  it("React와 Lynx registry item을 컴포넌트와 플랫폼에 연결한다", async () => {
    const root = createFixture();
    const result = await planSeedChange({
      root,
      changedPaths: [
        "docs/registry/react/ui/action-button.tsx",
        "docs/public/__registry__/lynx/ui/action-button.json",
        "docs/public/__registry__/react/ui/index.json",
      ],
    });

    expect(result.impact.components).toEqual(["action-button"]);
    expect(result.impact.platforms).toEqual(expect.arrayContaining(["docs", "lynx", "react"]));
  });

  it("생성물 예외와 component ID, package 디렉터리 입력을 정확히 분류한다", async () => {
    const root = createFixture();
    writePackage(root, "packages/rootage", "@seed-design/rootage");
    writePackage(root, "packages/css", "@seed-design/css");
    writePackage(root, "packages/qvism-preset", "@seed-design/qvism-preset");
    writePackage(root, "packages/lynx-css", "@seed-design/lynx-css");
    writePackage(root, "packages/react", "@seed-design/react");
    writePackage(root, "packages/stackflow", "@seed-design/stackflow");
    writePackage(
      root,
      "packages/react-headless/action-button",
      "@seed-design/react-headless-action-button",
    );
    const result = await planSeedChange({
      root,
      changedPaths: [
        "packages/rootage/duration.yaml",
        "packages/css/all.css",
        "packages/qvism-preset/src/token.css",
        "packages/qvism-preset/src/tokens.ts",
        "packages/lynx-css/recipes/action-button.css",
        "packages/lynx-css/recipes/progress-circle.css",
        "packages/lynx-css/recipes/progress-circle.mjs",
        "packages/lynx-css/recipes/progress-circle.d.ts",
        "packages/react-headless/action-button/src/useActionButton.ts",
        "packages/stackflow/src/components/AppBar/AppBar.tsx",
        "packages/rootage/components/schema.json",
        "docs/content/react/components/button.mdx",
        "docs/content/react/components/(deprecated)/action-sheet.mdx",
        "docs/content/react/components/(foundation)/layout/box.mdx",
        "docs/content/react/components/index.mdx",
        "docs/content/react/components/meta.json",
        "packages/react",
      ],
    });
    const surfaces = new Map(
      result.impact.surfaces.map((surface) => [surface.kind, surface.paths]),
    );

    expect(surfaces.get("generated")).toEqual(
      expect.arrayContaining([
        "packages/css/all.css",
        "packages/qvism-preset/src/token.css",
        "packages/qvism-preset/src/tokens.ts",
        "packages/lynx-css/recipes/action-button.css",
      ]),
    );
    expect(surfaces.get("source")).toEqual(
      expect.arrayContaining([
        "packages/rootage/duration.yaml",
        "packages/lynx-css/recipes/progress-circle.css",
        "packages/lynx-css/recipes/progress-circle.mjs",
        "packages/lynx-css/recipes/progress-circle.d.ts",
      ]),
    );
    expect(result.impact.components).toEqual([
      "action-button",
      "action-sheet",
      "app-bar",
      "box",
      "button",
    ]);
    expect(result.impact.platforms).toContain("react");
    expect(result.impact.packages.some((item) => item.path === "packages/react")).toBe(true);
  });
});
