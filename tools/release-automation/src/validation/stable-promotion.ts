import type { GitHubPullRequest } from "../core/github";
import {
  isCodePromotionMarker,
  isPrereleaseMarker,
  isStablePromotionMarker,
  validateGeneratedPr,
  type StablePromotionMarker,
} from "../core/marker";
import {
  codePromotionPreflightStatusContext,
  isValidationStatusBoundToRun,
  latestValidationStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
  validationRunIdFromStatus,
} from "../core/validation-status";
import {
  recomputePromotionTarget,
  verifyCodePromotionPull,
} from "../promotion/code-promotion-validation";
import { assertPromotionPullMergeAllowed } from "../promotion/promotion-lock";

export interface StablePromotionClient {
  request<T>(path: string): Promise<T>;
  paginate<T>(path: string): Promise<T[]>;
}

export function assertStablePromotionControlMode(mode: "dry-run" | "production"): void {
  if (mode !== "production") {
    throw new Error(
      "stable promotion은 dry-run receipt로 소진할 수 없으며 production mode에서만 게시할 수 있습니다.",
    );
  }
}

function pullIdentity(pull: GitHubPullRequest) {
  return {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
}

export async function verifyStablePromotionProvenance(input: {
  repository: string;
  marker: StablePromotionMarker;
  versionPull: GitHubPullRequest;
  client: StablePromotionClient;
}): Promise<GitHubPullRequest> {
  const { client, marker, repository, versionPull } = input;
  if (!isStablePromotionMarker(marker))
    throw new Error("exact stable promotion marker가 없습니다.");
  if (
    versionPull.user.login !== "github-actions[bot]" ||
    versionPull.base.ref !== marker.lane ||
    versionPull.base.sha !== marker.expectedBaseSha ||
    versionPull.head.ref !== `changeset-release/${marker.lane}` ||
    versionPull.head.sha !== marker.expectedHeadSha ||
    versionPull.base.repo.full_name !== repository ||
    versionPull.head.repo?.full_name !== repository
  ) {
    throw new Error("Stable Version PR identity/base/head가 promotion marker와 다릅니다.");
  }
  const exitPull = await client.request<GitHubPullRequest>(
    `/repos/${repository}/pulls/${marker.exitPr}`,
  );
  const exitMarker = validateGeneratedPr(pullIdentity(exitPull));
  if (
    !exitMarker ||
    !isPrereleaseMarker(exitMarker) ||
    exitMarker.operation !== "exit" ||
    exitMarker.lane !== marker.lane ||
    exitMarker.operationId !== marker.operationId ||
    exitMarker.enterPr !== marker.enterPr ||
    exitMarker.enterMergeSha !== marker.enterMergeSha ||
    exitPull.user.login !== "github-actions[bot]" ||
    !exitPull.merged_at ||
    !exitPull.merge_commit_sha ||
    !exitPull.merged_by?.login ||
    exitPull.merged_by.login.endsWith("[bot]") ||
    exitPull.merge_commit_sha !== marker.exitMergeSha ||
    exitPull.head.sha !== exitMarker.expectedHeadSha ||
    exitPull.base.sha !== exitMarker.expectedBaseSha ||
    exitPull.base.sha !== marker.exitBaseSha ||
    exitPull.base.ref !== marker.lane ||
    exitPull.base.repo.full_name !== repository ||
    exitPull.head.repo?.full_name !== repository
  ) {
    throw new Error("Stable Version PR이 exact trusted Exit Intent PR에 결속되지 않았습니다.");
  }
  const statuses = await client.paginate<ReleaseValidationStatus>(
    `/repos/${repository}/commits/${exitPull.head.sha}/statuses`,
  );
  const status = latestValidationStatus(
    statuses,
    repository,
    exitPull.head.sha,
    "workflow_dispatch",
  );
  const runId = status ? validationRunIdFromStatus(status, repository) : null;
  if (!status || !runId)
    throw new Error("Exit Intent PR exact head의 trusted validation이 없습니다.");
  const run = await client.request<ReleaseValidationWorkflowRun>(
    `/repos/${repository}/actions/runs/${runId}`,
  );
  if (!isValidationStatusBoundToRun(status, run, repository, exitPull.head.sha)) {
    throw new Error("Exit Intent PR validation status와 workflow run 결속이 올바르지 않습니다.");
  }
  return exitPull;
}

export async function verifyStablePromotionPreflight(input: {
  repositoryPath: string;
  repository: string;
  marker: StablePromotionMarker;
  versionPull: GitHubPullRequest;
  client: StablePromotionClient;
  requireReady?: boolean;
}): Promise<void> {
  const { client, marker, repository, repositoryPath, versionPull } = input;
  await verifyStablePromotionProvenance({ repository, marker, versionPull, client });
  if ((input.requireReady ?? true) && versionPull.draft) {
    throw new Error("Stable Version PR은 code promotion preflight 완료 뒤 ready 상태여야 합니다.");
  }
  for (const target of marker.promotionTargets) {
    await recomputePromotionTarget({
      repositoryPath,
      repository,
      stableMarker: marker,
      stablePull: versionPull,
      target,
      client,
    });
    if (target.noOp) continue;
    const pulls = await client.paginate<GitHubPullRequest>(
      `/repos/${repository}/pulls?state=open&base=${target.lane}&sort=created&direction=asc`,
    );
    const candidates = pulls.filter((pull) => {
      const generated = validateGeneratedPr(pullIdentity(pull));
      return (
        generated &&
        isCodePromotionMarker(generated) &&
        generated.stablePr === versionPull.number &&
        generated.promotionManifestSha256 === marker.promotionManifestSha256 &&
        generated.lane === target.lane &&
        pull.head.sha === target.expectedHeadSha &&
        pull.draft
      );
    });
    if (candidates.length !== 1) {
      throw new Error(`${target.lane} exact draft code promotion PR을 하나 찾지 못했습니다.`);
    }
    const promotionPull = candidates[0] as GitHubPullRequest;
    const promotionMarker = validateGeneratedPr(pullIdentity(promotionPull));
    if (!promotionMarker || !isCodePromotionMarker(promotionMarker)) {
      throw new Error(`${target.lane} exact code promotion marker가 없습니다.`);
    }
    await verifyCodePromotionPull({
      repositoryPath,
      repository,
      marker: promotionMarker,
      pull: promotionPull,
      allowDraft: true,
      client,
    });
    const statuses = await client.paginate<ReleaseValidationStatus>(
      `/repos/${repository}/commits/${promotionPull.head.sha}/statuses`,
    );
    const status = latestValidationStatus(
      statuses,
      repository,
      promotionPull.head.sha,
      "workflow_dispatch",
      codePromotionPreflightStatusContext,
    );
    const runId = status ? validationRunIdFromStatus(status, repository) : null;
    if (!status || !runId) {
      throw new Error(`${target.lane} code promotion preflight receipt가 없습니다.`);
    }
    const run = await client.request<ReleaseValidationWorkflowRun>(
      `/repos/${repository}/actions/runs/${runId}`,
    );
    if (
      !isValidationStatusBoundToRun(
        status,
        run,
        repository,
        promotionPull.head.sha,
        codePromotionPreflightStatusContext,
      )
    ) {
      throw new Error(`${target.lane} code promotion preflight receipt가 trusted run과 다릅니다.`);
    }
  }
  assertPromotionPullMergeAllowed(
    { phase: "preflight-ready", sourceLane: marker.lane },
    { kind: "stable", lane: marker.lane },
  );
}
