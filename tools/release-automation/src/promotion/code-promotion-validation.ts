import type { GitHubPullRequest } from "../core/github";
import {
  isCodePromotionMarker,
  isPrereleaseMarker,
  isStablePromotionMarker,
  validateGeneratedPr,
  type CodePromotionMarker,
  type StablePromotionMarker,
} from "../core/marker";
import type { PromotionTargetPlan, PullRequestIdentity } from "../core/types";
import { controlPlaneFingerprint } from "../sync/sync-control-plane";
import { productionPublishRunIdReadyForBaseline } from "../publish/publish-state";
import { computeCodePromotionTrees, type CodePromotionSourceEffect } from "./code-promotion-tree";
import { assertPromotionPullMergeAllowed, promotionPullDecision } from "./promotion-lock";
import { selectPromotionSources, type PromotionFirstParentCommit } from "./source-selection";

export interface CodePromotionValidationClient {
  request<T>(path: string): Promise<T>;
  paginate<T>(path: string): Promise<T[]>;
}

interface GitResult {
  code: number;
  stdout: string;
  stderr: string;
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

async function git(cwd: string, args: string[]): Promise<GitResult> {
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
  if (code !== 0) throw new Error(`git ${args.join(" ")} 실패:\n${stderr.trim()}`);
  return { code, stdout: stdout.trim(), stderr: stderr.trim() };
}

function parseFirstParentLines(value: string): PromotionFirstParentCommit[] {
  return value
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, ...parents] = line.split(/\s+/);
      if (!sha) throw new Error("promotion first-parent commit SHA가 비었습니다.");
      return { sha, parents };
    });
}

function sameTargetPlan(left: PromotionTargetPlan, right: PromotionTargetPlan): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function siblingLane(lane: "minor" | "major"): "minor" | "major" {
  return lane === "minor" ? "major" : "minor";
}

export async function recomputePromotionTarget(options: {
  repositoryPath: string;
  repository: string;
  stableMarker: StablePromotionMarker;
  stablePull: GitHubPullRequest;
  target: PromotionTargetPlan;
  client: CodePromotionValidationClient;
}): Promise<void> {
  const { client, repository, repositoryPath, stableMarker, stablePull, target } = options;
  if (!isStablePromotionMarker(stableMarker)) {
    throw new Error("target recompute에 exact Stable promotion marker가 없습니다.");
  }
  const allowedTargets = ["dev", siblingLane(stableMarker.lane)];
  if (!allowedTargets.includes(target.lane)) {
    throw new Error(`${target.lane}은 Stable promotion target이 아닙니다.`);
  }
  const [exitPull, closedPulls] = await Promise.all([
    client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${stableMarker.exitPr}`),
    client.paginate<GitHubPullRequest>(
      `/repos/${repository}/pulls?state=closed&base=${stableMarker.lane}&sort=updated&direction=asc`,
    ),
  ]);
  const exitMarker = validateGeneratedPr(identity(exitPull));
  if (
    !exitMarker ||
    !isPrereleaseMarker(exitMarker) ||
    exitMarker.operation !== "exit" ||
    exitMarker.enterPr !== stableMarker.enterPr ||
    exitMarker.enterMergeSha !== stableMarker.enterMergeSha ||
    exitMarker.expectedBaseSha !== stableMarker.exitBaseSha ||
    exitPull.merge_commit_sha !== stableMarker.exitMergeSha ||
    stablePull.head.sha !== stableMarker.expectedHeadSha
  ) {
    throw new Error("Stable marker의 Enter/Exit lifecycle provenance가 다릅니다.");
  }
  await git(repositoryPath, [
    "fetch",
    "--no-tags",
    "origin",
    `+refs/heads/${stableMarker.lane}:refs/remotes/origin/${stableMarker.lane}`,
    `+refs/heads/${target.lane}:refs/remotes/origin/${target.lane}`,
    `+refs/pull/${stablePull.number}/head:refs/remotes/promotion-stable-head`,
  ]);
  const [currentTarget, fetchedStableHead] = await Promise.all([
    git(repositoryPath, ["rev-parse", `refs/remotes/origin/${target.lane}`]),
    git(repositoryPath, ["rev-parse", "refs/remotes/promotion-stable-head"]),
  ]);
  if (
    currentTarget.stdout !== target.expectedBaseSha ||
    fetchedStableHead.stdout !== stableMarker.expectedHeadSha
  ) {
    throw new Error(
      `${target.lane} target 또는 Stable Version head가 preflight 이후 이동했습니다.`,
    );
  }
  const interval = parseFirstParentLines(
    (
      await git(repositoryPath, [
        "rev-list",
        "--first-parent",
        "--reverse",
        "--parents",
        `${stableMarker.enterMergeSha}..${stableMarker.exitBaseSha}`,
      ])
    ).stdout,
  );
  const bySha = new Map(interval.map((commit) => [commit.sha, commit]));
  const sourceDiffs = new Map<number, string>();
  for (const pull of closedPulls) {
    const commit = pull.merge_commit_sha ? bySha.get(pull.merge_commit_sha) : undefined;
    if (!commit || validateGeneratedPr(identity(pull))) continue;
    const parent = commit.parents[0];
    if (!parent) throw new Error(`source PR #${pull.number} parent가 없습니다.`);
    sourceDiffs.set(
      pull.number,
      (
        await git(repositoryPath, [
          "diff",
          "--binary",
          "--full-index",
          "--no-ext-diff",
          parent,
          commit.sha,
          "--",
        ])
      ).stdout,
    );
  }
  const selected = selectPromotionSources({
    repository,
    sourceLane: stableMarker.lane,
    enterMergeSha: stableMarker.enterMergeSha,
    exitBaseSha: stableMarker.exitBaseSha,
    firstParentCommits: interval,
    pulls: closedPulls,
    sourceDiffs,
  });
  if (selected.manifestSha256 !== stableMarker.promotionManifestSha256) {
    throw new Error("Stable marker의 source promotion manifest digest가 다릅니다.");
  }
  const effects: CodePromotionSourceEffect[] = selected.sources.map((source) => {
    const parentSha = bySha.get(source.mergeSha)?.parents[0];
    if (!parentSha) throw new Error(`source PR #${source.pr} parent를 찾지 못했습니다.`);
    return { sourcePr: source.pr, parentSha, mergeSha: source.mergeSha };
  });
  const tree = await computeCodePromotionTrees({
    repositoryPath,
    targetBaseSha: target.expectedBaseSha,
    sourceEffects: effects,
    projectedBaseline: {
      baseSha: stableMarker.exitMergeSha,
      headSha: stableMarker.expectedHeadSha,
    },
  });
  if (
    !tree.projectedBaseline ||
    tree.noOp !== target.noOp ||
    tree.codeTreeSha !== target.expectedCodeTreeSha ||
    tree.projectedBaseline.treeSha !== target.expectedBaselineTreeSha ||
    tree.patchSha256 !== target.patchSha256 ||
    tree.projectedBaseline.patchSha256 !== stableMarker.stablePatchSha256
  ) {
    throw new Error(
      `${target.lane} code promotion 또는 projected baseline tree가 marker와 다릅니다.`,
    );
  }
}

export async function verifyCodePromotionPull(options: {
  repositoryPath: string;
  repository: string;
  marker: CodePromotionMarker;
  pull: GitHubPullRequest;
  allowDraft: boolean;
  client: CodePromotionValidationClient;
}): Promise<StablePromotionMarker> {
  const { allowDraft, client, marker, pull, repository, repositoryPath } = options;
  if (!isCodePromotionMarker(marker)) throw new Error("exact code promotion marker가 없습니다.");
  if (
    pull.user.login !== "github-actions[bot]" ||
    pull.base.ref !== marker.lane ||
    pull.base.sha !== marker.expectedBaseSha ||
    pull.head.sha !== marker.expectedHeadSha ||
    pull.base.repo.full_name !== repository ||
    pull.head.repo?.full_name !== repository ||
    pull.draft !== allowDraft
  ) {
    throw new Error("code promotion PR identity/base/head/draft가 marker와 다릅니다.");
  }
  const stablePull = await client.request<GitHubPullRequest>(
    `/repos/${repository}/pulls/${marker.stablePr}`,
  );
  const stable = validateGeneratedPr(identity(stablePull));
  if (
    !stable ||
    !isStablePromotionMarker(stable) ||
    stable.expectedHeadSha !== marker.stableVersionHeadSha ||
    stable.lane !== marker.sourceLane ||
    stable.enterPr !== marker.enterPr ||
    stable.enterMergeSha !== marker.enterMergeSha ||
    stable.exitPr !== marker.exitPr ||
    stable.exitBaseSha !== marker.exitBaseSha ||
    stable.exitMergeSha !== marker.exitMergeSha ||
    stable.promotionManifestSha256 !== marker.promotionManifestSha256 ||
    stable.stablePatchSha256 !== marker.stablePatchSha256
  ) {
    throw new Error("code promotion PR이 exact Stable promotion marker와 다릅니다.");
  }
  if (!allowDraft) {
    if (
      !stablePull.merged_at ||
      !stablePull.merge_commit_sha ||
      !stablePull.merged_by?.login ||
      stablePull.merged_by.login.endsWith("[bot]") ||
      !(await productionPublishRunIdReadyForBaseline(
        client,
        repository,
        stablePull.merge_commit_sha,
        stable.lane,
        stable.expectedHeadSha,
      ))
    ) {
      throw new Error(
        "code promotion merge validation에 exact production publish receipt가 없습니다.",
      );
    }
    assertPromotionPullMergeAllowed(
      { phase: "published-awaiting-code", sourceLane: stable.lane },
      { kind: "code-promotion", lane: marker.lane },
    );
  } else {
    const decision = promotionPullDecision(
      { phase: "exiting-locked", sourceLane: stable.lane },
      { kind: "code-promotion", lane: marker.lane },
    );
    if (!decision.canValidate) throw new Error(decision.reason);
  }
  const target = stable.promotionTargets.find((candidate) => candidate.lane === marker.lane);
  if (
    !target ||
    target.noOp ||
    !sameTargetPlan(target, {
      lane: marker.lane,
      expectedBaseSha: marker.expectedBaseSha,
      expectedHeadSha: marker.expectedHeadSha,
      expectedCodeTreeSha: marker.expectedCodeTreeSha,
      expectedBaselineTreeSha: marker.expectedBaselineTreeSha,
      patchSha256: marker.patchSha256,
      noOp: false,
    })
  ) {
    throw new Error("code promotion marker가 Stable target plan과 다릅니다.");
  }
  await recomputePromotionTarget({
    repositoryPath,
    repository,
    stableMarker: stable,
    stablePull,
    target,
    client,
  });
  const [parentLine, treeSha, controlTree] = await Promise.all([
    git(repositoryPath, ["rev-list", "--parents", "-n", "1", marker.expectedHeadSha]),
    git(repositoryPath, ["rev-parse", `${marker.expectedHeadSha}^{tree}`]),
    controlPlaneFingerprint(repositoryPath, marker.controlSha),
  ]);
  const parents = parentLine.stdout.split(/\s+/);
  if (
    parents.length !== 2 ||
    parents[1] !== marker.expectedBaseSha ||
    treeSha.stdout !== marker.expectedCodeTreeSha ||
    controlTree !== marker.controlTreeSha256
  ) {
    throw new Error(
      "code promotion head가 exact target base의 trusted single-child tree가 아닙니다.",
    );
  }
  return stable;
}
