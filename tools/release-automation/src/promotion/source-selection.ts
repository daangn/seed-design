import { createHash } from "node:crypto";
import type { GitHubPullRequest } from "../core/github";
import { isPrereleaseMarker, validateGeneratedPr, type PrereleaseMarker } from "../core/marker";
import type { GeneratedPrType } from "../core/types";

const gitShaPattern = /^[0-9a-f]{40}$/;

export interface PromotionFirstParentCommit {
  sha: string;
  parents: readonly string[];
}

export interface PromotionSourceCommit {
  kind: "source";
  pr: number;
  mergeSha: string;
  patchSha256: string;
}

export interface PromotionGeneratedCommit {
  kind: "generated";
  pr: number;
  mergeSha: string;
  generatedType: GeneratedPrType;
}

export type PromotionManifestCommit = PromotionSourceCommit | PromotionGeneratedCommit;

export interface PromotionSourceManifest {
  schemaVersion: 1;
  repository: string;
  sourceLane: "minor" | "major";
  enterMergeSha: string;
  exitBaseSha: string;
  commits: PromotionManifestCommit[];
}

export interface PromotionSourceSelection {
  manifest: PromotionSourceManifest;
  manifestSha256: string;
  sources: PromotionSourceCommit[];
}

export interface SelectPromotionSourcesInput {
  repository: string;
  sourceLane: "minor" | "major";
  enterMergeSha: string;
  exitBaseSha: string;
  firstParentCommits: readonly PromotionFirstParentCommit[];
  pulls: readonly GitHubPullRequest[];
  sourceDiffs: ReadonlyMap<number, string>;
}

export interface ActiveEnterSelection {
  marker: Extract<PrereleaseMarker, { operation: "enter" }>;
  mergeSha: string;
  pull: GitHubPullRequest;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function assertGitSha(value: string, label: string): void {
  if (!gitShaPattern.test(value)) throw new Error(`${label}가 exact Git SHA가 아닙니다.`);
}

function assertExactFirstParentInterval(input: SelectPromotionSourcesInput): void {
  assertGitSha(input.enterMergeSha, "Enter merge SHA");
  assertGitSha(input.exitBaseSha, "Exit base SHA");

  let expectedParent = input.enterMergeSha;
  const seen = new Set<string>();
  for (const commit of input.firstParentCommits) {
    assertGitSha(commit.sha, "promotion interval commit SHA");
    if (seen.has(commit.sha)) {
      throw new Error(`promotion first-parent 구간에 commit ${commit.sha}가 중복됐습니다.`);
    }
    seen.add(commit.sha);
    if (commit.parents.length !== 1 || commit.parents[0] !== expectedParent) {
      throw new Error(
        `promotion commit ${commit.sha}가 이전 first-parent ${expectedParent}에 직접 연결된 squash commit이 아닙니다.`,
      );
    }
    expectedParent = commit.sha;
  }

  if (expectedParent !== input.exitBaseSha) {
    throw new Error(
      "promotion first-parent 구간이 exact Enter merge부터 Exit base까지 이어지지 않습니다.",
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

export function selectActiveEnterPull(input: {
  repository: string;
  sourceLane: "minor" | "major";
  currentFirstParentHistory: readonly string[];
  pulls: readonly GitHubPullRequest[];
}): ActiveEnterSelection {
  const positions = new Map(input.currentFirstParentHistory.map((sha, index) => [sha, index]));
  const transitions = input.pulls.flatMap((pull) => {
    const marker = validateGeneratedPr(pullIdentity(pull));
    if (!marker || !isPrereleaseMarker(marker)) return [];
    const mergeSha = pull.merge_commit_sha;
    const position = mergeSha ? positions.get(mergeSha) : undefined;
    if (
      position === undefined ||
      !pull.merged_at ||
      !mergeSha ||
      pull.user.login !== "github-actions[bot]" ||
      !pull.merged_by?.login ||
      pull.merged_by.login.endsWith("[bot]") ||
      pull.base.ref !== input.sourceLane ||
      pull.base.repo.full_name !== input.repository ||
      marker.lane !== input.sourceLane ||
      pull.head.sha !== marker.expectedHeadSha
    ) {
      throw new Error(
        `prerelease lifecycle PR #${pull.number}의 merge provenance가 올바르지 않습니다.`,
      );
    }
    return [{ marker, mergeSha, position, pull }];
  });
  transitions.sort((left, right) => left.position - right.position);
  if (transitions.length === 0 || transitions[0]?.marker.operation !== "enter") {
    throw new Error(`active ${input.sourceLane} lifecycle의 trusted Enter PR을 찾지 못했습니다.`);
  }
  let expected: "enter" | "exit" = "enter";
  for (const transition of transitions) {
    if (transition.marker.operation !== expected) {
      throw new Error(`${input.sourceLane} prerelease lifecycle 전이가 교대로 이어지지 않습니다.`);
    }
    expected = expected === "enter" ? "exit" : "enter";
  }
  const active = transitions.at(-1);
  if (!active || active.marker.operation !== "enter") {
    throw new Error(
      `${input.sourceLane} lane의 마지막 trusted prerelease transition이 Enter가 아닙니다.`,
    );
  }
  return active as ActiveEnterSelection;
}

function pullForCommit(
  commit: PromotionFirstParentCommit,
  pulls: readonly GitHubPullRequest[],
): GitHubPullRequest {
  const matches = pulls.filter((pull) => pull.merge_commit_sha === commit.sha);
  if (matches.length === 0) {
    throw new Error(
      `promotion commit ${commit.sha}를 유일한 merged PR에 연결할 수 없습니다. direct push 또는 rebase merge는 허용하지 않습니다.`,
    );
  }
  if (matches.length !== 1) {
    throw new Error(`promotion commit ${commit.sha}에 연결된 merged PR이 여러 개입니다.`);
  }
  return matches[0] as GitHubPullRequest;
}

function assertPullIdentity(pull: GitHubPullRequest, input: SelectPromotionSourcesInput): void {
  if (
    !pull.merged_at ||
    !pull.merge_commit_sha ||
    pull.base.ref !== input.sourceLane ||
    pull.base.repo.full_name !== input.repository
  ) {
    throw new Error(
      `PR #${pull.number}이 exact ${input.repository}:${input.sourceLane} merged PR이 아닙니다.`,
    );
  }
}

function assertHumanSourcePull(pull: GitHubPullRequest): void {
  if (
    pull.user.login.endsWith("[bot]") ||
    !pull.merged_by?.login ||
    pull.merged_by.login.endsWith("[bot]")
  ) {
    throw new Error(`PR #${pull.number}은 사람이 작성하고 merge한 source PR이 아닙니다.`);
  }
  if ((pull.body ?? "").includes("<!-- seed-release:")) {
    throw new Error(`PR #${pull.number}에 해석할 수 없는 generated marker가 있습니다.`);
  }
}

export function promotionSourceManifestDigest(manifest: PromotionSourceManifest): string {
  return sha256(JSON.stringify(manifest));
}

export function selectPromotionSources(
  input: SelectPromotionSourcesInput,
): PromotionSourceSelection {
  if (!/^[^/\s]+\/[^/\s]+$/.test(input.repository)) {
    throw new Error("promotion repository identity가 owner/repository 형식이 아닙니다.");
  }
  assertExactFirstParentInterval(input);

  const commits: PromotionManifestCommit[] = [];
  const usedDiffs = new Set<number>();
  for (const commit of input.firstParentCommits) {
    const pull = pullForCommit(commit, input.pulls);
    assertPullIdentity(pull, input);
    const generated = validateGeneratedPr(pullIdentity(pull));
    if (generated) {
      commits.push({
        kind: "generated",
        pr: pull.number,
        mergeSha: commit.sha,
        generatedType: generated.type,
      });
      continue;
    }

    assertHumanSourcePull(pull);
    const diff = input.sourceDiffs.get(pull.number);
    if (!diff) throw new Error(`source PR #${pull.number}의 exact 원본 diff가 없습니다.`);
    usedDiffs.add(pull.number);
    commits.push({
      kind: "source",
      pr: pull.number,
      mergeSha: commit.sha,
      patchSha256: sha256(diff),
    });
  }

  const extraDiffs = [...input.sourceDiffs.keys()].filter((number) => !usedDiffs.has(number));
  if (extraDiffs.length > 0) {
    throw new Error(
      `promotion 구간 밖이거나 generated PR의 diff가 입력됐습니다: ${extraDiffs
        .sort((left, right) => left - right)
        .map((number) => `#${number}`)
        .join(", ")}`,
    );
  }

  const manifest: PromotionSourceManifest = {
    schemaVersion: 1,
    repository: input.repository,
    sourceLane: input.sourceLane,
    enterMergeSha: input.enterMergeSha,
    exitBaseSha: input.exitBaseSha,
    commits,
  };
  return {
    manifest,
    manifestSha256: promotionSourceManifestDigest(manifest),
    sources: commits.filter((commit): commit is PromotionSourceCommit => commit.kind === "source"),
  };
}
