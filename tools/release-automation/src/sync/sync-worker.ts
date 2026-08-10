import { isLaneName, parseLaneConfig } from "../core/config";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { encodeMarker } from "../core/marker";
import type { LaneName, SyncCandidate } from "../core/types";
import {
  isValidationStatusConsistentWithRun,
  latestValidationStatus,
  validationStatusAsWorkflowRun,
  validationRunIdFromStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
} from "../core/validation-status";
import {
  idempotencyKey,
  isProcessed,
  protectedLaneFiles,
  removeSyncRejectFiles,
  sha256,
  sortSyncCandidates,
} from "./sync";
import { normalizeChangesetsInDirectory } from "./sync-changeset";
import {
  applyControlPlaneOverlay,
  controlPlaneFingerprint,
  isTrustedDevControlCommit,
} from "./sync-control-plane";
import {
  hasCurrentSyncControlPlane,
  hasTrustedSyncReceipt,
  generatedMarkerForPull,
  generatedSyncMarkerForPull,
  isDirectSyncHead,
  nextSyncAttemptBranch,
  parseSyncSkipCommand,
  shouldDispatchSyncValidation,
  trustedSyncMarkerForPull,
  type SyncReceiptComment,
} from "./sync-policy";
import { assertNoCompetingOpenStablePromotion } from "../promotion/promotion-state";
import { assertDevStablePublishReconciled } from "../publish/baseline-reconciliation-state";

interface IssueComment extends SyncReceiptComment {
  author_association: string;
}

type SyncPullRequest = GitHubPullRequest & { state: "open" | "closed" };

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
const repositoryPath = process.env.SYNC_REPOSITORY_PATH ?? process.cwd();
const config = parseLaneConfig(
  JSON.parse((await run(["git", "show", "origin/dev:.github/release/lanes.json"])).output),
);
if (!config.sync.activation) {
  console.log("동기화 activation이 설정되지 않아 안전하게 종료합니다.");
  process.exit(0);
}
const activation = config.sync.activation;
const client = new GitHubClient(repository, token);
const controlSha = (await run(["git", "rev-parse", "origin/dev"])).output;
try {
  await assertNoCompetingOpenStablePromotion({ repository, client });
  await assertDevStablePublishReconciled({ repository, currentDevSha: controlSha, client });
} catch (error) {
  console.log(`${error instanceof Error ? error.message : String(error)} sync drain을 보류합니다.`);
  process.exit(0);
}
const controlTreeSha256 = await controlPlaneFingerprint(repositoryPath, controlSha);

async function run(
  command: string[],
  allowFailure = false,
): Promise<{ code: number; output: string }> {
  const child = Bun.spawn(command, {
    cwd: repositoryPath,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0 && !allowFailure) {
    throw new Error(`${command.join(" ")} 실패:\n${stdout}\n${stderr}`);
  }
  return { code, output: `${stdout}${stderr}`.trim() };
}

function isGeneralPullRequest(pr: GitHubPullRequest): boolean {
  if (!pr.merged_at || !pr.merge_commit_sha) return false;
  return !generatedMarkerForPull(pr, repository);
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

async function hasSkip(pr: GitHubPullRequest, key: string): Promise<boolean> {
  const allComments = await comments(pr.number);
  if (hasTrustedSyncReceipt(allComments, key)) return true;

  const command = allComments.find((comment) => {
    const trusted = ["OWNER", "MEMBER", "COLLABORATOR"].includes(comment.author_association);
    const parsed = parseSyncSkipCommand(comment.body ?? "");
    return trusted && parsed?.target === target;
  });
  if (!command) return false;

  await client.comment(
    pr.number,
    `<!-- seed-release-sync:${key}:skipped -->\n${target} 동기화를 @${command.user.login}의 승인된 skip 요청으로 건너뜁니다.`,
  );
  return true;
}

async function dispatchValidation(pull: SyncPullRequest): Promise<void> {
  const statuses = await client.paginate<ReleaseValidationStatus>(
    `/repos/${repository}/commits/${pull.head.sha}/statuses`,
  );
  const latestStatus = latestValidationStatus(
    statuses,
    repository,
    pull.head.sha,
    "workflow_dispatch",
  );
  const runId = latestStatus ? validationRunIdFromStatus(latestStatus, repository) : null;
  let validationRun: ReleaseValidationWorkflowRun | null = null;
  if (runId) {
    try {
      validationRun = await client.request<ReleaseValidationWorkflowRun>(
        `/repos/${repository}/actions/runs/${runId}`,
      );
    } catch (error) {
      console.warn(`validation status의 run #${runId}을 신뢰할 수 없습니다: ${String(error)}`);
    }
  }
  const latest =
    latestStatus &&
    validationRun &&
    isValidationStatusConsistentWithRun(latestStatus, validationRun, repository, pull.head.sha)
      ? validationStatusAsWorkflowRun(latestStatus, pull.head.sha)
      : null;
  const successStaleBefore = Date.now() - config.sync.conflictAlertHours * 60 * 60 * 1000;
  if (!shouldDispatchSyncValidation(latest, successStaleBefore)) {
    console.log(
      `sync PR #${pull.number}의 dispatch 검증이 '${latest?.status}/${latest?.conclusion ?? "none"}' 상태라 중복 호출하지 않습니다.`,
    );
    return;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repository}/actions/workflows/release-pr-validation.yml/dispatches`,
    {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-github-api-version": "2022-11-28",
      },
      body: JSON.stringify({
        ref: "dev",
        inputs: { head_ref: pull.head.ref, head_sha: pull.head.sha },
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `sync PR #${pull.number} 검증 dispatch 실패: ${response.status} ${await response.text()}`,
    );
  }
  console.log(`sync PR #${pull.number} head ${pull.head.sha} 검증을 dispatch했습니다.`);
}

function trustedOpenSyncPulls(pulls: SyncPullRequest[]): SyncPullRequest[] {
  return pulls
    .filter((pull) => {
      const marker = trustedSyncMarkerForPull(pull, repository);
      return pull.state === "open" && marker?.targetLane === target;
    })
    .sort((left, right) => {
      const byDate = left.created_at.localeCompare(right.created_at);
      return byDate === 0 ? left.number - right.number : byDate;
    });
}

const targetPulls = await client.paginate<SyncPullRequest>(
  `/repos/${repository}/pulls?state=all&base=${target}&sort=created&direction=asc`,
);
const openSyncPulls = trustedOpenSyncPulls(targetPulls);
const currentOpenSyncPulls: SyncPullRequest[] = [];
for (const pull of openSyncPulls) {
  const marker = trustedSyncMarkerForPull(pull, repository);
  await run(["git", "fetch", "--no-tags", "origin", pull.head.sha]);
  const parentLine = (await run(["git", "rev-list", "--parents", "-n", "1", pull.head.sha])).output;
  const currentControl =
    marker &&
    hasCurrentSyncControlPlane(marker, controlTreeSha256) &&
    (await isTrustedDevControlCommit(repositoryPath, marker.controlSha)) &&
    (await controlPlaneFingerprint(repositoryPath, marker.controlSha)) === controlTreeSha256;
  const currentBase = isDirectSyncHead(parentLine, pull.head.sha, pull.base.sha);
  if (currentControl && currentBase) {
    currentOpenSyncPulls.push(pull);
    continue;
  }

  await client.comment(
    pull.number,
    `<!-- seed-release-sync-stale-attempt:${pull.head.sha} -->\n현재 trusted dev release control plane 또는 target base와 달라 이 attempt를 닫고 같은 source를 새 attempt로 재queue합니다.`,
  );
  await client.request(`/repos/${repository}/pulls/${pull.number}`, {
    method: "PATCH",
    body: JSON.stringify({ state: "closed" }),
  });
  console.log(`stale control-plane sync PR #${pull.number}을 닫고 새 attempt로 재queue합니다.`);
}
if (currentOpenSyncPulls[0]) {
  if (currentOpenSyncPulls[0].draft) {
    console.log(
      `${target}의 draft sync PR #${currentOpenSyncPulls[0].number}이 FIFO queue를 유지합니다.`,
    );
  } else {
    await dispatchValidation(currentOpenSyncPulls[0]);
  }
  process.exit(0);
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
  if (await hasSkip(pull, key)) continue;
  const related = targetPulls.filter((attempt) => {
    const marker = generatedSyncMarkerForPull(attempt, repository);
    return marker ? isProcessed(marker, repository, candidate.number, target) : false;
  });
  if (related.some((attempt) => attempt.merged_at)) continue;

  const baseBranch = `release-sync/${candidate.baseRef}-${candidate.number}-to-${target}`;
  const remoteBranches = (
    await run([
      "git",
      "for-each-ref",
      "--format=%(refname:strip=3)",
      "refs/remotes/origin/release-sync/*",
    ])
  ).output
    .split("\n")
    .filter(Boolean);
  const usedBranches = [
    ...targetPulls.map((attempt) => attempt.head.ref),
    ...remoteBranches,
  ].filter((branch) => branch === baseBranch || branch.startsWith(`${baseBranch}-attempt-`));
  const branch = nextSyncAttemptBranch(baseBranch, usedBranches);
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
  const rejects = Array.from(new Bun.Glob("**/*.rej").scanSync({ cwd: repositoryPath, dot: true }));
  await removeSyncRejectFiles(repositoryPath, rejects);
}

for (const file of protectedLaneFiles) {
  await run(["git", "restore", "--source=HEAD", "--staged", "--worktree", "--", file], true);
}
const targetBump = config.lanes[target].bump;
const normalizedChangesets = await normalizeChangesetsInDirectory(repositoryPath, targetBump);
await applyControlPlaneOverlay(repositoryPath, controlSha);
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
  targetBump,
  controlSha,
  controlTreeSha256,
});
const conflictMessage = conflict
  ? `\n\n자동 적용 중 충돌이 발생했습니다. 충돌 marker와 reject 파일은 커밋하지 않았습니다. @${selected.candidate.author} @${config.maintainerTeam}`
  : "";
const created = await client.request<SyncPullRequest>(`/repos/${repository}/pulls`, {
  method: "POST",
  body: JSON.stringify({
    title: `chore(release): sync #${selected.candidate.number} to ${target}`,
    head: selected.branch,
    base: target,
    body: `${marker}\n\nIdempotency key: \`${selected.key}\`\n\nSource patch: #${selected.candidate.number} (\`${patchHash}\`)\n\nTarget changeset bump: \`${targetBump}\` (${normalizedChangesets.length} file(s) normalized)\n\nTrusted control plane: \`dev@${controlSha}\` (\`${controlTreeSha256}\`)${conflictMessage}`,
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
if (!created.draft) await dispatchValidation(created);
