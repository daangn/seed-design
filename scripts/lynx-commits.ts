import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
} from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

import { $ } from "bun";

import { compareMeasurements, type Measurement, renderReport } from "./lynx-commits/report";

const COMMITS_TEST_GLOB = "packages/lynx-react/src/**/*.commits.test.tsx";
const PACKAGE_DIR = "packages/lynx-react";
const BUILD_COMMANDS = [
  ["bun", "utils:build"],
  ["bun", "lynx-headless:build"],
];
const TEST_COMMAND = ["bun", "run", "test", "commits.test"];

const { values } = parseArgs({
  options: { base: { type: "string" }, all: { type: "boolean", default: false } },
});

const startedAt = performance.now();
const repoRoot = (await $`git rev-parse --show-toplevel`.text()).trim();
const baseRef = values.base ?? "origin/dev";
const baseSha = (await $`git merge-base HEAD ${baseRef}`.cwd(repoRoot).text()).trim();
// node_modules 아래에 두면 bunchee가 선언 파일을 번들하지 못해 headless 빌드가 깨진다. worktree마다 따로 둔다.
const cacheDir = path.join(
  tmpdir(),
  "seed-lynx-commits",
  createHash("sha256").update(repoRoot).digest("hex").slice(0, 12),
);
const baseRoot = path.join(cacheDir, "base");

interface Result {
  exitCode: number;
  output: string;
}

async function run(cmd: string[], cwd: string, env: Record<string, string> = {}): Promise<Result> {
  const proc = Bun.spawn(cmd, {
    cwd,
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { exitCode, output: stdout + stderr };
}

async function runOrThrow(label: string, cmd: string[], cwd: string) {
  const result = await run(cmd, cwd);
  if (result.exitCode !== 0) {
    throw new Error(
      `[${label}] \`${cmd.join(" ")}\` 실패 (exit ${result.exitCode})\n${result.output}`,
    );
  }
}

function log(message: string) {
  const seconds = ((performance.now() - startedAt) / 1000).toFixed(0);
  console.error(`[lynx:commits ${seconds}s] ${message}`);
}

async function measure(label: "base" | "head", root: string) {
  for (const cmd of BUILD_COMMANDS) await runOrThrow(label, cmd, root);
  log(`${label}: 빌드 완료, commit 테스트 실행`);
  const reportDir = path.join(cacheDir, "reports", label);
  const result = await run(TEST_COMMAND, path.join(root, PACKAGE_DIR), {
    SEED_LYNX_COMMITS_REPORT_DIR: reportDir,
  });
  return { ...result, measurements: readMeasurements(reportDir) };
}

function readMeasurements(reportDir: string): Measurement[] {
  if (!existsSync(reportDir)) return [];
  return readdirSync(reportDir).flatMap((name) =>
    readFileSync(path.join(reportDir, name), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const record: Measurement = JSON.parse(line);
        // recorder는 패키지 기준 경로를 남긴다.
        return { ...record, file: path.posix.join(PACKAGE_DIR, record.file) };
      }),
  );
}

async function prepareBase() {
  await $`git archive ${baseSha} | tar -x -C ${baseRoot}`.cwd(repoRoot).quiet();
  // 측정 도구와 시나리오는 현재 워킹 트리 것을 쓴다. 이번 작업에서 쓴 시나리오도 기준 소스에서 잰다.
  const vitestConfig = "packages/lynx-vitest-config";
  rmSync(path.join(baseRoot, vitestConfig), { recursive: true, force: true });
  cpSync(path.join(repoRoot, vitestConfig), path.join(baseRoot, vitestConfig), {
    recursive: true,
    filter: (source) => !source.split(path.sep).includes("node_modules"),
  });
  for (const file of new Bun.Glob(COMMITS_TEST_GLOB).scanSync({ cwd: baseRoot })) {
    rmSync(path.join(baseRoot, file));
  }
  for (const file of new Bun.Glob(COMMITS_TEST_GLOB).scanSync({ cwd: repoRoot })) {
    cpSync(path.join(repoRoot, file), path.join(baseRoot, file));
  }
  await runOrThrow("base", ["bun", "install", "--frozen-lockfile"], baseRoot);
  log("base: 소스 준비·설치 완료");
}

// 지난 실행의 node_modules를 지우는 데 10초 넘게 걸려 옆으로 옮기고 측정과 동시에 지운다.
const staleName = `${path.basename(cacheDir)}.stale-`;
if (existsSync(cacheDir)) renameSync(cacheDir, `${cacheDir}.stale-${process.pid}`);
mkdirSync(baseRoot, { recursive: true });
const cleanup = Promise.all(
  readdirSync(path.dirname(cacheDir))
    .filter((name) => name.startsWith(staleName))
    .map((name) => rm(path.join(path.dirname(cacheDir), name), { recursive: true, force: true })),
);
log(`기준 ${baseRef} (${baseSha.slice(0, 9)})와 현재 워킹 트리를 측정한다`);

const [base, head] = await Promise.all([
  prepareBase().then(() => measure("base", baseRoot)),
  measure("head", repoRoot),
]);

const changedFiles = [
  ...(await $`git diff --name-only ${baseSha}`.cwd(repoRoot).text()).split("\n"),
  ...(await $`git ls-files --others --exclude-standard`.cwd(repoRoot).text()).split("\n"),
].filter(Boolean);
const rows = compareMeasurements(base.measurements, head.measurements);

if (base.measurements.length === 0) {
  console.error(`기준 소스에서 측정값이 하나도 나오지 않았다. 기준 테스트 출력:\n${base.output}`);
}
console.log(
  renderReport({
    rows,
    changedFiles,
    baseLabel: `\`${baseRef}\` (\`${baseSha.slice(0, 9)}\`)`,
    all: values.all,
  }),
);
if (head.exitCode !== 0) {
  console.error(`현재 소스의 commit 테스트가 실패했다 (exit ${head.exitCode}):\n${head.output}`);
}
await cleanup;
log("완료");

const regressed = rows.some((row) => row.status === "regressed");
process.exit(regressed || head.exitCode !== 0 ? 1 : 0);
