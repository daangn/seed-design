import type { GitHubPullRequest } from "../core/github";
import {
  isStablePromotionMarker,
  validateGeneratedPr,
  type StablePromotionMarker,
} from "../core/marker";
import type { PullRequestIdentity } from "../core/types";
import type { ReleaseValidationStatus } from "../core/validation-status";
import { latestPromotionStatus } from "./promotion-status";

export interface PromotionStateClient {
  paginate<T>(path: string): Promise<T[]>;
}

function identity(pull: GitHubPullRequest): PullRequestIdentity {
  return {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
}

export async function openStablePromotions(options: {
  repository: string;
  client: PromotionStateClient;
}): Promise<Array<{ marker: StablePromotionMarker | null; pull: GitHubPullRequest }>> {
  const groups = await Promise.all(
    (["minor", "major"] as const).map((lane) =>
      options.client.paginate<GitHubPullRequest>(
        `/repos/${options.repository}/pulls?state=open&base=${lane}&sort=created&direction=asc`,
      ),
    ),
  );
  const candidates = await Promise.all(
    groups.flat().map(async (pull) => {
      const marker = validateGeneratedPr(identity(pull));
      if (marker && isStablePromotionMarker(marker)) return { marker, pull };
      const isReservedVersion =
        pull.user.login === "github-actions[bot]" &&
        pull.head.repo?.full_name === options.repository &&
        pull.base.repo.full_name === options.repository &&
        (pull.base.ref === "minor" || pull.base.ref === "major") &&
        pull.head.ref === `changeset-release/${pull.base.ref}`;
      if (!isReservedVersion) return null;
      const statuses = await options.client.paginate<ReleaseValidationStatus>(
        `/repos/${options.repository}/commits/${pull.head.sha}/statuses`,
      );
      return latestPromotionStatus(statuses) ? { marker: null, pull } : null;
    }),
  );
  return candidates.filter(
    (candidate): candidate is { marker: StablePromotionMarker | null; pull: GitHubPullRequest } =>
      candidate !== null,
  );
}

export async function assertNoCompetingOpenStablePromotion(options: {
  repository: string;
  client: PromotionStateClient;
  allowedPull?: number;
}): Promise<void> {
  const open = await openStablePromotions(options);
  const blockers = open.filter((candidate) => candidate.pull.number !== options.allowedPull);
  if (blockers.length > 0) {
    throw new Error(
      `코드 승격 잠금이 활성화된 Stable promotion PR이 있습니다: ${blockers
        .map((candidate) => `#${candidate.pull.number}`)
        .join(", ")}`,
    );
  }
}
