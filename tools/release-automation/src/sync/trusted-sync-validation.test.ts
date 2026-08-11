import { describe, expect, test } from "bun:test";
import { encodeMarker } from "../core/marker";
import type { LaneConfig } from "../core/types";
import { sha256 } from "./sync";
import {
  verifySyncMergePreconditions,
  verifyTrustedGeneratedSync,
  type CurrentGitHubPullRequest,
  type SyncTreeVerifier,
  type TrustedSyncMarker,
  type TrustedSyncValidationClient,
} from "./trusted-sync-validation";

const repository = "daangn/seed-design";
const headSha = "a".repeat(40);
const baseSha = "b".repeat(40);
const controlSha = "c".repeat(40);
const controlTreeSha256 = "d".repeat(64);
const sourceMergeSha = "e".repeat(40);
const sourceDiff = "diff --git a/package.txt b/package.txt\n-old\n+new\n";

const config: LaneConfig = {
  $schema: "./lanes.schema.json",
  schemaVersion: 1,
  repository,
  maintainerTeam: "@daangn/seed-design",
  protectedDistTags: ["latest", "stable"],
  lanes: {
    dev: { bump: "patch", prerelease: false, sources: [] },
    minor: { bump: "minor", prerelease: true, sources: ["dev"] },
    major: { bump: "major", prerelease: true, sources: ["dev", "minor"] },
  },
  sync: {
    activation: "2026-08-07T00:00:00.000Z",
    reconcileCron: "*/10 * * * *",
    conflictAlertHours: 24,
  },
};

const marker: TrustedSyncMarker = {
  schemaVersion: 1,
  type: "sync",
  lane: "minor",
  targetLane: "minor",
  sourceRepository: repository,
  sourcePr: 42,
  patchSha256: sha256(sourceDiff),
  expectedHeadSha: headSha,
  targetBump: "minor",
  controlSha,
  controlTreeSha256,
};

const pull: CurrentGitHubPullRequest = {
  number: 100,
  body: encodeMarker(marker),
  draft: false,
  state: "open",
  merged_at: null,
  merge_commit_sha: null,
  created_at: "2026-08-09T00:00:00.000Z",
  user: { login: "github-actions[bot]" },
  base: { ref: "minor", sha: baseSha, repo: { full_name: repository } },
  head: {
    ref: "release-sync/dev-42-to-minor",
    sha: headSha,
    repo: { full_name: repository },
  },
};

const sourcePull: CurrentGitHubPullRequest = {
  number: 42,
  body: "일반 변경",
  draft: false,
  state: "closed",
  merged_at: "2026-08-08T00:00:00.000Z",
  merge_commit_sha: sourceMergeSha,
  created_at: "2026-08-08T00:00:00.000Z",
  user: { login: "human" },
  base: { ref: "dev", sha: "f".repeat(40), repo: { full_name: repository } },
  head: { ref: "feature/42", sha: "1".repeat(40), repo: { full_name: repository } },
};

function validationClient(
  source: CurrentGitHubPullRequest = sourcePull,
  targetSha: string = baseSha,
): TrustedSyncValidationClient {
  return {
    async getPull(_repository, pullNumber) {
      if (pullNumber !== source.number) throw new Error(`unexpected pull #${pullNumber}`);
      return source;
    },
    async getBranchSha() {
      return targetSha;
    },
  };
}

function mergeClient(
  currentPull: CurrentGitHubPullRequest = pull,
  targetSha: string = baseSha,
): TrustedSyncValidationClient {
  return {
    async getPull(_repository, pullNumber) {
      if (pullNumber !== currentPull.number) throw new Error(`unexpected pull #${pullNumber}`);
      return currentPull;
    },
    async getBranchSha() {
      return targetSha;
    },
  };
}

describe("trusted sync pre-check", () => {
  test("current source diff와 target base로 exact tree를 검증한다", async () => {
    const calls: Parameters<SyncTreeVerifier>[] = [];
    const verifyTree: SyncTreeVerifier = async (...arguments_) => {
      calls.push(arguments_);
      return { matches: true, reason: "exact tree" };
    };

    await expect(
      verifyTrustedGeneratedSync({
        repository,
        repositoryPath: "/trusted/dev",
        pull,
        marker,
        config,
        client: validationClient(),
        fetchPullDiff: async () => sourceDiff,
        verifyTree,
      }),
    ).resolves.toMatchObject({ sourcePull: { number: 42 }, sourceDiff, targetBaseSha: baseSha });
    expect(calls).toEqual([
      ["/trusted/dev", headSha, baseSha, sourceDiff, "minor", controlSha, controlTreeSha256],
    ]);
  });

  test("source diff 외 추가 non-control tampering으로 tree가 달라지면 거부한다", async () => {
    await expect(
      verifyTrustedGeneratedSync({
        repository,
        pull,
        marker,
        config,
        client: validationClient(),
        fetchPullDiff: async () => sourceDiff,
        verifyTree: async () => ({
          matches: false,
          reason: "추가 non-control 파일로 sync head tree가 다릅니다.",
        }),
      }),
    ).rejects.toThrow("추가 non-control 파일");
  });

  test("source PR의 exact diff hash가 marker와 달라지면 tree 실행 전에 거부한다", async () => {
    let treeCalled = false;
    await expect(
      verifyTrustedGeneratedSync({
        repository,
        pull,
        marker,
        config,
        client: validationClient(),
        fetchPullDiff: async () => `${sourceDiff}tampered\n`,
        verifyTree: async () => {
          treeCalled = true;
          return { matches: true, reason: "unexpected" };
        },
      }),
    ).rejects.toThrow("exact hash");
    expect(treeCalled).toBe(false);
  });

  test.each([
    {
      label: "unmerged",
      source: { ...sourcePull, state: "open" as const, merged_at: null, merge_commit_sha: null },
    },
    {
      label: "pre-activation",
      source: { ...sourcePull, merged_at: "2026-08-06T23:59:59.000Z" },
    },
    {
      label: "disallowed-source",
      source: { ...sourcePull, base: { ...sourcePull.base, ref: "major" } },
    },
  ])("$label source identity는 거부한다", async ({ source }) => {
    await expect(
      verifyTrustedGeneratedSync({
        repository,
        pull,
        marker,
        config,
        client: validationClient(source),
        fetchPullDiff: async () => sourceDiff,
        verifyTree: async () => ({ matches: true, reason: "unexpected" }),
      }),
    ).rejects.toThrow("activation 이후 승인된 일반 merge PR");
  });

  test("target branch가 PR base에서 이동했으면 tree 실행 전에 거부한다", async () => {
    let treeCalled = false;
    await expect(
      verifyTrustedGeneratedSync({
        repository,
        pull,
        marker,
        config,
        client: validationClient(sourcePull, "2".repeat(40)),
        fetchPullDiff: async () => sourceDiff,
        verifyTree: async () => {
          treeCalled = true;
          return { matches: true, reason: "unexpected" };
        },
      }),
    ).rejects.toThrow("target branch SHA");
    expect(treeCalled).toBe(false);
  });
});

describe("sync merge 직전 guard", () => {
  test("current PR head/base/direct parent가 모두 같을 때만 통과한다", async () => {
    await expect(
      verifySyncMergePreconditions({
        repository,
        pull,
        marker,
        expectedBaseSha: baseSha,
        client: mergeClient(),
        readParentLine: async () => `${headSha} ${baseSha}`,
      }),
    ).resolves.toMatchObject({ number: pull.number, head: { sha: headSha } });
  });

  test("merge API 호출 직전 target base drift를 거부한다", async () => {
    await expect(
      verifySyncMergePreconditions({
        repository,
        pull,
        marker,
        expectedBaseSha: baseSha,
        client: mergeClient(pull, "3".repeat(40)),
        readParentLine: async () => `${headSha} ${baseSha}`,
      }),
    ).rejects.toThrow("current target branch");
  });

  test("head의 direct parent가 exact target base가 아니면 거부한다", async () => {
    await expect(
      verifySyncMergePreconditions({
        repository,
        pull,
        marker,
        expectedBaseSha: baseSha,
        client: mergeClient(),
        readParentLine: async () => `${headSha} ${"4".repeat(40)}`,
      }),
    ).rejects.toThrow("direct single-parent");
  });
});
