import { rm } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "./github";
import { encodeMarker, parseMarker } from "./marker";
import { idempotencyKey, protectedLaneFiles, sha256, sortSyncCandidates } from "./sync";
import { isLaneName, parseLaneConfig } from "./config";
import type { LaneName, SyncCandidate } from "./types";

interface IssueComment {
  body: string | null;
  author_association: string;
  user: { login: string };
}

const tokenValue = process.env.GH_TOKEN;
const repositoryValue = process.env.GITHUB_REPOSITORY;
const targetValue = process.env.TARGET_LANE;
if (
  !tokenValue ||
  !repositoryValue ||
  !targetValue ||
  !isLaneName(targetValue) ||
  targetValue === "dev"
) {
  throw new Error("GH_TOKEN, GITHUB_REPOSITORY, TARGET_LANE(minor|major)가 필요합니다.");
}
const token = tokenValue;
const repository = repositoryValue;
const target: Exclude<LaneName, "dev"> = targetValue;
const config = parseLaneConfig(
  JSON.parse((await run(["git", "show", "origin/dev:.github/release/lanes.json"])).output),
);
if (!config.sync.activation) {
  console.log("동기화 activation이 설정되지 않아 안전하게 종료합니다.");
  process.exit(0);
}
const activation = config.sync.activation;
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

function isGeneralPullRequest(pr: GitHubPullRequest): boolean {
  if (!pr.merged_at || !pr.merge_commit_sha) return false;
  if (parseMarker(pr.body ?? "")) return false;
  return ![
    "changeset-release/",
    "release-transition/",
    "release-sync/",
    "release-freeze/",
    "release-integration/",
    "release-rebuild/",
  ].some((prefix) => pr.head.ref.startsWith(prefix));
}

async function sourcePullRequests(source: LaneName): Promise<GitHubPullRequest[]> {
  const pulls = await client.paginate<GitHubPullRequest>(
    `/repos/${repository}/pulls?state=closed&base=${source}&sort=updated&direction=asc`,
  );
  return pulls.filter(
    (pull) => pull.merged_at && pull.merged_at >= activation && isGeneralPullRequest(pull),
  );
}

async function comments(pr: number): Promise<IssueComment[]> {
  return client.paginate<IssueComment>(`/repos/${repository}/issues/${pr}/comments`);
}

function syncRecord(body: string | null, key: string): boolean {
  return body?.includes(`<!-- seed-release-sync:${key}:`) ?? false;
}

async function hasSkip(pr: GitHubPullRequest, key: string): Promise<boolean> {
  const allComments = await comments(pr.number);
  const existingRecord = allComments.some((comment) => syncRecord(comment.body, key));
  if (existingRecord) return true;

  const command = allComments.find((comment) => {
    const body = comment.body ?? "";
    const trusted = ["OWNER", "MEMBER", "COLLABORATOR"].includes(comment.author_association);
    const targetsLane = body.includes("/release-sync skip") && body.includes(`target=${target}`);
    const hasReason = /reason=\S+/.test(body);
    const hasEvidence = /evidence=(?:#\d+|[0-9a-f]{7,40})\b/.test(body);
    return trusted && targetsLane && hasReason && hasEvidence;
  });
  if (!command) return false;

  await client.comment(
    pr.number,
    `<!-- seed-release-sync:${key}:skipped -->\n${target} 동기화를 @${command.user.login}의 승인된 skip 요청으로 건너뜁니다.`,
  );
  return true;
}

async function existingPull(branch: string): Promise<GitHubPullRequest | null> {
  const owner = repository.split("/")[0];
  const pulls = await client.paginate<GitHubPullRequest>(
    `/repos/${repository}/pulls?state=all&head=${owner}:${encodeURIComponent(branch)}`,
  );
  return pulls[0] ?? null;
}

async function hasOpenSyncPull(): Promise<boolean> {
  const pulls = await client.paginate<GitHubPullRequest>(
    `/repos/${repository}/pulls?state=open&base=${target}`,
  );
  return pulls.some((pull) => parseMarker(pull.body ?? "")?.type === "sync");
}

const sourcePulls = (
  await Promise.all(config.lanes[target].sources.map((source) => sourcePullRequests(source)))
).flat();
const candidates = sortSyncCandidates(
  sourcePulls.map(
    (pull): SyncCandidate => ({
      number: pull.number,
      mergedAt: pull.merged_at ?? "",
      baseRef: pull.base.ref as LaneName,
      mergeCommitSha: pull.merge_commit_sha ?? "",
      author: pull.user.login,
    }),
  ),
);

if (await hasOpenSyncPull()) {
  console.log(`${target}에 열린 sync PR이 있어 FIFO queue를 유지합니다.`);
  process.exit(0);
}

let selected: {
  candidate: SyncCandidate;
  pull: GitHubPullRequest;
  key: string;
  branch: string;
} | null = null;
for (const candidate of candidates) {
  const pull = sourcePulls.find((item) => item.number === candidate.number);
  if (!pull) continue;
  const key = idempotencyKey(repository, candidate.number, target);
  const branch = `release-sync/${candidate.baseRef}-${candidate.number}-to-${target}`;
  if ((await existingPull(branch)) || (await hasSkip(pull, key))) continue;
  selected = { candidate, pull, key, branch };
  break;
}

if (!selected) {
  console.log(`${target}에 전달할 미처리 PR이 없습니다.`);
  process.exit(0);
}

const patchResponse = await fetch(
  `https://api.github.com/repos/${repository}/pulls/${selected.candidate.number}`,
  {
    headers: {
      accept: "application/vnd.github.diff",
      authorization: `Bearer ${token}`,
      "x-github-api-version": "2022-11-28",
    },
  },
);
if (!patchResponse.ok) throw new Error(`PR diff 조회 실패: ${patchResponse.status}`);
const patch = await patchResponse.text();
const patchHash = sha256(patch);
const patchPath = `/tmp/seed-release-sync-${selected.candidate.number}-${target}.diff`;
await Bun.write(patchPath, patch);

await run(["git", "switch", "-c", selected.branch]);
let conflict = false;
const applied = await run(["git", "apply", "--3way", "--whitespace=nowarn", patchPath], true);
if (applied.code !== 0) {
  conflict = true;
  await run(["git", "reset", "--hard", "HEAD"]);
  await run(["git", "apply", "--reject", "--whitespace=nowarn", patchPath], true);
  const rejects = Array.from(new Bun.Glob("**/*.rej").scanSync({ cwd: process.cwd(), dot: true }));
  await Promise.all(rejects.map((file) => rm(file, { force: true })));
}

for (const file of protectedLaneFiles) {
  await run(["git", "restore", "--source=HEAD", "--staged", "--worktree", "--", file], true);
}
await run(["git", "add", "--all"]);
const diff = await run(["git", "diff", "--cached", "--quiet"], true);
if (diff.code === 0 && !conflict) {
  await client.comment(
    selected.candidate.number,
    `<!-- seed-release-sync:${selected.key}:no-op -->\n${target}에는 최종 diff가 이미 반영되어 있어 no-op으로 기록합니다.`,
  );
  console.log(`${selected.key}: no-op`);
  process.exit(0);
}

await run(["git", "config", "user.name", "github-actions[bot]"]);
await run(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
await run([
  "git",
  "commit",
  ...(diff.code === 0 ? ["--allow-empty"] : []),
  "-m",
  `chore(release): sync #${selected.candidate.number} to ${target}`,
]);
await run(["git", "push", "origin", selected.branch]);
const expectedHeadSha = (await run(["git", "rev-parse", "HEAD"])).output;
const marker = encodeMarker({
  schemaVersion: 1,
  type: "sync",
  lane: target,
  targetLane: target,
  sourceRepository: repository,
  sourcePr: selected.candidate.number,
  patchSha256: patchHash,
  expectedHeadSha,
});
const conflictMessage = conflict
  ? `\n\n자동 적용 중 충돌이 발생했습니다. 충돌 marker와 reject 파일은 커밋하지 않았습니다. @${selected.candidate.author} @${config.maintainerTeam}`
  : "";
const created = await client.request<GitHubPullRequest>(`/repos/${repository}/pulls`, {
  method: "POST",
  body: JSON.stringify({
    title: `chore(release): sync #${selected.candidate.number} to ${target}`,
    head: selected.branch,
    base: target,
    body: `${marker}\n\nIdempotency key: \`${selected.key}\`\n\nSource: #${selected.candidate.number}${conflictMessage}`,
    draft: conflict,
  }),
});
const label = conflict ? "release:sync-conflict" : "release:sync";
await client.ensureLabel(label, conflict ? "d1242f" : "0969da", "Release lane synchronization");
await client.request(`/repos/${repository}/issues/${created.number}/labels`, {
  method: "POST",
  body: JSON.stringify({ labels: [label] }),
});
console.log(`${selected.key}: PR #${created.number} 생성`);
