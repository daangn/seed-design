import { describe, expect, test } from "bun:test";
import { encodeMarker, type StablePromotionMarker } from "../core/marker";
import type { GitHubPullRequest } from "../core/github";
import {
  releaseValidationRunName,
  releaseValidationStatusDescription,
} from "../core/validation-status";
import { releaseValidationWorkflowName } from "../sync/sync-policy";
import { verifyStablePromotionProvenance } from "./stable-promotion";

const repository = "daangn/seed-design";
const exitBaseSha = "a".repeat(40);
const exitHeadSha = "b".repeat(40);
const exitMergeSha = "c".repeat(40);
const versionHeadSha = "d".repeat(40);
const controlSha = "e".repeat(40);

const exitMarker = {
  schemaVersion: 1,
  type: "prerelease",
  lane: "minor",
  operation: "exit",
  operationId: "123",
  expectedBaseSha: exitBaseSha,
  expectedHeadSha: exitHeadSha,
  controlSha,
  patchSha256: "f".repeat(64),
} as const;
const marker: StablePromotionMarker = {
  schemaVersion: 1,
  type: "version",
  lane: "minor",
  releaseKind: "stable-promotion",
  operationId: "123",
  exitPr: 2001,
  exitMergeSha,
  expectedBaseSha: exitMergeSha,
  expectedHeadSha: versionHeadSha,
  controlSha,
};
const exitPull: GitHubPullRequest = {
  number: 2001,
  body: encodeMarker(exitMarker),
  draft: false,
  merged_at: "2026-08-10T00:00:00Z",
  merge_commit_sha: exitMergeSha,
  created_at: "2026-08-09T00:00:00Z",
  user: { login: "github-actions[bot]" },
  merged_by: { login: "release-maintainer" },
  base: { ref: "minor", sha: exitBaseSha, repo: { full_name: repository } },
  head: {
    ref: "release-prerelease/minor/exit-123",
    sha: exitHeadSha,
    repo: { full_name: repository },
  },
};
const versionPull: GitHubPullRequest = {
  number: 2002,
  body: encodeMarker(marker),
  draft: false,
  merged_at: null,
  merge_commit_sha: null,
  created_at: "2026-08-10T00:01:00Z",
  user: { login: "github-actions[bot]" },
  base: { ref: "minor", sha: exitMergeSha, repo: { full_name: repository } },
  head: {
    ref: "changeset-release/minor",
    sha: versionHeadSha,
    repo: { full_name: repository },
  },
};
const status = {
  id: 10,
  state: "success" as const,
  context: "Validate release lane",
  description: releaseValidationStatusDescription("workflow_dispatch", exitHeadSha),
  target_url: `https://github.com/${repository}/actions/runs/101`,
  updated_at: "2026-08-10T00:00:30Z",
  creator: { login: "github-actions[bot]" },
};
const run = {
  id: 101,
  name: releaseValidationWorkflowName,
  path: ".github/workflows/release-pr-validation.yml",
  display_title: releaseValidationRunName(exitHeadSha),
  event: "workflow_dispatch",
  status: "completed",
  conclusion: "success",
  head_branch: "dev",
  head_sha: controlSha,
  repository: { full_name: repository },
};

function client(
  overrides: { exitPull?: GitHubPullRequest; status?: typeof status; run?: typeof run } = {},
) {
  return {
    async request<T>(path: string): Promise<T> {
      if (path.endsWith("/pulls/2001")) return (overrides.exitPull ?? exitPull) as T;
      if (path.endsWith("/actions/runs/101")) return (overrides.run ?? run) as T;
      throw new Error(`unexpected request ${path}`);
    },
    async paginate<T>(path: string): Promise<T[]> {
      if (path.endsWith(`/commits/${exitHeadSha}/statuses`)) {
        return [overrides.status ?? status] as T[];
      }
      throw new Error(`unexpected paginate ${path}`);
    },
  };
}

describe("stable promotion provenance", () => {
  test("Version base/head/control을 사람이 merge한 exact Exit PR과 validation receipt에 결속한다", async () => {
    await expect(
      verifyStablePromotionProvenance({ repository, marker, versionPull, client: client() }),
    ).resolves.toEqual(exitPull);
  });

  test("Exit merge/operation/human merge 또는 validation spoof를 거부한다", async () => {
    await expect(
      verifyStablePromotionProvenance({
        repository,
        marker,
        versionPull,
        client: client({ exitPull: { ...exitPull, merge_commit_sha: "9".repeat(40) } }),
      }),
    ).rejects.toThrow("Exit Intent");
    await expect(
      verifyStablePromotionProvenance({
        repository,
        marker,
        versionPull,
        client: client({ exitPull: { ...exitPull, merged_by: { login: "merge-bot[bot]" } } }),
      }),
    ).rejects.toThrow("Exit Intent");
    await expect(
      verifyStablePromotionProvenance({
        repository,
        marker,
        versionPull,
        client: client({ status: { ...status, creator: { login: "maintainer" } } }),
      }),
    ).rejects.toThrow("validation");
  });

  test("Version PR base가 Exit merge에서 벗어나면 API 조회 전에 거부한다", async () => {
    await expect(
      verifyStablePromotionProvenance({
        repository,
        marker,
        versionPull: { ...versionPull, base: { ...versionPull.base, sha: exitBaseSha } },
        client: client(),
      }),
    ).rejects.toThrow("identity/base/head");
  });
});
