import { createHash } from "node:crypto";
import { appendFile, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface ReleaseVerifyStep {
  name: string;
  command: string[];
  env?: Record<string, string>;
}

export interface ReleaseVerifyOptions {
  skipSetup: boolean;
}

export function releaseVerifySteps(options: ReleaseVerifyOptions): ReleaseVerifyStep[] {
  const setup: ReleaseVerifyStep[] = options.skipSetup
    ? []
    : [
        { name: "의존성 설치", command: ["bun", "install", "--frozen-lockfile"] },
        { name: "ecosystem 도구 빌드", command: ["bun", "ecosystem:build"] },
        {
          name: "workspace 링크 갱신",
          command: ["bun", "install", "--frozen-lockfile"],
        },
      ];
  return [
    ...setup,
    { name: "패키지 빌드", command: ["bun", "packages:build"] },
    { name: "Rootage 도구 빌드", command: ["bun", "rootage:build"] },
    {
      name: "릴리즈와 Rootage 시나리오 테스트",
      command: [
        "bun",
        "test",
        "--timeout",
        "30000",
        "tools/release-automation/src",
        "tools/rootage-cdn/src",
      ],
    },
    {
      name: "릴리즈 코드 정적 검사",
      command: ["bun", "biome", "check", "tools/release-automation", "tools/rootage-cdn/src"],
    },
    { name: "패치 형식 검사", command: ["git", "diff", "--check"] },
    {
      name: "Release automation 타입 검사",
      command: ["bun", "--filter", "@seed-design/release-automation", "typecheck"],
    },
    {
      name: "Rootage CDN 타입 검사",
      command: ["bun", "--filter", "@seed-design/rootage-cdn", "typecheck"],
    },
    {
      name: "Rootage Worker 번들 검사",
      command: ["bun", "--filter", "@seed-design/rootage-cdn", "wrangler:dry-run"],
      env: { WRANGLER_LOG_PATH: "/tmp/wrangler-rootage-release-verify.log" },
    },
    { name: "전체 생성물 재생성", command: ["bun", "generate:all"] },
    { name: "전체 저장소 테스트", command: ["bun", "test:all"] },
    { name: "생성 결정성 재검사", command: ["bun", "generate:all"] },
    {
      name: "실제 빌드와 package tarball dry-run",
      command: ["bun", "tools/release-automation/src/local/dry-run.ts"],
    },
  ];
}

export function assertWorktreeUnchanged(before: string, after: string): void {
  if (before !== after) {
    throw new Error(
      "검증 과정에서 tracked 또는 untracked source 상태가 달라졌습니다. `git status --short`와 `git diff`를 확인하세요.",
    );
  }
}

async function capture(command: string[], cwd = process.cwd()): Promise<string> {
  const child = Bun.spawn(command, { cwd, stdout: "pipe", stderr: "pipe" });
  const stdout = await new Response(child.stdout).text();
  const stderr = await new Response(child.stderr).text();
  const exitCode = await child.exited;
  if (exitCode !== 0) {
    throw new Error(`${command.join(" ")} 명령이 ${exitCode}로 실패했습니다.\n${stderr}`);
  }
  return stdout;
}

async function repositoryRoot(): Promise<string> {
  return (await capture(["git", "rev-parse", "--show-toplevel"])).trim();
}

async function worktreeSnapshot(root: string): Promise<string> {
  const [diff, untracked] = await Promise.all([
    capture(["git", "diff", "--binary", "HEAD", "--"], root),
    capture(["git", "ls-files", "--others", "--exclude-standard"], root),
  ]);
  const paths = untracked.split("\n").filter(Boolean).sort();
  const untrackedHashes = await Promise.all(
    paths.map(
      async (path) =>
        `${path}\0${createHash("sha256")
          .update(await readFile(join(root, path)))
          .digest("hex")}`,
    ),
  );
  return `${diff}\0${untrackedHashes.join("\n")}`;
}

async function runStep(
  step: ReleaseVerifyStep,
  index: number,
  total: number,
  root: string,
): Promise<void> {
  console.log(`\n[${index}/${total}] ${step.name}`);
  console.log(`$ ${step.command.join(" ")}`);
  const child = Bun.spawn(step.command, {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env, ...step.env },
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (exitCode !== 0) {
    const logDirectory = await mkdtemp(join(tmpdir(), "seed-release-verify-"));
    const logPath = join(logDirectory, `${String(index).padStart(2, "0")}.log`);
    const output = [stdout.trimEnd(), stderr.trimEnd()].filter(Boolean).join("\n");
    await writeFile(logPath, `${output}\n`);
    const tail = output.split("\n").slice(-80).join("\n");
    throw new Error(
      `${step.name} 실패 (${exitCode}): ${step.command.join(" ")}\n전체 로그: ${logPath}${tail ? `\n\n마지막 출력:\n${tail}` : ""}`,
    );
  }
  console.log(`✓ ${step.name}`);
}

function parseOptions(argv: string[]): ReleaseVerifyOptions {
  const unknown = argv.filter((argument) => argument !== "--skip-setup");
  if (unknown.length > 0) throw new Error(`지원하지 않는 인자입니다: ${unknown.join(" ")}`);
  return { skipSetup: argv.includes("--skip-setup") };
}

async function writeSummary(stepCount: number): Promise<void> {
  const path = process.env.GITHUB_STEP_SUMMARY;
  if (!path) return;
  await appendFile(
    path,
    `## Release verification\n\n- ${stepCount}개 로컬 검증 단계 통과\n- source worktree 상태 유지\n- production write 없음\n`,
  );
}

export async function main(argv = Bun.argv.slice(2)): Promise<void> {
  const steps = releaseVerifySteps(parseOptions(argv));
  const root = await repositoryRoot();
  const before = await worktreeSnapshot(root);
  console.log(`SEED release verification: ${steps.length}개 단계, production write 없음`);
  for (const [index, step] of steps.entries()) await runStep(step, index + 1, steps.length, root);
  assertWorktreeUnchanged(before, await worktreeSnapshot(root));
  await writeSummary(steps.length);
  console.log(`\n✓ 릴리즈 로컬 검증이 완료되었습니다 (${steps.length}/${steps.length}).`);
}

if (import.meta.main) await main();
