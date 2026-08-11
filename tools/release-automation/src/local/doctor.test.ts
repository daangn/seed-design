import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectDoctorReport, formatDoctorReport } from "./doctor";

const temporaryDirectories: string[] = [];

const lanes = {
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
  sync: {
    activation: "2026-08-07T09:22:18.663Z",
    reconcileCron: "*/10 * * * *",
    conflictAlertHours: 24,
  },
};

const control = {
  $schema: "./control.schema.json",
  schemaVersion: 1,
  mode: "production",
  rootageContractReady: true,
};

async function command(root: string, args: string[]): Promise<void> {
  const child = Bun.spawn(args, { cwd: root, stdout: "pipe", stderr: "pipe" });
  const [exitCode, stderr] = await Promise.all([child.exited, new Response(child.stderr).text()]);
  if (exitCode !== 0) throw new Error(`${args.join(" ")} failed: ${stderr}`);
}

async function createRepository(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "release-doctor-test-"));
  temporaryDirectories.push(root);
  await Promise.all([
    mkdir(join(root, ".github/release"), { recursive: true }),
    mkdir(join(root, ".github/actions/setup"), { recursive: true }),
    mkdir(join(root, "node_modules"), { recursive: true }),
    mkdir(join(root, "packages/react/lib"), { recursive: true }),
    mkdir(join(root, "ecosystem/rootage/core/lib"), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(join(root, ".github/release/lanes.json"), JSON.stringify(lanes)),
    writeFile(join(root, ".github/release/control.json"), JSON.stringify(control)),
    writeFile(
      join(root, ".github/actions/setup/action.yml"),
      'steps:\n  - uses: oven-sh/setup-bun@v2\n    with:\n      bun-version: "1.3.13"\n',
    ),
    writeFile(join(root, "bun.lock"), "lockfileVersion = 1\n"),
    writeFile(join(root, "packages/react/lib/index.js"), "export {};\n"),
    writeFile(join(root, "ecosystem/rootage/core/lib/index.js"), "export {};\n"),
  ]);

  await command(root, ["git", "init", "-b", "dev"]);
  await command(root, ["git", "config", "user.name", "Release Doctor"]);
  await command(root, ["git", "config", "user.email", "doctor@example.com"]);
  await command(root, ["git", "config", "commit.gpgsign", "false"]);
  await command(root, [
    "git",
    "remote",
    "add",
    "origin",
    "https://github.com/daangn/seed-design.git",
  ]);
  await command(root, ["git", "add", "."]);
  await command(root, ["git", "commit", "-m", "test: initialize fixture"]);
  await command(root, ["git", "branch", "minor"]);
  await command(root, ["git", "branch", "major"]);
  await command(root, ["git", "update-ref", "refs/remotes/origin/dev", "HEAD"]);
  await command(root, ["git", "update-ref", "refs/remotes/origin/minor", "HEAD"]);
  await command(root, ["git", "update-ref", "refs/remotes/origin/major", "HEAD"]);
  await command(root, ["git", "config", "branch.dev.remote", "origin"]);
  await command(root, ["git", "config", "branch.dev.merge", "refs/heads/dev"]);
  return root;
}

function check(
  report: Awaited<ReturnType<typeof collectDoctorReport>>,
  id: string,
): (typeof report.checks)[number] {
  const result = report.checks.find((entry) => entry.id === id);
  if (!result) throw new Error(`${id} check not found`);
  return result;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

describe("release doctor", () => {
  test("네트워크 없이 준비된 릴리즈 checkout을 구조화해 보고한다", async () => {
    const root = await createRepository();
    const report = await collectDoctorReport({
      root,
      bunVersion: "1.3.13",
      now: new Date("2026-08-09T00:00:00.000Z"),
    });

    expect(report).toMatchObject({
      schemaVersion: 1,
      generatedAt: "2026-08-09T00:00:00.000Z",
      repositoryRoot: await realpath(root),
      conclusion: "ready",
      ok: true,
      summary: { warning: 0, error: 0 },
    });
    expect(check(report, "release.lanes").status).toBe("pass");
    expect(check(report, "release.control").status).toBe("pass");
    expect(check(report, "toolchain.bun").details).toEqual({
      current: "1.3.13",
      expected: "1.3.13",
    });
    expect(check(report, "git.branch").details).toMatchObject({ branch: "dev" });
    expect(check(report, "git.upstream").details).toMatchObject({ ahead: 0, behind: 0 });
    expect(check(report, "git.worktree").status).toBe("pass");
  });

  test("설정 오류는 실패시키고 로컬 변경과 도구 차이는 경고한다", async () => {
    const root = await createRepository();
    await writeFile(
      join(root, ".github/release/lanes.json"),
      JSON.stringify({ ...lanes, typo: true }),
    );
    await writeFile(join(root, "local-note.md"), "사용자 로컬 파일\n");

    const report = await collectDoctorReport({ root, bunVersion: "1.3.12" });

    expect(report.ok).toBe(false);
    expect(report.conclusion).toBe("error");
    expect(check(report, "release.lanes")).toMatchObject({ status: "error" });
    expect(check(report, "toolchain.bun")).toMatchObject({ status: "warning" });
    expect(check(report, "git.worktree")).toMatchObject({
      status: "warning",
      details: {
        trackedChanges: 1,
        untrackedFiles: 1,
      },
    });
    expect(check(report, "git.worktree").details?.paths).toEqual([
      ".github/release/lanes.json",
      "local-note.md",
    ]);
  });

  test("production과 비활성 동기화의 교차 설정을 차단한다", async () => {
    const root = await createRepository();
    await writeFile(
      join(root, ".github/release/lanes.json"),
      JSON.stringify({ ...lanes, sync: { ...lanes.sync, activation: null } }),
    );

    const report = await collectDoctorReport({ root, bunVersion: "1.3.13" });

    expect(check(report, "release.activation")).toMatchObject({
      status: "error",
      message: expect.stringContaining("production"),
    });
    expect(report.ok).toBe(false);
  });

  test("지원하지 않는 control 키를 설정 오류로 보고한다", async () => {
    const root = await createRepository();
    await writeFile(
      join(root, ".github/release/control.json"),
      JSON.stringify({
        ...control,
        removedState: true,
      }),
    );

    const report = await collectDoctorReport({ root, bunVersion: "1.3.13" });

    expect(check(report, "release.control")).toMatchObject({
      status: "error",
      message: expect.stringContaining("알 수 없음"),
    });
    expect(report.ok).toBe(false);
  });

  test("사람용 출력은 결과, 점검 항목, 권장 조치를 한 번에 보여준다", async () => {
    const root = await createRepository();
    const report = await collectDoctorReport({ root, bunVersion: "1.3.12" });
    const output = formatDoctorReport(report);

    expect(output).toContain("result: ATTENTION");
    expect(output).toContain("! Bun 버전");
    expect(output).toContain("다음 조치:");
    expect(output).toContain("--json");
  });

  test("--json CLI는 로그가 섞이지 않은 machine-readable report를 출력한다", async () => {
    const root = await createRepository();
    const child = Bun.spawn(["bun", join(import.meta.dir, "doctor.ts"), "--json", "--root", root], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);
    const report: unknown = JSON.parse(stdout);

    expect(exitCode, stderr).toBe(0);
    expect(stderr).toBe("");
    expect(report).toMatchObject({
      schemaVersion: 1,
      repositoryRoot: await realpath(root),
      conclusion: expect.stringMatching(/^(ready|warning)$/),
      ok: true,
      summary: { error: 0 },
    });
  });
});
