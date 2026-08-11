import { GitHubClient, type GitHubPullRequest } from "../core/github";
import {
  isCodePromotionMarker,
  isStablePromotionMarker,
  validateGeneratedPr,
} from "../core/marker";
import type { PullRequestIdentity } from "../core/types";
import { hasPublishReceiptReadyForBaseline } from "../publish/publish-state";
import { verifyCodePromotionPull } from "./code-promotion-validation";
import { resolveCodePromotionReceipt } from "./code-promotion-state";
import type { CodePromotionMarker } from "../core/marker";

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

async function graphQlMarkReady(token: string, nodeId: string): Promise<void> {
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
        "mutation MarkPromotionReady($id: ID!) { markPullRequestReadyForReview(input: { pullRequestId: $id }) { pullRequest { id isDraft } } }",
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
    throw new Error(`code promotion PR ready 전환 실패: ${response.status}`);
  }
}

async function dispatchLaneValidation(
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
    throw new Error(`code promotion merge validation dispatch 실패: ${response.status}`);
}

async function main(): Promise<void> {
  const token = required("GH_TOKEN");
  const repository = required("GITHUB_REPOSITORY");
  const stablePr = Number(required("PROMOTION_STABLE_PR"));
  const stableMergeSha = required("PROMOTION_STABLE_MERGE_SHA");
  const publishRunId = Number(required("PROMOTION_PUBLISH_RUN_ID"));
  if (!Number.isSafeInteger(stablePr) || stablePr <= 0 || !Number.isSafeInteger(publishRunId)) {
    throw new Error("code promotion activation identity가 올바르지 않습니다.");
  }
  const client = new GitHubClient(repository, token);
  const stablePull = await client.request<GitHubPullRequest>(
    `/repos/${repository}/pulls/${stablePr}`,
  );
  const stable = validateGeneratedPr(identity(stablePull));
  if (
    !stable ||
    !isStablePromotionMarker(stable) ||
    stablePull.merge_commit_sha !== stableMergeSha ||
    !stablePull.merged_at ||
    stablePull.merged_by?.login?.endsWith("[bot]") !== false
  ) {
    throw new Error("code promotion activation 대상 Stable publish identity가 다릅니다.");
  }
  if (
    !(await hasPublishReceiptReadyForBaseline(
      client,
      repository,
      stableMergeSha,
      publishRunId,
      stable.lane,
      stable.expectedHeadSha,
    ))
  ) {
    throw new Error(
      "exact production publish receipt가 없어 code promotion을 활성화할 수 없습니다.",
    );
  }
  const prepared: Array<{ pull: GitHubPullRequest; marker: CodePromotionMarker }> = [];
  for (const target of stable.promotionTargets) {
    if (target.noOp) {
      const receipt = await resolveCodePromotionReceipt({
        client,
        repository,
        repositoryPath: process.cwd(),
        stablePr,
        stableMarker: stable,
        target,
      });
      if (!receipt) throw new Error(`${target.lane} exact no-op receipt가 없습니다.`);
      continue;
    }
    const pulls = await client.paginate<GitHubPullRequest>(
      `/repos/${repository}/pulls?state=open&base=${target.lane}&sort=created&direction=asc`,
    );
    const matches = pulls.filter((pull) => {
      const marker = validateGeneratedPr(identity(pull));
      return (
        marker &&
        isCodePromotionMarker(marker) &&
        marker.stablePr === stablePr &&
        marker.promotionManifestSha256 === stable.promotionManifestSha256 &&
        pull.head.sha === target.expectedHeadSha
      );
    });
    if (matches.length !== 1) {
      throw new Error(`${target.lane} exact code promotion PR을 하나 찾지 못했습니다.`);
    }
    const pull = matches[0] as GitHubPullRequest;
    const marker = validateGeneratedPr(identity(pull));
    if (!marker || !isCodePromotionMarker(marker)) {
      throw new Error(`${target.lane} code promotion marker가 없습니다.`);
    }
    await verifyCodePromotionPull({
      repositoryPath: process.cwd(),
      repository,
      marker,
      pull,
      allowDraft: pull.draft,
      client,
    });
    prepared.push({ pull, marker });
  }
  for (const { pull, marker } of prepared) {
    if (!pull.draft) continue;
    if (!pull.node_id) throw new Error(`${marker.lane} code promotion GraphQL node ID가 없습니다.`);
    await graphQlMarkReady(token, pull.node_id);
  }
  for (const { pull, marker } of prepared) {
    const current = await client.request<GitHubPullRequest>(
      `/repos/${repository}/pulls/${pull.number}`,
    );
    const currentMarker = validateGeneratedPr(identity(current));
    if (!currentMarker || !isCodePromotionMarker(currentMarker)) {
      throw new Error(`${marker.lane} code promotion marker가 ready 전환 뒤 변경됐습니다.`);
    }
    await verifyCodePromotionPull({
      repositoryPath: process.cwd(),
      repository,
      marker: currentMarker,
      pull: current,
      allowDraft: false,
      client,
    });
    await dispatchLaneValidation(repository, token, current.head.ref, current.head.sha);
  }
}

if (import.meta.main) await main();
