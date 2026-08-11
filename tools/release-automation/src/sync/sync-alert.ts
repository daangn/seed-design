import { appendFile } from "node:fs/promises";
import { loadLaneConfig } from "../core/config";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import {
  hasTrustedSyncAlertComment,
  planSyncAlert,
  type SyncAlertComment,
  trustedSyncMarkerForPull,
} from "./sync-policy";
import {
  isValidationStatusConsistentWithRun,
  latestValidationStatus,
  validationStatusAsWorkflowRun,
  validationRunIdFromStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
} from "../core/validation-status";

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
if (!token || !repository) throw new Error("GitHub workflow 환경이 필요합니다.");

const client = new GitHubClient(repository, token);
const config = await loadLaneConfig();
const threshold = Date.now() - config.sync.conflictAlertHours * 60 * 60 * 1000;
const pulls = await client.paginate<GitHubPullRequest>(
  `/repos/${repository}/pulls?state=open&sort=created&direction=asc`,
);
const syncPulls = pulls.flatMap((pull) => {
  const marker = trustedSyncMarkerForPull(pull, repository);
  return marker ? [{ pull, marker }] : [];
});

const alerted: string[] = [];
for (const { pull, marker } of syncPulls) {
  const statuses = pull.draft
    ? []
    : await client.paginate<ReleaseValidationStatus>(
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
  const trustedStatus =
    latestStatus &&
    validationRun &&
    isValidationStatusConsistentWithRun(latestStatus, validationRun, repository, pull.head.sha)
      ? latestStatus
      : null;
  const plan = planSyncAlert({
    draft: pull.draft,
    pullCreatedAt: pull.created_at,
    threshold,
    validationRun: trustedStatus
      ? validationStatusAsWorkflowRun(trustedStatus, pull.head.sha)
      : null,
  });
  if (!plan) continue;

  const comments = await client.paginate<SyncAlertComment>(
    `/repos/${repository}/issues/${pull.number}/comments`,
  );
  const alertMarker = `<!-- seed-release-sync-alert:${plan.kind} -->`;
  const acceptedMarkers = [
    alertMarker,
    ...(plan.kind === "draft-conflict" ? ["<!-- seed-release-sync-alert -->"] : []),
  ];
  if (hasTrustedSyncAlertComment(comments, acceptedMarkers)) {
    continue;
  }
  const sourcePull = await client.request<GitHubPullRequest>(
    `/repos/${repository}/pulls/${marker.sourcePr}`,
  );
  const runLink = plan.runUrl ? `\n\n검증 run: ${plan.runUrl}` : "";
  await client.comment(
    pull.number,
    `${alertMarker}\n${plan.detail} 이 PR은 ${pull.base.ref} 동기화 FIFO를 차단하고 있습니다.${runLink}\n\n@${sourcePull.user.login} @daangn/${config.maintainerTeam}`,
  );
  alerted.push(`https://github.com/${repository}/pull/${pull.number}`);
}

const outputPath = process.env.GITHUB_OUTPUT;
if (outputPath) {
  await appendFile(outputPath, `count=${alerted.length}\nurls=${alerted.join(", ")}\n`);
}
console.log(alerted.length > 0 ? alerted.join("\n") : "새 동기화 blocker 알림이 없습니다.");
