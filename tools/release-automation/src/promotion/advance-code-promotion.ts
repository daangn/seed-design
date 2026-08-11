import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { isStablePromotionMarker, validateGeneratedPr } from "../core/marker";
import type { PullRequestIdentity } from "../core/types";
import { verifyStablePromotionPreflight } from "../validation/stable-promotion";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
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

async function markReady(token: string, nodeId: string): Promise<void> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-github-api-version": "2022-11-28",
    },
    body: JSON.stringify({
      query:
        "mutation MarkStableReady($id: ID!) { markPullRequestReadyForReview(input: { pullRequestId: $id }) { pullRequest { id isDraft } } }",
      variables: { id: nodeId },
    }),
  });
  const result = (await response.json().catch(() => null)) as {
    data?: { markPullRequestReadyForReview?: { pullRequest?: { isDraft?: boolean } } };
    errors?: unknown[];
  } | null;
  if (
    !response.ok ||
    result?.errors?.length ||
    result?.data?.markPullRequestReadyForReview?.pullRequest?.isDraft !== false
  ) {
    throw new Error(`Stable Version PR ready 전환 실패: ${response.status}`);
  }
}

async function dispatchValidation(
  repository: string,
  token: string,
  headRef: string,
  headSha: string,
): Promise<void> {
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
        inputs: { head_ref: headRef, head_sha: headSha, validation_kind: "lane" },
      }),
    },
  );
  if (!response.ok)
    throw new Error(`Stable promotion validation dispatch 실패: ${response.status}`);
}

export async function advanceStablePromotion(options: {
  repositoryPath: string;
  repository: string;
  token: string;
  stablePr: number;
}): Promise<void> {
  const { repository, repositoryPath, stablePr, token } = options;
  if (!Number.isSafeInteger(stablePr) || stablePr <= 0) {
    throw new Error("Stable promotion PR 번호가 올바르지 않습니다.");
  }
  const client = new GitHubClient(repository, token);
  const pull = await client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${stablePr}`);
  const marker = validateGeneratedPr(identity(pull));
  if (!marker || !isStablePromotionMarker(marker)) {
    throw new Error("advance 대상이 exact Stable promotion PR이 아닙니다.");
  }
  await verifyStablePromotionPreflight({
    repositoryPath,
    repository,
    marker,
    versionPull: pull,
    client,
    requireReady: false,
  });
  if (pull.draft) {
    if (!pull.node_id) throw new Error("Stable Version PR GraphQL node ID가 없습니다.");
    await markReady(token, pull.node_id);
  }
  const current = await client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${stablePr}`);
  const currentMarker = validateGeneratedPr(identity(current));
  if (
    current.draft ||
    current.head.sha !== pull.head.sha ||
    !currentMarker ||
    !isStablePromotionMarker(currentMarker) ||
    currentMarker.promotionManifestSha256 !== marker.promotionManifestSha256
  ) {
    throw new Error("ready 전환 뒤 Stable Version PR identity/head/marker가 변경됐습니다.");
  }
  await dispatchValidation(repository, token, current.head.ref, current.head.sha);
}

async function main(): Promise<void> {
  const stablePr = Number(required("PROMOTION_STABLE_PR"));
  await advanceStablePromotion({
    repositoryPath: process.cwd(),
    repository: required("GITHUB_REPOSITORY"),
    token: required("GH_TOKEN"),
    stablePr,
  });
}

if (import.meta.main) await main();
