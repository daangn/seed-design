import { loadLaneConfig } from "../core/config";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import {
  hasOnlyAutomationCommits,
  isWorkflowRunBoundToPull,
  selectTrustedSyncPullForHead,
  trustedSyncMarkerForPull,
  type PullCommitIdentity,
} from "./sync-policy";
import {
  createGitHubSyncPullDiffFetcher,
  createTrustedSyncValidationClient,
  verifySyncMergePreconditions,
  verifyTrustedGeneratedSync,
  type TrustedSyncValidationResult,
} from "./trusted-sync-validation";
import {
  isTrustedValidationWorkflowRun,
  isValidationStatusBoundToRun,
  latestValidationStatus,
  validationHeadShaFromRun,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
} from "../core/validation-status";
import { assertNoCompetingOpenStablePromotion } from "../promotion/promotion-state";
import { assertDevStablePublishReconciled } from "../publish/baseline-reconciliation-state";

interface WorkflowRunEvent {
  workflow_run: ReleaseValidationWorkflowRun;
}

type AssociatedPullRequest = GitHubPullRequest & { state: "open" | "closed" };

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const eventPath = process.env.GITHUB_EVENT_PATH;
if (!token || !repository || !eventPath) throw new Error("GitHub workflow 환경이 필요합니다.");

const event = (await Bun.file(eventPath).json()) as WorkflowRunEvent;
const validationHeadSha = validationHeadShaFromRun(event.workflow_run);
if (
  !validationHeadSha ||
  !isTrustedValidationWorkflowRun(event.workflow_run, repository, validationHeadSha)
) {
  console.log("trusted dev exact-head 검증 workflow가 아니므로 자동 merge하지 않습니다.");
  process.exit(0);
}

const client = new GitHubClient(repository, token);
try {
  await assertNoCompetingOpenStablePromotion({ repository, client });
  const dev = await client.request<{ commit: { sha: string } }>(
    `/repos/${repository}/branches/dev`,
  );
  await assertDevStablePublishReconciled({
    repository,
    currentDevSha: dev.commit.sha,
    client,
  });
} catch (error) {
  console.log(`${error instanceof Error ? error.message : String(error)} sync merge를 보류합니다.`);
  process.exit(0);
}
let validationStatus: ReleaseValidationStatus | null = null;
for (let attempt = 0; attempt < 5; attempt += 1) {
  const statuses = await client.paginate<ReleaseValidationStatus>(
    `/repos/${repository}/commits/${validationHeadSha}/statuses`,
  );
  const latest = latestValidationStatus(
    statuses,
    repository,
    validationHeadSha,
    "workflow_dispatch",
  );
  if (
    latest &&
    isValidationStatusBoundToRun(latest, event.workflow_run, repository, validationHeadSha)
  ) {
    validationStatus = latest;
    break;
  }
  if (attempt < 4) await Bun.sleep(500 * 2 ** attempt);
}
if (!validationStatus) {
  console.log("검증 run과 exact generated head를 결속한 trusted success status가 없습니다.");
  process.exit(0);
}
const associated = await client.paginate<AssociatedPullRequest>(
  `/repos/${repository}/commits/${validationHeadSha}/pulls`,
);
const pull = selectTrustedSyncPullForHead(associated, repository, validationHeadSha);
if (!pull || !isWorkflowRunBoundToPull(validationHeadSha, pull.head.sha)) {
  console.log("검증 workflow head에 연결된 current trusted sync PR을 찾지 못했습니다.");
  process.exit(0);
}
const marker = trustedSyncMarkerForPull(pull, repository);
if (!marker) {
  console.log("sync marker의 source/hash/head 결속 정보가 불완전해 자동 merge하지 않습니다.");
  process.exit(0);
}
if (marker.expectedHeadSha !== pull.head.sha) {
  console.log("자동 생성 이후 head가 변경되어 수동 리뷰로 전환합니다.");
  process.exit(0);
}

const commits = await client.paginate<PullCommitIdentity>(
  `/repos/${repository}/pulls/${pull.number}/commits`,
);
if (!hasOnlyAutomationCommits(commits)) {
  console.log("GitHub가 automation actor로 확인한 commit만 있지 않아 자동 merge하지 않습니다.");
  process.exit(0);
}

const config = await loadLaneConfig();
const syncValidationClient = createTrustedSyncValidationClient(client);
let syncValidation: TrustedSyncValidationResult;
try {
  syncValidation = await verifyTrustedGeneratedSync({
    repository,
    pull,
    marker,
    config,
    client: syncValidationClient,
    fetchPullDiff: createGitHubSyncPullDiffFetcher(token),
  });
} catch (error) {
  console.log(`${error instanceof Error ? error.message : String(error)} 자동 merge하지 않습니다.`);
  process.exit(0);
}

let currentPull: GitHubPullRequest;
try {
  currentPull = await verifySyncMergePreconditions({
    repository,
    pull,
    marker,
    expectedBaseSha: syncValidation.targetBaseSha,
    client: syncValidationClient,
  });
} catch (error) {
  console.log(`${error instanceof Error ? error.message : String(error)} 자동 merge하지 않습니다.`);
  process.exit(0);
}
await client.request(`/repos/${repository}/pulls/${currentPull.number}/merge`, {
  method: "PUT",
  body: JSON.stringify({
    sha: currentPull.head.sha,
    merge_method: "squash",
    commit_title: `chore(release): sync #${marker.sourcePr} to ${marker.targetLane}`,
  }),
});
console.log(`sync PR #${currentPull.number}을 merge했습니다.`);
