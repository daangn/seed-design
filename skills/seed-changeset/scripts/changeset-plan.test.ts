import { describe, expect, it } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { buildChangesetPlan } from "./changeset-plan";

async function createFixture() {
  const root = await mkdtemp(join(tmpdir(), "seed-changeset-plan-"));
  const write = async (path: string, value: unknown) => {
    const target = join(root, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, typeof value === "string" ? value : JSON.stringify(value), "utf8");
  };

  await write("package.json", {
    private: true,
    workspaces: ["packages/*", "packages/react-headless/*"],
  });
  await write(".changeset/config.json", { baseBranch: "dev" });
  return { root, write };
}

function git(root: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

async function createGitFixture() {
  const fixture = await createFixture();
  for (const packageName of ["source", "target", "removed"]) {
    await fixture.write(`packages/${packageName}/package.json`, {
      name: `@seed-design/${packageName}`,
      version: "1.0.0",
    });
  }
  await fixture.write("packages/source/src/item.ts", "export const item = true;\n");
  await fixture.write("packages/removed/src/item.ts", "export const removed = true;\n");

  git(fixture.root, "init", "--quiet");
  git(fixture.root, "config", "user.email", "seed@example.com");
  git(fixture.root, "config", "user.name", "SEED Test");
  git(fixture.root, "add", ".");
  git(fixture.root, "commit", "--quiet", "-m", "base");
  git(fixture.root, "update-ref", "refs/remotes/origin/dev", "HEAD");
  return fixture;
}

describe("seed-changeset plan", () => {
  it("CLI base ref는 세 원격 release branch로 제한한다", async () => {
    const fixture = await createFixture();
    try {
      const script = join(import.meta.dir, "changeset-plan.ts");
      const execution = spawnSync(
        process.execPath,
        [script, "--root", fixture.root, "--base-ref", "HEAD"],
        { encoding: "utf8" },
      );

      expect(execution.status).toBe(1);
      expect(execution.stderr).toContain("지원하지 않는 기준 ref입니다: HEAD");
    } finally {
      await rm(fixture.root, { recursive: true, force: true });
    }
  });

  it("공개 변경 패키지와 기존 coverage, 역의존 후보를 구분한다", async () => {
    const fixture = await createFixture();
    try {
      await fixture.write("packages/css/package.json", {
        name: "@seed-design/css",
        version: "2.6.1",
      });
      await fixture.write("packages/react/package.json", {
        name: "@seed-design/react",
        version: "2.4.1",
        peerDependencies: { "@seed-design/css": "^2.6.0" },
      });
      await fixture.write(
        ".changeset/quiet-badgers-wave.md",
        '---\n"@seed-design/css": patch\n---\n\nCSS 오류를 수정합니다.\n',
      );

      const plan = await buildChangesetPlan({
        root: fixture.root,
        baseRef: "origin/dev",
        changedPaths: ["packages/css/src/index.ts", ".changeset/quiet-badgers-wave.md"],
      });

      expect(plan.candidates).toEqual([
        {
          package: "@seed-design/css",
          directory: "packages/css",
          version: "2.6.1",
          coveredBy: [".changeset/quiet-badgers-wave.md"],
        },
      ]);
      expect(plan.reverseDependencies).toEqual([
        {
          dependency: "@seed-design/css",
          dependent: "@seed-design/react",
          section: "peerDependencies",
          range: "^2.6.0",
        },
      ]);
      expect(plan.versionChangesReviewCandidates).toEqual([
        {
          dependency: "@seed-design/css",
          dependent: "@seed-design/react",
          range: "^2.6.0",
          reviewIn: "Version Changes PR",
        },
      ]);
    } finally {
      await rm(fixture.root, { recursive: true, force: true });
    }
  });

  it("private workspace와 archive 패키지를 후보에서 제외한다", async () => {
    const fixture = await createFixture();
    try {
      await fixture.write("packages/private-tools/package.json", {
        name: "@seed-design/private-tools",
        version: "0.0.0",
        private: true,
      });
      await fixture.write("packages/archive/react-theming/package.json", {
        name: "@seed-design/react-theming",
        version: "2.1.5",
      });

      const plan = await buildChangesetPlan({
        root: fixture.root,
        baseRef: "origin/dev",
        changedPaths: [
          "packages/private-tools/src/index.ts",
          "packages/archive/react-theming/src/index.ts",
        ],
      });

      expect(plan.candidates).toEqual([]);
      expect(plan.excluded).toEqual([
        {
          package: "@seed-design/private-tools",
          directory: "packages/private-tools",
          reasons: ["private"],
        },
        {
          package: "@seed-design/react-theming",
          directory: "packages/archive/react-theming",
          reasons: ["archive"],
        },
      ]);
    } finally {
      await rm(fixture.root, { recursive: true, force: true });
    }
  });

  it("잘못된 workspace package.json은 누락으로 취급하지 않고 오류로 보고한다", async () => {
    const fixture = await createFixture();
    try {
      await fixture.write("packages/broken/package.json", "{ invalid json");

      await expect(
        buildChangesetPlan({
          root: fixture.root,
          baseRef: "origin/dev",
          changedPaths: ["packages/broken/src/index.ts"],
        }),
      ).rejects.toThrow("packages/broken/package.json을 읽지 못했습니다");
    } finally {
      await rm(fixture.root, { recursive: true, force: true });
    }
  });

  it("rename의 이전·새 경로와 삭제된 공개 패키지를 base ref에서 복원한다", async () => {
    const fixture = await createGitFixture();
    try {
      await mkdir(join(fixture.root, "packages/target/src"), { recursive: true });
      await rename(
        join(fixture.root, "packages/source/src/item.ts"),
        join(fixture.root, "packages/target/src/item.ts"),
      );
      await rm(join(fixture.root, "packages/removed"), { recursive: true });
      git(fixture.root, "add", "-A");

      const plan = await buildChangesetPlan({
        root: fixture.root,
        baseRef: "origin/dev",
      });

      expect(plan.changedPaths).toContain("packages/source/src/item.ts");
      expect(plan.changedPaths).toContain("packages/target/src/item.ts");
      expect(plan.changedPaths).toContain("packages/removed/package.json");
      expect(plan.candidates.map((candidate) => candidate.package)).toEqual([
        "@seed-design/removed",
        "@seed-design/source",
        "@seed-design/target",
      ]);
    } finally {
      await rm(fixture.root, { recursive: true, force: true });
    }
  });
});
