import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

async function readJson(path: string): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(path, "utf8"));
}

async function changesetsFixture(): Promise<string> {
  const repository = await mkdtemp(join(tmpdir(), "seed-changesets-version-"));
  temporaryDirectories.push(repository);
  await git(repository, "init");
  await git(repository, "branch", "-M", "minor");
  await git(repository, "config", "user.name", "Test");
  await git(repository, "config", "user.email", "test@example.com");
  await git(repository, "config", "commit.gpgsign", "false");
  await Promise.all([
    writeFile(join(repository, ".gitignore"), "node_modules\n"),
    mkdir(join(repository, ".changeset"), { recursive: true }),
    mkdir(join(repository, "packages/css"), { recursive: true }),
    mkdir(join(repository, "packages/react"), { recursive: true }),
    mkdir(join(repository, "packages/tool"), { recursive: true }),
  ]);
  await Promise.all([
    json(join(repository, "package.json"), {
      name: "fixture",
      version: "0.0.0",
      private: true,
      workspaces: ["packages/*"],
    }),
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
    json(join(repository, "packages/tool/package.json"), {
      name: "@seed-design/tool",
      version: "1.0.0",
    }),
    json(join(repository, ".changeset/config.json"), {
      changelog: "@changesets/cli/changelog",
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
    json(join(repository, ".changeset/pre.json"), {
      mode: "pre",
      tag: "beta",
      initialVersions: {
        "@seed-design/css": "2.4.2",
        "@seed-design/react": "2.2.2",
      },
      changesets: ["prior-change"],
    }),
    writeFile(
      join(repository, ".changeset/fresh-change.md"),
      '---\n"@seed-design/css": minor\n---\n\nCSS 기능 추가\n',
    ),
    writeFile(
      join(repository, ".changeset/prior-change.md"),
      '---\n"@seed-design/react": patch\n---\n\n이미 반영한 변경\n',
    ),
    writeFile(join(repository, "packages/css/CHANGELOG.md"), "# @seed-design/css\n"),
    writeFile(join(repository, "packages/react/CHANGELOG.md"), "# @seed-design/react\n"),
  ]);
  await git(repository, "add", ".");
  await git(repository, "commit", "-m", "active pre fixture");
  await symlink(join(repositoryRoot, "node_modules"), join(repository, "node_modules"), "dir");
  return repository;
}

async function applyActivePrePolicy(repository: string): Promise<void> {
  const captured = await captureChangesetsVersionPolicy(repository, changesetsCliPath);
  await runChangesetsVersion(repository, changesetsCliPath);
  await applyCapturedChangesetsVersionPolicy(repository, captured);
}

describe("trusted Changesets version replay", () => {
  test("auto peer-major provenance를 설치된 Changesets 2.29.7에 결속한다", async () => {
    expect(
      (await readJson(join(repositoryRoot, "node_modules/@changesets/cli/package.json"))).version,
    ).toBe("2.29.7");
  });

  test("설치된 CLI active-pre는 Changeset 원문을 보존하고 처리 ID를 기록한다", async () => {
    const repository = await changesetsFixture();
    await git(repository, "checkout", "--detach");
    const configPath = join(repository, ".changeset/config.json");
    const configBefore = await readFile(configPath, "utf8");
    const captured = await captureChangesetsVersionPolicy(repository, changesetsCliPath, "HEAD");
    expect(await readFile(configPath, "utf8")).toBe(configBefore);
    await runChangesetsVersion(repository, changesetsCliPath);

    expect(await Bun.file(join(repository, ".changeset/fresh-change.md")).exists()).toBe(true);
    const preState = await readJson(join(repository, ".changeset/pre.json"));
    expect((preState.changesets as string[]).sort()).toEqual(["fresh-change", "prior-change"]);
    expect(preState.initialVersions).toHaveProperty("@seed-design/tool", "1.0.0");
    expect((await readJson(join(repository, "packages/css/package.json"))).version).toBe(
      "2.5.0-beta.0",
    );
    expect((await readJson(join(repository, "packages/react/package.json"))).version).toBe(
      "3.0.0-beta.0",
    );
    expect(
      captured.releasePlan.releases.find((release) => release.name.endsWith("/react"))?.type,
    ).toBe("major");
  });

  test("active-pre raw auto peer-major를 policy output으로 원자적으로 교정한다", async () => {
    const repository = await changesetsFixture();
    await applyActivePrePolicy(repository);
    const react = await readJson(join(repository, "packages/react/package.json"));
    expect(react.version).toBe("2.2.3-beta.0");
    expect(react.peerDependencies).toEqual({ "@seed-design/css": "2.5.0-beta.0" });
    expect(react.devDependencies).toEqual({ "@seed-design/css": "2.5.0-beta.0" });
    expect(await readFile(join(repository, "packages/react/CHANGELOG.md"), "utf8")).toContain(
      "## 2.2.3-beta.0",
    );
  });

  test("설치된 CLI exit는 retained Changeset과 pre state를 삭제하고 policy core로 마무리한다", async () => {
    const repository = await changesetsFixture();
    await applyActivePrePolicy(repository);
    await git(repository, "add", ".");
    await git(repository, "commit", "-m", "first beta");
    const preState = await readJson(join(repository, ".changeset/pre.json"));
    preState.mode = "exit";
    await json(join(repository, ".changeset/pre.json"), preState);
    await git(repository, "add", ".changeset/pre.json");
    await git(repository, "commit", "-m", "exit pre mode");

    const captured = await captureChangesetsVersionPolicy(repository, changesetsCliPath);
    await runChangesetsVersion(repository, changesetsCliPath);
    await applyCapturedChangesetsVersionPolicy(repository, captured);

    expect(await Bun.file(join(repository, ".changeset/pre.json")).exists()).toBe(false);
    expect(await Bun.file(join(repository, ".changeset/fresh-change.md")).exists()).toBe(false);
    expect(await Bun.file(join(repository, ".changeset/prior-change.md")).exists()).toBe(false);
    expect((await readJson(join(repository, "packages/css/package.json"))).version).toBe("2.5.0");
    const react = await readJson(join(repository, "packages/react/package.json"));
    expect(react.version).toBe("2.2.3");
    expect(react.peerDependencies).toEqual({ "@seed-design/css": "^2.5.0" });
    expect(react.devDependencies).toEqual({ "@seed-design/css": "2.5.0" });
  });
});
