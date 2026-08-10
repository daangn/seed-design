import { isBaselineMarker, isStablePromotionMarker } from "../core/marker";
import { type GitHubPullRequest } from "../core/github";
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
import type { LaneName } from "../core/types";

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
  target: LaneName,
) {
  if (
    !isHumanMerged(pull) ||
    pull.base.ref !== target ||
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
    marker.lane !== target ||
    marker.stablePr !== stablePr ||
    marker.stableMergeSha !== stableMergeSha ||
    marker.expectedHeadSha !== pull.head.sha ||
    pull.head.ref !==
      `release-baseline/${target}/${marker.stableMergeSha.slice(0, 12)}-${marker.publishRunId}`
  ) {
    return null;
  }
  return marker;
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
    if (!stableMarker || !stableMergeSha) continue;

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

    const sibling = stableMarker.lane === "minor" ? "major" : "minor";
    for (const target of ["dev", sibling] as const) {
      const currentTargetSha =
        target === "dev"
          ? currentDevSha
          : (
              await client.request<{ commit: { sha: string } }>(
                `/repos/${repository}/branches/${target}`,
              )
            ).commit.sha;
      const candidates = baselinePulls.flatMap((pull) => {
        const marker = trustedBaselinePull(
          pull,
          repository,
          stablePull.number,
          stableMergeSha,
          target,
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

      if (!reconciled) {
        throw new Error(
          `stable promotion PR #${stablePull.number}의 trusted ${target} baseline reconciliation PR이 current ${target}에 반영되지 않았습니다.`,
        );
      }
    }
  }
}
