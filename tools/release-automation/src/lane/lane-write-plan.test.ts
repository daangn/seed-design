import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  assertLaneWritePlanIdentity,
  assertReservedBranchPullState,
  createDeterministicPlanCommit,
  isAllowedVersionPlanPath,
  isExactWorkspaceDependencyUpdate,
  isExactRootageGeneratedIndexUpdate,
  isExactRootageGeneratedTypesUpdate,
  type LaneWritePlan,
  parseLaneWritePlan,
  parseDeferredValidation,
  parseJsonWithTrailingCommas,
  trustedReleaseRefspecs,
  verifyGeneratedLaneWritePlan,
  verifyLaneWritePlanTree,
} from "./lane-write-plan";
import type { GitHubPullRequest } from "../core/github";
import { encodeMarker } from "../core/marker";
import type { LaneConfig, LaneName, ReleaseControl, ReleaseMarker } from "../core/types";
import {
  applyCapturedChangesetsVersionPolicy,
  captureChangesetsVersionPolicy,
  runChangesetsVersion,
} from "./trusted-changesets-version";

const temporaryDirectories: string[] = [];
const repositoryRoot = join(import.meta.dir, "..", "..", "..", "..");
const changesetsCliPath = join(repositoryRoot, "node_modules", "@changesets", "cli", "bin.js");

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

async function repositoryFixture(): Promise<{ repository: string; baseline: string }> {
  const repository = await mkdtemp(join(tmpdir(), "seed-lane-write-plan-"));
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
    mkdir(join(repository, "packages/rootage/__generated__"), { recursive: true }),
  ]);
  await Promise.all([
    json(join(repository, "package.json"), {
      name: "root",
      version: "0.0.0",
      private: true,
      workspaces: ["packages/*"],
    }),
    json(join(repository, "packages/a/package.json"), {
      name: "@seed/a",
      version: "1.0.0",
      scripts: { test: "echo safe" },
    }),
    json(join(repository, "packages/b/package.json"), {
      name: "@seed/b",
      version: "1.0.0",
      dependencies: { "@seed/a": "1.0.0", "left-pad": "1.3.0" },
    }),
    json(join(repository, "packages/rootage/package.json"), {
      name: "@seed-design/rootage-artifacts",
      version: "2.4.0",
    }),
    json(join(repository, "packages/rootage/__generated__/index.json"), {
      name: "Rootage",
      version: "2.4.0",
      resources: [{ path: "/color.json" }],
    }),
    writeFile(
      join(repository, "packages/rootage/__generated__/index.d.ts"),
      'declare const artifact: {\n  "name": "Rootage";\n  "version": "2.4.0";\n};\nexport default artifact;\n',
    ),
    json(join(repository, "bun.lock"), {
      lockfileVersion: 1,
      configVersion: 0,
      workspaces: {
        "": { name: "root" },
        "packages/a": { name: "@seed/a", version: "1.0.0" },
        "packages/b": {
          name: "@seed/b",
          version: "1.0.0",
          dependencies: { "@seed/a": "1.0.0", "left-pad": "1.3.0" },
        },
        "packages/rootage": {
          name: "@seed-design/rootage-artifacts",
          version: "2.4.0",
        },
      },
      packages: { "left-pad": ["left-pad@1.3.0"] },
    }),
    json(join(repository, ".changeset/config.json"), {
      changelog: false,
      commit: false,
      fixed: [],
      linked: [],
      access: "public",
      baseBranch: "minor",
      updateInternalDependencies: "patch",
      privatePackages: { version: false, tag: false },
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        onlyUpdatePeerDependentsWhenOutOfRange: true,
      },
    }),
    json(join(repository, ".github/release/control.json"), control),
    json(join(repository, ".github/release/lanes.json"), laneConfig),
  ]);
  await git(repository, "add", ".");
  await git(repository, "commit", "-m", "baseline");
  const baseline = await git(repository, "rev-parse", "HEAD");
  await git(repository, "update-ref", "refs/remotes/origin/dev", baseline);
  await git(repository, "update-ref", "refs/remotes/origin/minor", baseline);
  return { repository, baseline };
}

async function planFor(
  repository: string,
  baseline: string,
  head: string,
  lane: LaneName,
): Promise<LaneWritePlan> {
  const filesOutput = await git(repository, "diff", "--name-only", baseline, head, "--");
  return {
    schemaVersion: 1,
    kind: "version",
    lane,
    baseSha: baseline,
    controlSha: baseline,
    treeSha: await git(repository, "rev-parse", `${head}^{tree}`),
    patchSha256: "a".repeat(64),
    files: filesOutput ? filesOutput.split("\n").sort() : [],
  };
}

function markerFor(plan: LaneWritePlan, headSha: string): ReleaseMarker {
  return {
    schemaVersion: 1,
    type: "version",
    lane: plan.lane,
    expectedHeadSha: headSha,
    controlSha: plan.controlSha,
  };
}

async function versionFixture(
  attack:
    | "none"
    | "script"
    | "external-dependency"
    | "workflow"
    | "lockfile"
    | "lane-bump"
    | "generated-code"
    | "bun-preload"
    | "rootage-missing"
    | "version" = "none",
): Promise<{ repository: string; plan: LaneWritePlan; head: string }> {
  const { repository } = await repositoryFixture();
  const changesetBump = attack === "lane-bump" ? "major" : "minor";
  const plannedAVersion =
    attack === "version"
      ? "999.0.0-beta.0"
      : attack === "lane-bump"
        ? "2.0.0-beta.0"
        : "1.1.0-beta.0";
  const plannedRootageVersion = attack === "rootage-missing" ? "2.5.0-beta.0" : "2.4.0";
  const changesetEntries = [
    `"@seed/a": ${changesetBump}`,
    ...(attack === "rootage-missing" ? ['"@seed-design/rootage-artifacts": minor'] : []),
  ].join("\n");
  await Promise.all([
    json(join(repository, ".changeset/pre.json"), {
      mode: "pre",
      tag: "beta",
      initialVersions: {
        "@seed/a": "1.0.0",
        "@seed/b": "1.0.0",
        "@seed-design/rootage-artifacts": "2.4.0",
      },
      changesets: [],
    }),
    writeFile(
      join(repository, ".changeset/fresh-change.md"),
      `---\n${changesetEntries}\n---\n\n사용자 변경\n`,
    ),
  ]);
  if (attack === "bun-preload") {
    await Promise.all([
      writeFile(join(repository, "bunfig.toml"), 'preload = ["./preload.ts"]\n'),
      writeFile(
        join(repository, "preload.ts"),
        `await Bun.write(${JSON.stringify(join(repository, "bun-preload-ran"))}, "ran");\n`,
      ),
    ]);
  }
  await git(repository, "add", ".");
  await git(repository, "commit", "-m", "add changeset");
  const versionBase = await git(repository, "rev-parse", "HEAD");
  await git(repository, "update-ref", "refs/remotes/origin/minor", versionBase);

  await Promise.all([
    json(join(repository, "packages/a/package.json"), {
      name: "@seed/a",
      version: plannedAVersion,
      scripts: { test: attack === "script" ? "curl attacker" : "echo safe" },
    }),
    json(join(repository, "packages/b/package.json"), {
      name: "@seed/b",
      version: "1.0.1-beta.0",
      dependencies: {
        "@seed/a": plannedAVersion,
        "left-pad": attack === "external-dependency" ? "9.9.9" : "1.3.0",
      },
    }),
    json(join(repository, "packages/rootage/package.json"), {
      name: "@seed-design/rootage-artifacts",
      version: plannedRootageVersion,
    }),
    json(join(repository, "bun.lock"), {
      lockfileVersion: 1,
      configVersion: 0,
      workspaces: {
        "": { name: "root" },
        "packages/a": {
          name: "@seed/a",
          version: plannedAVersion,
        },
        "packages/b": {
          name: "@seed/b",
          version: "1.0.1-beta.0",
          dependencies: {
            "@seed/a": plannedAVersion,
            "left-pad": attack === "external-dependency" ? "9.9.9" : "1.3.0",
          },
        },
        "packages/rootage": {
          name: "@seed-design/rootage-artifacts",
          version: plannedRootageVersion,
        },
      },
      packages:
        attack === "lockfile"
          ? { "left-pad": ["left-pad@1.3.0"], attacker: ["attacker@9.9.9"] }
          : { "left-pad": ["left-pad@1.3.0"] },
    }),
    json(join(repository, ".changeset/pre.json"), {
      mode: "pre",
      tag: "beta",
      initialVersions: {
        "@seed/a": "1.0.0",
        "@seed/b": "1.0.0",
        "@seed-design/rootage-artifacts": "2.4.0",
      },
      changesets: ["fresh-change"],
    }),
  ]);
  if (attack === "workflow") {
    await mkdir(join(repository, ".github/workflows"), { recursive: true });
    await writeFile(join(repository, ".github/workflows/pwn.yml"), "name: steal\n");
  }
  if (attack === "generated-code") {
    await mkdir(join(repository, "packages/rootage/__generated__"), { recursive: true });
    await writeFile(
      join(repository, "packages/rootage/__generated__/pwn.mjs"),
      "export default stealToken();\n",
    );
  }
  await git(repository, "add", "-A");
  await git(repository, "commit", "-m", "version packages");
  const head = await git(repository, "rev-parse", "HEAD");
  return {
    repository,
    head,
    plan: await planFor(repository, versionBase, head, "minor"),
  };
}

async function webPeerVersionFixture(
  tamper: "none" | "upstream-major" | "format" = "none",
): Promise<{ repository: string; plan: LaneWritePlan; head: string }> {
  const { repository } = await repositoryFixture();
  await Promise.all([
    mkdir(join(repository, "packages/css"), { recursive: true }),
    mkdir(join(repository, "packages/react"), { recursive: true }),
  ]);
  const baseLock = parseJsonWithTrailingCommas(
    await readFile(join(repository, "bun.lock"), "utf8"),
    "fixture bun.lock",
  ) as { workspaces: Record<string, unknown> };
  baseLock.workspaces["packages/css"] = {
    name: "@seed-design/css",
    version: "2.4.2",
  };
  baseLock.workspaces["packages/react"] = {
    name: "@seed-design/react",
    version: "2.2.2",
    peerDependencies: { "@seed-design/css": "^2.4.0" },
    devDependencies: { "@seed-design/css": "^2.4.0" },
  };
  await Promise.all([
    json(join(repository, "packages/css/package.json"), {
      name: "@seed-design/css",
      version: "2.4.2",
    }),
    json(join(repository, "packages/react/package.json"), {
      name: "@seed-design/react",
      version: "2.2.2",
      peerDependencies: { "@seed-design/css": "^2.4.0" },
      devDependencies: { "@seed-design/css": "^2.4.0" },
    }),
    json(join(repository, "bun.lock"), baseLock),
    json(join(repository, ".changeset/pre.json"), {
      mode: "pre",
      tag: "beta",
      initialVersions: {
        "@seed-design/css": "2.4.2",
        "@seed-design/react": "2.2.2",
      },
      changesets: [],
    }),
    writeFile(
      join(repository, ".changeset/css-change.md"),
      '---\n"@seed-design/css": minor\n---\n\nCSS 기능 추가\n',
    ),
  ]);
  await git(repository, "add", ".");
  await git(repository, "commit", "-m", "web peer changeset");
  const versionBase = await git(repository, "rev-parse", "HEAD");
  await git(repository, "update-ref", "refs/heads/minor", versionBase);
  await git(repository, "update-ref", "refs/remotes/origin/minor", versionBase);

  const captured = await captureChangesetsVersionPolicy(repository, changesetsCliPath);
  await runChangesetsVersion(repository, changesetsCliPath);
  await applyCapturedChangesetsVersionPolicy(repository, captured);
  const css = JSON.parse(await readFile(join(repository, "packages/css/package.json"), "utf8"));
  const reactPath = join(repository, "packages/react/package.json");
  const react = JSON.parse(await readFile(reactPath, "utf8"));
  if (tamper === "upstream-major") react.version = "3.0.0-beta.0";
  await json(reactPath, react);
  const plannedLock = structuredClone(baseLock);
  plannedLock.workspaces["packages/css"] = {
    name: "@seed-design/css",
    version: css.version,
  };
  plannedLock.workspaces["packages/react"] = {
    name: "@seed-design/react",
    version: react.version,
    peerDependencies: react.peerDependencies,
    devDependencies: react.devDependencies,
  };
  await json(join(repository, "bun.lock"), plannedLock);
  if (tamper === "format") {
    await writeFile(reactPath, `${await readFile(reactPath, "utf8")}\n`);
  }
  await git(repository, "add", "-A");
  await git(repository, "commit", "-m", "version web peer packages");
  const head = await git(repository, "rev-parse", "HEAD");
  return {
    repository,
    head,
    plan: await planFor(repository, versionBase, head, "minor"),
  };
}

describe("lane read-plan / trusted-write artifact", () => {
  test("ordinary Version writer는 기본 dispatch를 유지하고 stable binder만 명시적으로 defer한다", () => {
    expect(parseDeferredValidation(undefined)).toBe(false);
    expect(parseDeferredValidation("false")).toBe(false);
    expect(parseDeferredValidation("true")).toBe(true);
    expect(() => parseDeferredValidation("1")).toThrow("true/false");
  });

  test("strict schema와 안전한 version output 경로만 허용한다", () => {
    const plan = parseLaneWritePlan({
      schemaVersion: 1,
      kind: "version",
      lane: "minor",
      baseSha: "a".repeat(40),
      controlSha: "b".repeat(40),
      treeSha: "c".repeat(40),
      patchSha256: "d".repeat(64),
      files: ["packages/a/package.json"],
    });
    expect(plan.lane).toBe("minor");
    expect(isAllowedVersionPlanPath("packages/a/CHANGELOG.md")).toBe(true);
    expect(isAllowedVersionPlanPath("packages/rootage/__generated__/index.json")).toBe(true);
    expect(isAllowedVersionPlanPath("packages/rootage/__generated__/index.d.ts")).toBe(true);
    expect(isAllowedVersionPlanPath("packages/rootage/__generated__/pwn.mjs")).toBe(false);
    expect(isAllowedVersionPlanPath("docs/public/rootage/index.json")).toBe(false);
    expect(isAllowedVersionPlanPath("docs/content/react/updates/changelog.mdx")).toBe(false);
    expect(isAllowedVersionPlanPath("tools/unrelated/pwn.ts")).toBe(false);
    expect(() => parseLaneWritePlan({ ...plan, files: ["z", "a"] })).toThrow("정렬");
    expect(() => parseLaneWritePlan({ ...plan, unexpected: true })).toThrow("key");
    expect(() =>
      assertLaneWritePlanIdentity(plan, {
        kind: "version",
        lane: "minor",
        baseSha: plan.baseSha,
        controlSha: plan.controlSha,
      }),
    ).not.toThrow();
    expect(() =>
      assertLaneWritePlanIdentity(plan, {
        kind: "version",
        lane: "major",
        baseSha: plan.baseSha,
        controlSha: plan.controlSha,
      }),
    ).toThrow("trusted workflow selection");
    expect(trustedReleaseRefspecs("dev")).toEqual(["+refs/heads/dev:refs/remotes/origin/dev"]);
  });

  test("실제 Bun text lockfile의 trailing comma만 안전하게 허용한다", async () => {
    const parsed = parseJsonWithTrailingCommas(await readFile("bun.lock", "utf8"), "bun.lock");
    expect(parsed).toHaveProperty("workspaces");
    expect(parseJsonWithTrailingCommas('{"value": "comma,}",}', "fixture")).toEqual({
      value: "comma,}",
    });
    expect(() => parseJsonWithTrailingCommas('{"value": 1 // comment\n}', "fixture")).toThrow(
      "trailing comma 외",
    );
  });

  test("Changesets baseline과 internal peer/dev canonical range를 구분한다", () => {
    expect(isExactWorkspaceDependencyUpdate("^2.0.0", "^3.0.0", "3.0.0")).toBe(true);
    expect(isExactWorkspaceDependencyUpdate("workspace:~2.0.0", "workspace:~3.0.0", "3.0.0")).toBe(
      true,
    );
    expect(isExactWorkspaceDependencyUpdate("<2.0.0", "3.0.0", "3.0.0")).toBe(true);
    expect(isExactWorkspaceDependencyUpdate("=2.0.0", "3.0.0", "3.0.0")).toBe(true);
    expect(isExactWorkspaceDependencyUpdate("0.0.0 || >=0.1.0 <1.0.0", "3.0.0", "3.0.0")).toBe(
      true,
    );
    expect(isExactWorkspaceDependencyUpdate("^2.0.0", "~3.0.0", "3.0.0")).toBe(false);
    expect(isExactWorkspaceDependencyUpdate("workspace:^", "workspace:^", "3.0.0")).toBe(true);
    expect(isExactWorkspaceDependencyUpdate("link:../a", "3.0.0", "3.0.0")).toBe(false);
    expect(
      isExactWorkspaceDependencyUpdate(
        "^2.4.0",
        "2.5.0-beta.0",
        "2.5.0-beta.0",
        "peerDependencies",
      ),
    ).toBe(true);
    expect(
      isExactWorkspaceDependencyUpdate("2.5.0-beta.1", "^2.5.0", "2.5.0", "peerDependencies"),
    ).toBe(true);
    expect(
      isExactWorkspaceDependencyUpdate("2.5.0-beta.1", "2.5.0", "2.5.0", "devDependencies"),
    ).toBe(true);
    expect(
      isExactWorkspaceDependencyUpdate(
        "^2.4.0",
        "^2.5.0-beta.0",
        "2.5.0-beta.0",
        "peerDependencies",
      ),
    ).toBe(false);
  });

  test("Rootage generated index는 package version literal만 exact하게 바꾼다", () => {
    const base = { name: "Rootage", version: "2.4.0", resources: [{ path: "/color.json" }] };
    expect(
      isExactRootageGeneratedIndexUpdate(base, { ...base, version: "2.5.0" }, "2.4.0", "2.5.0"),
    ).toBe(true);
    expect(
      isExactRootageGeneratedIndexUpdate(
        base,
        { ...base, version: "2.5.0", injected: true },
        "2.4.0",
        "2.5.0",
      ),
    ).toBe(false);
    const baseTypes = 'declare const artifact: {\n  "version": "2.4.0";\n};\n';
    expect(
      isExactRootageGeneratedTypesUpdate(
        baseTypes,
        baseTypes.replace('"2.4.0"', '"2.5.0"'),
        "2.4.0",
        "2.5.0",
      ),
    ).toBe(true);
    expect(
      isExactRootageGeneratedTypesUpdate(
        baseTypes,
        `${baseTypes.replace('"2.4.0"', '"2.5.0"')}stealToken();\n`,
        "2.4.0",
        "2.5.0",
      ),
    ).toBe(false);
  });

  test("같은 plan은 retry에도 같은 direct-child commit을 만든다", async () => {
    const { repository, plan } = await versionFixture();
    const first = await createDeterministicPlanCommit(repository, plan);
    const second = await createDeterministicPlanCommit(repository, plan);
    expect(second).toBe(first);
    expect((await git(repository, "rev-list", "--parents", "-n", "1", first)).split(" ")[1]).toBe(
      plan.baseSha,
    );
    expect(
      assertReservedBranchPullState(
        plan,
        "changeset-release/minor",
        first,
        [],
        "daangn/seed-design",
        first,
        false,
      ),
    ).toBeNull();
  });

  test("version package 증가와 같은-plan workspace dependency만 허용한다", async () => {
    const valid = await versionFixture();
    const releases = await verifyGeneratedLaneWritePlan(
      valid.repository,
      markerFor(valid.plan, valid.head),
      valid.plan.baseSha,
      valid.head,
    );
    expect(releases).toEqual([
      { name: "@seed/a", from: "1.0.0", to: "1.1.0-beta.0" },
      { name: "@seed/b", from: "1.0.0", to: "1.0.1-beta.0" },
    ]);

    const inflated = await versionFixture("version");
    await expect(
      verifyGeneratedLaneWritePlan(
        inflated.repository,
        markerFor(inflated.plan, inflated.head),
        inflated.plan.baseSha,
        inflated.head,
      ),
    ).rejects.toThrow("trusted Changesets exact release plan");
  });

  test("trusted replay가 Web auto peer-major policy output을 exact 검증한다", async () => {
    const valid = await webPeerVersionFixture();
    await expect(
      verifyGeneratedLaneWritePlan(
        valid.repository,
        markerFor(valid.plan, valid.head),
        valid.plan.baseSha,
        valid.head,
      ),
    ).resolves.toEqual([
      { name: "@seed-design/css", from: "2.4.2", to: "2.5.0-beta.0" },
      { name: "@seed-design/react", from: "2.2.2", to: "2.2.3-beta.0" },
    ]);

    const upstreamMajor = await webPeerVersionFixture("upstream-major");
    await expect(
      verifyGeneratedLaneWritePlan(
        upstreamMajor.repository,
        markerFor(upstreamMajor.plan, upstreamMajor.head),
        upstreamMajor.plan.baseSha,
        upstreamMajor.head,
      ),
    ).rejects.toThrow("trusted Changesets exact release plan");

    const formattingSpoof = await webPeerVersionFixture("format");
    await expect(
      verifyGeneratedLaneWritePlan(
        formattingSpoof.repository,
        markerFor(formattingSpoof.plan, formattingSpoof.head),
        formattingSpoof.plan.baseSha,
        formattingSpoof.head,
      ),
    ).rejects.toThrow("trusted Changesets version output");
  }, 30_000);

  test("trusted Changesets replay가 lane direct bump를 exact 정책에 결속한다", async () => {
    const wrongLaneBump = await versionFixture("lane-bump");
    await expect(
      verifyGeneratedLaneWritePlan(
        wrongLaneBump.repository,
        markerFor(wrongLaneBump.plan, wrongLaneBump.head),
        wrongLaneBump.plan.baseSha,
        wrongLaneBump.head,
      ),
    ).rejects.toThrow("minor 정책 minor와 다릅니다");
  });

  test("trusted Changesets replay는 lane bunfig preload를 실행하지 않는다", async () => {
    const preload = await versionFixture("bun-preload");
    await expect(
      verifyGeneratedLaneWritePlan(
        preload.repository,
        markerFor(preload.plan, preload.head),
        preload.plan.baseSha,
        preload.head,
      ),
    ).resolves.toHaveLength(2);
    expect(await Bun.file(join(preload.repository, "bun-preload-ran")).exists()).toBe(false);
  });

  test(
    "version lifecycle의 scripts, 외부 dependency, workflow 주입을 거부한다",
    async () => {
      const script = await versionFixture("script");
      await expect(
        verifyLaneWritePlanTree(script.repository, script.plan, script.head),
      ).rejects.toThrow("non-version fields");

      const dependency = await versionFixture("external-dependency");
      await expect(
        verifyLaneWritePlanTree(dependency.repository, dependency.plan, dependency.head),
      ).rejects.toThrow("workspace version 증가");

      const workflow = await versionFixture("workflow");
      await expect(
        verifyLaneWritePlanTree(workflow.repository, workflow.plan, workflow.head),
      ).rejects.toThrow("실행 가능한/보호 경로");

      const generatedCode = await versionFixture("generated-code");
      await expect(
        verifyLaneWritePlanTree(generatedCode.repository, generatedCode.plan, generatedCode.head),
      ).rejects.toThrow("실행 가능한/보호 경로");

      const lockfile = await versionFixture("lockfile");
      await expect(
        verifyLaneWritePlanTree(lockfile.repository, lockfile.plan, lockfile.head),
      ).rejects.toThrow("bun.lock workspace-only reconstruction");

      const missingRootageGeneratedData = await versionFixture("rootage-missing");
      await expect(
        verifyLaneWritePlanTree(
          missingRootageGeneratedData.repository,
          missingRootageGeneratedData.plan,
          missingRootageGeneratedData.head,
        ),
      ).rejects.toThrow("Rootage version generated files");
    },
    { timeout: 30_000 },
  );

  test("reserved Version branch는 exact bot PR identity 없이는 갱신하지 않는다", async () => {
    const { plan, head } = await versionFixture();
    const repository = "daangn/seed-design";
    const branch = "changeset-release/minor";
    const marker = encodeMarker({
      schemaVersion: 1,
      type: "version",
      lane: "minor",
      expectedHeadSha: head,
      controlSha: plan.controlSha,
    });
    const pull: GitHubPullRequest = {
      number: 7,
      body: marker,
      draft: false,
      merged_at: null,
      merge_commit_sha: null,
      created_at: "2026-08-09T00:00:00.000Z",
      user: { login: "github-actions[bot]" },
      base: { ref: "minor", sha: plan.baseSha, repo: { full_name: repository } },
      head: { ref: branch, sha: head, repo: { full_name: repository } },
    };
    expect(assertReservedBranchPullState(plan, branch, head, [pull], repository, head, false)).toBe(
      7,
    );
    expect(
      assertReservedBranchPullState(
        plan,
        branch,
        head,
        [{ ...pull, body: "stale marker after deterministic push" }],
        repository,
        head,
        false,
      ),
    ).toBe(7);
    expect(
      assertReservedBranchPullState(plan, branch, head, [], repository, head, false),
    ).toBeNull();
    expect(() =>
      assertReservedBranchPullState(plan, branch, "f".repeat(40), [], repository, head, false),
    ).toThrow("안전한 retry");
    expect(() =>
      assertReservedBranchPullState(
        plan,
        branch,
        head,
        [{ ...pull, user: { login: "maintainer" } }],
        repository,
        head,
        false,
      ),
    ).toThrow("identity/head");
    expect(() =>
      assertReservedBranchPullState(
        plan,
        branch,
        "f".repeat(40),
        [
          {
            ...pull,
            body: "stale marker",
            head: { ...pull.head, sha: "f".repeat(40) },
          },
        ],
        repository,
        head,
        false,
      ),
    ).toThrow("identity/head");
    expect(() =>
      assertReservedBranchPullState(
        plan,
        branch,
        head,
        [
          {
            ...pull,
            head: { ...pull.head, repo: { full_name: "attacker/fork" } },
          },
        ],
        repository,
        head,
        false,
      ),
    ).toThrow("repository identity");
    expect(
      assertReservedBranchPullState(plan, branch, plan.baseSha, [], repository, head, true),
    ).toBeNull();
    expect(
      assertReservedBranchPullState(plan, branch, null, [], repository, head, false),
    ).toBeNull();
  });
});
