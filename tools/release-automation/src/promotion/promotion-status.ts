import type { GitHubClient } from "../core/github";
import type { ReleaseValidationStatus } from "../core/validation-status";

export const promotionStatusContext = "seed-release/promotion";

export function promotionStatusDescription(stablePr: number, manifestSha256: string): string {
  if (!Number.isSafeInteger(stablePr) || stablePr <= 0 || !/^[0-9a-f]{64}$/.test(manifestSha256)) {
    throw new Error("promotion status identity가 올바르지 않습니다.");
  }
  return `seed-release-promotion:${stablePr}:${manifestSha256}`;
}

export function latestPromotionStatus(
  statuses: ReleaseValidationStatus[],
): ReleaseValidationStatus | null {
  return (
    statuses
      .filter(
        (status) =>
          status.context === promotionStatusContext &&
          status.creator?.login === "github-actions[bot]" &&
          status.description?.startsWith("seed-release-promotion:"),
      )
      .sort((left, right) => {
        const byTime = Date.parse(right.updated_at) - Date.parse(left.updated_at);
        return byTime === 0 ? right.id - left.id : byTime;
      })[0] ?? null
  );
}

export function isPromotionStatusFor(
  status: ReleaseValidationStatus | null,
  stablePr: number,
  manifestSha256: string,
): boolean {
  return status?.description === promotionStatusDescription(stablePr, manifestSha256);
}

export async function recordPromotionStatus(options: {
  client: GitHubClient;
  headSha: string;
  stablePr: number;
  manifestSha256: string;
  state: "pending" | "success";
}): Promise<void> {
  const runId = process.env.GITHUB_RUN_ID;
  const repository = process.env.GITHUB_REPOSITORY;
  const targetUrl =
    runId && repository ? `https://github.com/${repository}/actions/runs/${runId}` : undefined;
  await options.client.request(`/repos/${options.client.repository}/statuses/${options.headSha}`, {
    method: "POST",
    body: JSON.stringify({
      state: options.state,
      context: promotionStatusContext,
      description: promotionStatusDescription(options.stablePr, options.manifestSha256),
      ...(targetUrl ? { target_url: targetUrl } : {}),
    }),
  });
}
