import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { isStablePromotionMarker, validateGeneratedPr } from "../core/marker";
import type { PullRequestIdentity } from "../core/types";
import { unreconciledStablePromotionTargets } from "../publish/baseline-reconciliation-state";
import { createBaselineReconciliation } from "../publish/create-baseline-reconciliation";
import { productionPublishRunIdReadyForBaseline } from "../publish/publish-state";
import { resolveCodePromotionReceipt } from "./code-promotion-state";
import { selectPromotionRevalidationTargets } from "./promotion-lock";
import type { ReleaseValidationStatus } from "../core/validation-status";
import {
  isPromotionStatusFor,
  latestPromotionStatus,
  recordPromotionStatus,
} from "./promotion-status";

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

async function git(
  cwd: string,
  args: string[],
  allowFailure = false,
): Promise<{ code: number; stdout: string; stderr: string }> {
  const child = Bun.spawn(["git", ...args], {
    cwd,
    env: {
      ...process.env,
      GH_TOKEN: undefined,
      GITHUB_TOKEN: undefined,
      NODE_AUTH_TOKEN: undefined,
      NPM_TOKEN: undefined,
    },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0 && !allowFailure) throw new Error(`git ${args.join(" ")} 실패:\n${stderr}`);
  return { code, stdout: stdout.trim(), stderr: stderr.trim() };
}

async function dispatchValidation(
  repository: string,
  token: string,
  pullNumber: number,
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
        inputs: {
          head_ref: headRef,
          head_sha: headSha,
          pull_number: String(pullNumber),
          validation_kind: "lane",
        },
      }),
    },
  );
  if (!response.ok)
    throw new Error(`promotion unlock validation dispatch 실패: ${response.status}`);
}

async function main(): Promise<void> {
  const token = required("GH_TOKEN");
  const repository = required("GITHUB_REPOSITORY");
  const repositoryPath = process.cwd();
  const client = new GitHubClient(repository, token);
  const stablePulls = (
    await Promise.all(
      (["minor", "major"] as const).map((lane) =>
        client.paginate<GitHubPullRequest>(
          `/repos/${repository}/pulls?state=closed&base=${lane}&sort=updated&direction=asc`,
        ),
      ),
    )
  )
    .flat()
    .sort((left, right) => {
      const byMergeTime = Date.parse(left.merged_at ?? "") - Date.parse(right.merged_at ?? "");
      return byMergeTime === 0 ? left.number - right.number : byMergeTime;
    });
  for (const stablePull of stablePulls) {
    const marker = validateGeneratedPr(identity(stablePull));
    const mergeSha = stablePull.merge_commit_sha;
    if (
      !marker ||
      !isStablePromotionMarker(marker) ||
      !mergeSha ||
      !stablePull.merged_at ||
      !stablePull.merged_by?.login ||
      stablePull.merged_by.login.endsWith("[bot]")
    ) {
      continue;
    }
    const promotionStatuses = await client.paginate<ReleaseValidationStatus>(
      `/repos/${repository}/commits/${stablePull.head.sha}/statuses`,
    );
    const promotionStatus = latestPromotionStatus(promotionStatuses);
    if (!isPromotionStatusFor(promotionStatus, stablePull.number, marker.promotionManifestSha256)) {
      throw new Error(`Stable promotion #${stablePull.number}의 durable status가 다릅니다.`);
    }
    const publishRunId = await productionPublishRunIdReadyForBaseline(
      client,
      repository,
      mergeSha,
      marker.lane,
      marker.expectedHeadSha,
    );
    if (!publishRunId) {
      console.log(`Stable promotion #${stablePull.number}은 production receipt를 기다립니다.`);
      return;
    }
    const currentDev = await client.request<{ commit: { sha: string } }>(
      `/repos/${repository}/branches/dev`,
    );
    const pendingTargets = await unreconciledStablePromotionTargets({
      repository,
      currentDevSha: currentDev.commit.sha,
      stablePull,
      stableMarker: marker,
      client,
    });
    if (pendingTargets.length === 0) {
      if (promotionStatus?.state === "success") continue;
      if (promotionStatus?.state !== "pending") {
        throw new Error(`Stable promotion #${stablePull.number}의 durable status가 불완전합니다.`);
      }
      const openPulls = (
        await Promise.all(
          (["dev", "minor", "major"] as const).map((lane) =>
            client.paginate<GitHubPullRequest>(
              `/repos/${repository}/pulls?state=open&base=${lane}&sort=created&direction=asc`,
            ),
          ),
        )
      ).flat();
      const targets = selectPromotionRevalidationTargets(
        marker.lane,
        openPulls.map((pull) => ({
          headSha: pull.head.sha,
          lane: pull.base.ref as "dev" | "minor" | "major",
          number: pull.number,
          state: "open" as const,
        })),
      );
      for (const target of targets) {
        const pull = openPulls.find(
          (candidate) =>
            candidate.head.sha === target.headSha && candidate.base.ref === target.lane,
        );
        if (!pull) throw new Error(`revalidation head ${target.headSha}의 PR을 찾지 못했습니다.`);
        await dispatchValidation(repository, token, pull.number, pull.head.ref, target.headSha);
      }
      await recordPromotionStatus({
        client,
        headSha: stablePull.head.sha,
        stablePr: stablePull.number,
        manifestSha256: marker.promotionManifestSha256,
        state: "success",
      });
      console.log(`${targets.length}개 open head의 promotion 잠금 해제 검증을 요청했습니다.`);
      return;
    }
    const receipts = await Promise.all(
      marker.promotionTargets
        .filter((target) => pendingTargets.includes(target.lane))
        .map((target) =>
          resolveCodePromotionReceipt({
            client,
            repository,
            repositoryPath,
            stablePr: stablePull.number,
            stableMarker: marker,
            target,
          }),
        ),
    );
    if (!receipts.every(Boolean)) {
      console.log(`Stable promotion #${stablePull.number}은 code merge를 기다립니다.`);
      return;
    }
    const temporary = await mkdtemp(join(tmpdir(), "seed-stable-baseline-source-"));
    const sourceWorktree = join(temporary, "source");
    let worktreeAdded = false;
    try {
      await git(repositoryPath, ["fetch", "--no-tags", "origin", mergeSha]);
      await git(repositoryPath, ["worktree", "add", "--detach", sourceWorktree, mergeSha]);
      worktreeAdded = true;
      const controlSha = (await git(repositoryPath, ["rev-parse", "HEAD"])).stdout;
      process.env.BASELINE_STABLE_PR = String(stablePull.number);
      process.env.BASELINE_STABLE_MERGE_SHA = mergeSha;
      process.env.BASELINE_PUBLISH_RUN_ID = String(publishRunId);
      process.env.BASELINE_CONTROL_SHA = controlSha;
      process.env.BASELINE_SOURCE_PATH = sourceWorktree;
      process.env.BASELINE_TARGETS = JSON.stringify(pendingTargets);
      delete process.env.BASELINE_PACKAGES;
      await createBaselineReconciliation();
      return;
    } finally {
      if (worktreeAdded) {
        await git(repositoryPath, ["worktree", "remove", "--force", sourceWorktree], true);
      }
      await rm(temporary, { recursive: true, force: true });
    }
  }
  console.log("정렬할 published code promotion이 없습니다.");
}

if (import.meta.main) await main();
