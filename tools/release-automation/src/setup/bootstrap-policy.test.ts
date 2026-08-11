import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  assertBootstrapControlState,
  verifyBootstrapPull,
  verifyBootstrapReadiness,
  type BootstrapLane,
} from "./bootstrap-policy";
import type { LaneConfig, ReleaseControl, ReleaseMarker } from "../core/types";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true })));
});

async function git(repository: string, ...arguments_: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...arguments_], {
    cwd: repository,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

async function json(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

const laneConfig: LaneConfig = {
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
  rootageContractReady: true,
};

async function baselineRepository(): Promise<{ repository: string; baseline: string }> {
  const repository = await mkdtemp(join(tmpdir(), "seed-bootstrap-policy-"));
  temporaryDirectories.push(repository);
  await git(repository, "init");
  await git(repository, "config", "user.name", "Test");
  await git(repository, "config", "user.email", "test@example.com");
  await git(repository, "config", "commit.gpgsign", "false");
  await Promise.all([
    mkdir(join(repository, ".changeset"), { recursive: true }),
    mkdir(join(repository, ".github/release"), { recursive: true }),
    mkdir(join(repository, "packages/a"), { recursive: true }),
    mkdir(join(repository, "packages/b"), { recursive: true }),
  ]);
  await Promise.all([
    json(join(repository, "package.json"), {
      name: "root",
      private: true,
      workspaces: ["packages/*"],
    }),
    json(join(repository, "packages/a/package.json"), { name: "@seed/a", version: "1.2.3" }),
    json(join(repository, "packages/b/package.json"), {
      name: "@seed/b",
      version: "4.5.6",
      private: true,
    }),
    json(join(repository, ".changeset/config.json"), {
      access: "public",
      baseBranch: "dev",
      privatePackages: { version: false, tag: false },
    }),
    json(join(repository, ".github/release/control.json"), control),
    json(join(repository, ".github/release/lanes.json"), laneConfig),
  ]);
  await git(repository, "add", ".");
  await git(repository, "commit", "-m", "baseline");
  const baseline = await git(repository, "rev-parse", "HEAD");
  await git(repository, "update-ref", "refs/remotes/origin/dev", baseline);
  await git(repository, "update-ref", "refs/remotes/origin/minor", baseline);
  await git(repository, "update-ref", "refs/remotes/origin/major", baseline);
  return { repository, baseline };
}

async function createBootstrapCommit(
  repository: string,
  baseline: string,
  lane: BootstrapLane,
  options: { wrongVersion?: boolean; extraFile?: boolean; intermediateCommit?: boolean } = {},
): Promise<string> {
  await git(repository, "switch", "--detach", baseline);
  if (options.intermediateCommit) {
    await git(repository, "commit", "--allow-empty", "-m", "intermediate");
  }
  await json(join(repository, ".changeset/config.json"), {
    access: "public",
    baseBranch: lane,
    privatePackages: { version: false, tag: false },
  });
  await json(join(repository, ".changeset/pre.json"), {
    mode: "pre",
    tag: "beta",
    initialVersions: {
      "@seed/a": options.wrongVersion ? "9.9.9" : "1.2.3",
      "@seed/b": "4.5.6",
    },
    changesets: [],
  });
  if (options.extraFile) await writeFile(join(repository, "unexpected.txt"), "unexpected\n");
  await git(repository, "add", ".");
  await git(repository, "commit", "-m", `bootstrap ${lane}`);
  return git(repository, "rev-parse", "HEAD");
}

function marker(lane: BootstrapLane, baseline: string, head: string): ReleaseMarker {
  return {
    schemaVersion: 1,
    type: "bootstrap",
    lane,
    targetLane: lane,
    tag: "beta",
    expectedHeadSha: head,
    controlSha: baseline,
  };
}

describe("fresh release lane bootstrap policy", () => {
  test("exact dev child의 config/pre와 workspace initialVersions를 허용한다", async () => {
    const { repository, baseline } = await baselineRepository();
    const head = await createBootstrapCommit(repository, baseline, "minor");

    await expect(
      verifyBootstrapPull({
        repositoryPath: repository,
        marker: marker("minor", baseline, head),
        lane: "minor",
        baseSha: baseline,
        headSha: head,
      }),
    ).resolves.toBeUndefined();
  });

  test("baseline package version과 다른 initialVersions를 거부한다", async () => {
    const { repository, baseline } = await baselineRepository();
    const head = await createBootstrapCommit(repository, baseline, "minor", {
      wrongVersion: true,
    });

    await expect(
      verifyBootstrapPull({
        repositoryPath: repository,
        marker: marker("minor", baseline, head),
        lane: "minor",
        baseSha: baseline,
        headSha: head,
      }),
    ).rejects.toThrow("initialVersions");
  });

  test("PR 생성 뒤 dev가 전진하면 stale bootstrap merge를 거부한다", async () => {
    const { repository, baseline } = await baselineRepository();
    const head = await createBootstrapCommit(repository, baseline, "minor");
    await git(repository, "switch", "--detach", baseline);
    await git(repository, "commit", "--allow-empty", "-m", "advance dev");
    await git(repository, "update-ref", "refs/remotes/origin/dev", "HEAD");

    await expect(
      verifyBootstrapPull({
        repositoryPath: repository,
        marker: marker("minor", baseline, head),
        lane: "minor",
        baseSha: baseline,
        headSha: head,
      }),
    ).rejects.toThrow("current origin/dev exact SHA");
  });

  test("추가 파일과 multi-commit head를 거부한다", async () => {
    const first = await baselineRepository();
    const extraHead = await createBootstrapCommit(first.repository, first.baseline, "minor", {
      extraFile: true,
    });
    await expect(
      verifyBootstrapPull({
        repositoryPath: first.repository,
        marker: marker("minor", first.baseline, extraHead),
        lane: "minor",
        baseSha: first.baseline,
        headSha: extraHead,
      }),
    ).rejects.toThrow("만 변경");

    const second = await baselineRepository();
    const multiHead = await createBootstrapCommit(second.repository, second.baseline, "major", {
      intermediateCommit: true,
    });
    await expect(
      verifyBootstrapPull({
        repositoryPath: second.repository,
        marker: marker("major", second.baseline, multiHead),
        lane: "major",
        baseSha: second.baseline,
        headSha: multiHead,
      }),
    ).rejects.toThrow("단일 commit");
  });

  test("두 lane이 current dev와 state 파일만 다르면 enable-sync 준비가 완료된다", async () => {
    const { repository, baseline } = await baselineRepository();
    const minor = await createBootstrapCommit(repository, baseline, "minor");
    const major = await createBootstrapCommit(repository, baseline, "major");
    await git(repository, "update-ref", "refs/remotes/origin/minor", minor);
    await git(repository, "update-ref", "refs/remotes/origin/major", major);

    await expect(verifyBootstrapReadiness(repository)).resolves.toEqual({
      devSha: baseline,
      lanes: { minor, major },
    });
  });

  test("bootstrap 뒤 dev가 앞서가면 enable-sync를 거부한다", async () => {
    const { repository, baseline } = await baselineRepository();
    const minor = await createBootstrapCommit(repository, baseline, "minor");
    const major = await createBootstrapCommit(repository, baseline, "major");
    await git(repository, "update-ref", "refs/remotes/origin/minor", minor);
    await git(repository, "update-ref", "refs/remotes/origin/major", major);
    await git(repository, "switch", "--detach", baseline);
    await writeFile(join(repository, "dev-change.txt"), "new dev change\n");
    await git(repository, "add", "dev-change.txt");
    await git(repository, "commit", "-m", "advance dev");
    await git(repository, "update-ref", "refs/remotes/origin/dev", "HEAD");

    await expect(verifyBootstrapReadiness(repository)).rejects.toThrow("catch-up");
  });

  test("control plane이 준비된 sync-inactive dry-run 상태만 허용한다", () => {
    expect(() => assertBootstrapControlState(control, laneConfig)).not.toThrow();
    expect(() =>
      assertBootstrapControlState({ ...control, mode: "production" }, laneConfig),
    ).toThrow("dry-run");
    expect(() =>
      assertBootstrapControlState(control, {
        ...laneConfig,
        sync: { ...laneConfig.sync, activation: "2026-08-09T00:00:00.000Z" },
      }),
    ).toThrow("sync 비활성");
  });
});
