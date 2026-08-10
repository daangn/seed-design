import { readFile, rm, writeFile } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "./github";
import { encodeMarker } from "./marker";
import { protectedLaneFiles, sha256 } from "./sync";
import { isLaneName, parseReleaseControl } from "./config";
import type { LaneName } from "./types";

const mode = process.env.RECONCILE_MODE;
const sourceValue = process.env.SOURCE_LANE;
const targetValue = process.env.TARGET_LANE;
const tokenValue = process.env.GH_TOKEN;
const repositoryValue = process.env.GITHUB_REPOSITORY;
if (
  (mode !== "integration" && mode !== "rebuild") ||
  !sourceValue ||
  !targetValue ||
  !isLaneName(sourceValue) ||
  !isLaneName(targetValue) ||
  !tokenValue ||
  !repositoryValue
) {
  throw new Error("RECONCILE_MODE, SOURCE_LANE, TARGET_LANE과 GitHub 환경이 필요합니다.");
}
if (mode === "integration" && targetValue !== "dev") {
  throw new Error("stable integration 대상은 dev여야 합니다.");
}
if (mode === "rebuild" && (sourceValue !== "dev" || targetValue === "dev")) {
  throw new Error("rebuild는 dev에서 minor 또는 major로 진행합니다.");
}

const source: LaneName = sourceValue;
const target: LaneName = targetValue;
const token = tokenValue;
const repository = repositoryValue;
const client = new GitHubClient(repository, token);

async function run(
  command: string[],
  allowFailure = false,
): Promise<{ code: number; output: string }> {
  const child = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });
  const stdout = await new Response(child.stdout).text();
  const stderr = await new Response(child.stderr).text();
  const code = await child.exited;
  if (code !== 0 && !allowFailure) {
    throw new Error(`${command.join(" ")} 실패:\n${stdout}\n${stderr}`);
  }
  return { code, output: `${stdout}${stderr}`.trim() };
}

async function applyPatch(patchPath: string): Promise<boolean> {
  const applied = await run(["git", "apply", "--3way", "--whitespace=nowarn", patchPath], true);
  if (applied.code === 0) return false;

  await run(["git", "reset", "--hard", "HEAD"]);
  await run(["git", "apply", "--reject", "--whitespace=nowarn", patchPath], true);
  const rejects = Array.from(new Bun.Glob("**/*.rej").scanSync({ cwd: process.cwd(), dot: true }));
  await Promise.all(rejects.map((file) => rm(file, { force: true })));
  return true;
}

const branch = `release-${mode}/${source}-to-${target}-${process.env.GITHUB_RUN_ID ?? Date.now()}`;
await run(["git", "fetch", "origin", source, target, "dev"]);
await run(["git", "switch", "-c", branch]);

let patch: string;
if (mode === "integration") {
  const mergeBase = (await run(["git", "merge-base", `origin/${source}`, "origin/dev"])).output;
  patch = (
    await run([
      "git",
      "diff",
      "--binary",
      mergeBase,
      `origin/${source}`,
      "--",
      ".",
      ":(exclude).changeset/config.json",
      ":(exclude).changeset/pre.json",
      ":(exclude).github/release/control.json",
    ])
  ).output;
} else {
  patch = (
    await run([
      "git",
      "diff",
      "--binary",
      `origin/${target}`,
      "origin/dev",
      "--",
      ".",
      ":(exclude).changeset/config.json",
      ":(exclude).changeset/pre.json",
    ])
  ).output;
}

const patchPath = `/tmp/seed-release-${mode}-${source}-${target}.diff`;
await Bun.write(patchPath, patch);
const conflict = await applyPatch(patchPath);

if (mode === "integration") {
  const control = parseReleaseControl(
    JSON.parse(await readFile(".github/release/control.json", "utf8")),
  );
  if (!control.freeze || control.freeze.promotionLane !== source) {
    throw new Error(`${source} 승격 freeze 상태가 없습니다.`);
  }
  control.freeze.phase = "integrating";
  await writeFile(".github/release/control.json", `${JSON.stringify(control, null, 2)}\n`);
} else {
  const changesetConfig = JSON.parse(await readFile(".changeset/config.json", "utf8")) as Record<
    string,
    unknown
  >;
  changesetConfig.baseBranch = target;
  await writeFile(".changeset/config.json", `${JSON.stringify(changesetConfig, null, 2)}\n`);
  await rm(".changeset/pre.json", { force: true });
}

for (const file of mode === "integration" ? protectedLaneFiles.slice(0, 2) : []) {
  await run(["git", "restore", "--source=HEAD", "--staged", "--worktree", "--", file], true);
}
await run(["git", "add", "--all"]);
const diff = await run(["git", "diff", "--cached", "--quiet"], true);
if (diff.code === 0) throw new Error(`${mode} 결과가 no-op입니다.`);

await run(["git", "config", "user.name", "github-actions[bot]"]);
await run(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
await run(["git", "commit", "-m", `chore(release): ${mode} ${source} to ${target}`]);
await run(["git", "push", "origin", branch]);
const headSha = (await run(["git", "rev-parse", "HEAD"])).output;
const marker = encodeMarker({
  schemaVersion: 1,
  type: mode,
  lane: target,
  sourceRepository: repository,
  targetLane: target,
  patchSha256: sha256(patch),
  expectedHeadSha: headSha,
});
const result = await client.request<GitHubPullRequest>(`/repos/${repository}/pulls`, {
  method: "POST",
  body: JSON.stringify({
    title: `chore(release): ${mode} ${source} to ${target}`,
    head: branch,
    base: target,
    body: `${marker}\n\n${source}의 검증된 stable 결과를 ${target}에 반영합니다.${
      conflict ? "\n\n자동 적용 충돌이 있어 Draft로 생성했습니다. @daangn/design-system" : ""
    }`,
    draft: conflict,
  }),
});
const label = conflict ? "release:reconcile-conflict" : `release:${mode}`;
await client.ensureLabel(
  label,
  conflict ? "d1242f" : "bf8700",
  "Stable integration or lane rebuild",
);
await client.request(`/repos/${repository}/issues/${result.number}/labels`, {
  method: "POST",
  body: JSON.stringify({ labels: [label] }),
});
console.log(`${mode} PR #${result.number}을 생성했습니다.`);
