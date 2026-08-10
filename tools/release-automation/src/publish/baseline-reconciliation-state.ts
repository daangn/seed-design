import { isBaselineMarker, isStablePromotionMarker } from "../core/marker";
import type { GitHubPullRequest } from "../core/github";
import { parseMarker } from "../core/marker";
import {
  hasBoundPublishReceipt,
  hasBoundPublishReceiptForRun,
  trustedVersionMarker,
} from "./publish-state";
import {
  isValidationStatusBoundToRun,
  latestValidationStatus,
  type ReleaseValidationStatus,
  type ReleaseValidationWorkflowRun,
  validationRunIdFromStatus,
} from "../core/validation-status";
import type { LaneName, PromotionTargetPlan } from "../core/types";
import type { StablePromotionMarker } from "../core/marker";
import { latestPromotionStatus } from "../promotion/promotion-status";

interface ReconciliationClient {
  request<T>(path: string): Promise<T>;
  paginate<T>(path: string): Promise<T[]>;
}

interface CompareResult {
  status: "ahead" | "behind" | "diverged" | "identical";
}

function isHumanMerged(pull: GitHubPullRequest): boolean {
  return Boolean(
    pull.merged_at &&
      pull.merge_commit_sha &&
      pull.merged_by?.login &&
      !pull.merged_by.login.endsWith("[bot]"),
  );
}

function stablePromotionMarker(pull: GitHubPullRequest, repository: string) {
  if (!isHumanMerged(pull) || pull.base.repo.full_name !== repository) return null;
  const marker = trustedVersionMarker(
    {
      author: pull.user.login,
      body: pull.body ?? "",
      baseRef: pull.base.ref,
      headRef: pull.head.ref,
      baseRepository: pull.base.repo.full_name,
      headRepository: pull.head.repo?.full_name ?? "",
    },
    pull.head.sha,
  );
  return marker && isStablePromotionMarker(marker) ? marker : null;
}

function trustedBaselinePull(
  pull: GitHubPullRequest,
  repository: string,
  stablePr: number,
  stableMergeSha: string,
  target: PromotionTargetPlan,
  stableMarker: StablePromotionMarker,
) {
  if (
    !isHumanMerged(pull) ||
    pull.base.ref !== target.lane ||
    pull.base.repo.full_name !== repository ||
    pull.user.login !== "github-actions[bot]" ||
    pull.head.repo?.full_name !== repository
  ) {
    return null;
  }
  const marker = parseMarker(pull.body ?? "");
  if (
    !marker ||
    !isBaselineMarker(marker) ||
    marker.lane !== target.lane ||
    marker.stablePr !== stablePr ||
    marker.stableMergeSha !== stableMergeSha ||
    marker.codeMergeSha !== pull.base.sha ||
    marker.expectedCodeTreeSha !== target.expectedCodeTreeSha ||
    marker.expectedBaselineTreeSha !== target.expectedBaselineTreeSha ||
    marker.promotionManifestSha256 !== stableMarker.promotionManifestSha256 ||
    marker.stablePatchSha256 !== stableMarker.stablePatchSha256 ||
    marker.expectedHeadSha !== pull.head.sha ||
    pull.head.ref !==
      `release-baseline/${target.lane}/${marker.stableMergeSha.slice(0, 12)}-${marker.publishRunId}`
  ) {
    return null;
  }
  return marker;
}

export async function unreconciledStablePromotionTargets(options: {
  repository: string;
  currentDevSha: string;
  stablePull: GitHubPullRequest;
  stableMarker: StablePromotionMarker;
  client: ReconciliationClient;
  baselinePulls?: GitHubPullRequest[];
}): Promise<LaneName[]> {
  const { client, currentDevSha, repository, stableMarker, stablePull } = options;
  const stableMergeSha = stablePull.merge_commit_sha;
  if (!stableMergeSha) throw new Error("Stable promotion merge SHA가 없습니다.");
  const baselinePulls =
    options.baselinePulls ??
    (
      await Promise.all(
        (["dev", "minor", "major"] as const).map((lane) =>
          client.paginate<GitHubPullRequest>(
            `/repos/${repository}/pulls?state=closed&base=${lane}&sort=updated&direction=asc`,
          ),
        ),
      )
    ).flat();
  const pending: LaneName[] = [];
  for (const target of stableMarker.promotionTargets) {
    const currentTargetSha =
      target.lane === "dev"
        ? currentDevSha
        : (
            await client.request<{ commit: { sha: string } }>(
              `/repos/${repository}/branches/${target.lane}`,
            )
          ).commit.sha;
    const candidates = baselinePulls.flatMap((pull) => {
      const marker = trustedBaselinePull(
        pull,
        repository,
        stablePull.number,
        stableMergeSha,
        target,
        stableMarker,
      );
      return marker && pull.merge_commit_sha
        ? [{ marker, mergeSha: pull.merge_commit_sha, pull }]
        : [];
    });
    let reconciled = false;
    for (const candidate of candidates) {
      if (
        !(await hasBoundPublishReceiptForRun(
          client,
          repository,
          stableMergeSha,
          candidate.marker.publishRunId,
          "production",
        ))
      ) {
        continue;
      }
      const statuses = await client.paginate<ReleaseValidationStatus>(
        `/repos/${repository}/commits/${candidate.pull.head.sha}/statuses`,
      );
      const status = latestValidationStatus(
        statuses,
        repository,
        candidate.pull.head.sha,
        "workflow_dispatch",
      );
      const validationRunId = status ? validationRunIdFromStatus(status, repository) : null;
      if (!status || !validationRunId) continue;
      const validationRun = await client.request<ReleaseValidationWorkflowRun>(
        `/repos/${repository}/actions/runs/${validationRunId}`,
      );
      if (
        !isValidationStatusBoundToRun(status, validationRun, repository, candidate.pull.head.sha)
      ) {
        continue;
      }
      const comparison = await client.request<CompareResult>(
        `/repos/${repository}/compare/${candidate.mergeSha}...${currentTargetSha}`,
      );
      if (comparison.status === "ahead" || comparison.status === "identical") {
        reconciled = true;
        break;
      }
    }
    if (!reconciled) pending.push(target.lane);
  }
  return pending;
}

export async function assertDevStablePublishReconciled(options: {
  repository: string;
  currentDevSha: string;
  client: ReconciliationClient;
  allowedPendingStableMergeSha?: string;
}): Promise<void> {
  const { allowedPendingStableMergeSha, client, currentDevSha, repository } = options;
  const [stablePulls, baselinePulls] = await Promise.all([
    Promise.all(
      ["minor", "major"].map((lane) =>
        client.paginate<GitHubPullRequest>(
          `/repos/${repository}/pulls?state=closed&base=${lane}&sort=updated&direction=asc`,
        ),
      ),
    ).then((groups) => groups.flat()),
    Promise.all(
      (["dev", "minor", "major"] as const).map((lane) =>
        client.paginate<GitHubPullRequest>(
          `/repos/${repository}/pulls?state=closed&base=${lane}&sort=updated&direction=asc`,
        ),
      ),
    ).then((groups) => groups.flat()),
  ]);

  for (const stablePull of stablePulls) {
    const stableMarker = stablePromotionMarker(stablePull, repository);
    const stableMergeSha = stablePull.merge_commit_sha;
    if (!stableMarker || !stableMergeSha) {
      const isReservedMergedVersion =
        isHumanMerged(stablePull) &&
        stablePull.user.login === "github-actions[bot]" &&
        stablePull.head.repo?.full_name === repository &&
        stablePull.base.repo.full_name === repository &&
        (stablePull.base.ref === "minor" || stablePull.base.ref === "major") &&
        stablePull.head.ref === `changeset-release/${stablePull.base.ref}`;
      if (isReservedMergedVersion) {
        const statuses = await client.paginate<ReleaseValidationStatus>(
          `/repos/${repository}/commits/${stablePull.head.sha}/statuses`,
        );
        if (latestPromotionStatus(statuses)) {
          throw new Error(
            `merged Stable promotion PR #${stablePull.number}의 marker가 손상되어 fail-closed합니다.`,
          );
        }
      }
      continue;
    }

    const hasProductionReceipt = await hasBoundPublishReceipt(
      client,
      repository,
      stableMergeSha,
      "production",
    );
    if (!hasProductionReceipt) {
      if (stableMergeSha === allowedPendingStableMergeSha) continue;
      throw new Error(
        `merged stable promotion PR #${stablePull.number}의 exact production publish receipt가 아직 없습니다.`,
      );
    }

    const pending = await unreconciledStablePromotionTargets({
      repository,
      currentDevSha,
      stablePull,
      stableMarker,
      client,
      baselinePulls,
    });
    if (pending.length > 0) {
      throw new Error(
        `stable promotion PR #${stablePull.number}의 trusted ${pending.join(", ")} baseline reconciliation PR이 current target에 반영되지 않았습니다.`,
      );
    }
  }
}
