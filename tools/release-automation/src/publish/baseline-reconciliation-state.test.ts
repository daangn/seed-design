import { describe, expect, test } from "bun:test";
import { encodeMarker } from "../core/marker";
import { assertDevStablePublishReconciled } from "./baseline-reconciliation-state";
import { isPublishReceiptReadyForBaseline } from "./publish-state";

const repository = "daangn/seed-design";
const stableMergeSha = "a".repeat(40);
const stableHeadSha = "b".repeat(40);
const exitMergeSha = "c".repeat(40);
const baselineMergeSha = "d".repeat(40);
const baselineHeadSha = "e".repeat(40);
const devBaseSha = "f".repeat(40);
const runId = 42;
const stablePull = {
  number: 11,
  body: encodeMarker({
    schemaVersion: 1,
    type: "version",
    lane: "minor",
    releaseKind: "stable-promotion",
    operationId: "9",
    expectedBaseSha: exitMergeSha,
    expectedHeadSha: stableHeadSha,
    controlSha: devBaseSha,
    exitPr: 10,
    exitMergeSha,
  }),
  draft: false,
  merged_at: "2026-08-10T00:00:00Z",
  merge_commit_sha: stableMergeSha,
  created_at: "2026-08-10T00:00:00Z",
  user: { login: "github-actions[bot]" },
  merged_by: { login: "human" },
  base: { ref: "minor", sha: exitMergeSha, repo: { full_name: repository } },
  head: { ref: "changeset-release/minor", sha: stableHeadSha, repo: { full_name: repository } },
};
function baselinePull(target: "dev" | "major", number: number, headSha: string, mergeSha: string) {
  return {
    number,
    body: encodeMarker({
      schemaVersion: 1,
      type: "baseline",
      lane: target,
      stablePr: 11,
      stableMergeSha,
      publishRunId: runId,
      expectedBaseSha: devBaseSha,
      expectedHeadSha: headSha,
      controlSha: devBaseSha,
      versionsSha256: "1".repeat(64),
    }),
    draft: false,
    merged_at: "2026-08-10T01:00:00Z",
    merge_commit_sha: mergeSha,
    created_at: "2026-08-10T00:30:00Z",
    user: { login: "github-actions[bot]" },
    merged_by: { login: "human" },
    base: { ref: target, sha: devBaseSha, repo: { full_name: repository } },
    head: {
      ref: `release-baseline/${target}/${stableMergeSha.slice(0, 12)}-${runId}`,
      sha: headSha,
      repo: { full_name: repository },
    },
  };
}
const devBaselinePull = baselinePull("dev", 12, baselineHeadSha, baselineMergeSha);
const siblingHeadSha = "6".repeat(40);
const siblingMergeSha = "7".repeat(40);
const siblingBaselinePull = baselinePull("major", 13, siblingHeadSha, siblingMergeSha);

function mockClient(
  baselines: ReturnType<typeof baselinePull>[],
  options: { includeValidation?: boolean; includeProductionReceipt?: boolean } = {},
) {
  const { includeProductionReceipt = true, includeValidation = true } = options;
  return {
    async paginate<T>(path: string): Promise<T[]> {
      if (path.includes("base=minor")) return [stablePull] as T[];
      if (path.includes("base=major"))
        return baselines.filter((pull) => pull.base.ref === "major") as T[];
      if (path.includes("base=dev"))
        return baselines.filter((pull) => pull.base.ref === "dev") as T[];
      if (path.includes("/statuses")) {
        if (path.includes(stableMergeSha) && !includeProductionReceipt) return [];
        const validationHead = [baselineHeadSha, siblingHeadSha].find((head) =>
          path.includes(head),
        );
        if (validationHead) {
          if (!includeValidation) return [];
          const validationRunId = validationHead === baselineHeadSha ? 99 : 100;
          return [
            {
              id: 9,
              context: "Validate release lane",
              state: "success",
              description: `seed-release-validation:workflow_dispatch:${validationHead}`,
              target_url: `https://github.com/${repository}/actions/runs/${validationRunId}`,
              updated_at: "2026-08-10T02:00:00Z",
              creator: { login: "github-actions[bot]" },
            },
          ] as T[];
        }
        return [
          {
            id: 1,
            context: "seed-release/publish",
            state: "success",
            description: `seed-release-publish:${stableMergeSha}:production`,
            target_url: `https://github.com/${repository}/actions/runs/${runId}`,
            creator: { login: "github-actions[bot]" },
          },
        ] as T[];
      }
      if (path.includes("/jobs")) {
        return [
          {
            id: 2,
            run_id: runId,
            name: `Record successful queue item ${stableMergeSha}`,
            status: "completed",
            conclusion: "success",
          },
        ] as T[];
      }
      throw new Error(`unexpected paginate ${path}`);
    },
    async request<T>(path: string): Promise<T> {
      if (path === `/repos/${repository}/branches/major`) {
        return { commit: { sha: "8".repeat(40) } } as T;
      }
      if (path.endsWith("/actions/runs/99") || path.endsWith("/actions/runs/100")) {
        const validationRunId = path.endsWith("100") ? 100 : 99;
        const validationHead = validationRunId === 100 ? siblingHeadSha : baselineHeadSha;
        return {
          id: validationRunId,
          name: "Release lane PR validation",
          path: ".github/workflows/release-pr-validation.yml",
          display_title: `seed-release-validation:${validationHead}`,
          event: "workflow_dispatch",
          status: "completed",
          conclusion: "success",
          head_branch: "dev",
          head_sha: devBaseSha,
          repository: { full_name: repository },
        } as T;
      }
      if (path.endsWith(`/actions/runs/${runId}`)) {
        return {
          id: runId,
          name: "Release publish",
          path: ".github/workflows/release-publish.yml",
          event: "pull_request_target",
          status: "completed",
          conclusion: "success",
          head_branch: "changeset-release/minor",
          head_sha: stableHeadSha,
          repository: { full_name: repository },
        } as T;
      }
      if (path.includes("/compare/")) return { status: "ahead" } as T;
      throw new Error(`unexpected request ${path}`);
    },
  };
}

describe("dev baseline reconciliation receipt gate", () => {
  test("in-progress workflow에서도 completed record job에 결속된 exact production receipt만 인정한다", () => {
    const status = {
      id: 1,
      context: "seed-release/publish",
      state: "success",
      description: `seed-release-publish:${stableMergeSha}:production`,
      target_url: `https://github.com/${repository}/actions/runs/${runId}`,
      creator: { login: "github-actions[bot]" },
    };
    const run = {
      id: runId,
      name: "Release publish",
      path: ".github/workflows/release-publish.yml",
      event: "pull_request_target",
      status: "in_progress",
      conclusion: null,
      head_branch: "changeset-release/minor",
      head_sha: stableHeadSha,
      repository: { full_name: repository },
    };
    const jobs = [
      {
        id: 2,
        run_id: runId,
        name: `Record successful queue item ${stableMergeSha}`,
        status: "completed",
        conclusion: "success",
      },
    ];
    expect(
      isPublishReceiptReadyForBaseline(
        status,
        run,
        jobs,
        repository,
        stableMergeSha,
        runId,
        "minor",
        stableHeadSha,
      ),
    ).toBe(true);
    expect(
      isPublishReceiptReadyForBaseline(
        status,
        { ...run, event: "schedule", head_branch: "dev", head_sha: undefined },
        jobs,
        repository,
        stableMergeSha,
        runId,
        "minor",
        stableHeadSha,
      ),
    ).toBe(true);
    expect(
      isPublishReceiptReadyForBaseline(
        status,
        run,
        [{ ...jobs[0], conclusion: "failure" }],
        repository,
        stableMergeSha,
        runId,
        "minor",
        stableHeadSha,
      ),
    ).toBe(false);
  });

  test("production stable receipt 뒤 baseline PR merge 전 dev stable publish를 막는다", async () => {
    expect(
      assertDevStablePublishReconciled({
        repository,
        currentDevSha: "9".repeat(40),
        client: mockClient([]),
      }),
    ).rejects.toThrow("baseline reconciliation PR");
  });

  test("merged Stable Version PR에 production receipt가 아직 없으면 pending promotion으로 막는다", async () => {
    await expect(
      assertDevStablePublishReconciled({
        repository,
        currentDevSha: "9".repeat(40),
        client: mockClient([], { includeProductionReceipt: false }),
      }),
    ).rejects.toThrow("exact production publish receipt가 아직 없습니다");
  });

  test("현재 게시 중인 exact Stable merge만 self pending 예외로 허용한다", async () => {
    await expect(
      assertDevStablePublishReconciled({
        repository,
        currentDevSha: "9".repeat(40),
        client: mockClient([], { includeProductionReceipt: false }),
        allowedPendingStableMergeSha: stableMergeSha,
      }),
    ).resolves.toBeUndefined();
  });

  test("현재 게시 merge 예외가 이전 pending stable promotion을 허용하지 않는다", async () => {
    await expect(
      assertDevStablePublishReconciled({
        repository,
        currentDevSha: "9".repeat(40),
        client: mockClient([], { includeProductionReceipt: false }),
        allowedPendingStableMergeSha: "0".repeat(40),
      }),
    ).rejects.toThrow("exact production publish receipt가 아직 없습니다");
  });

  test("exact run receipt에 결속된 human merge가 current dev 조상이면 다시 허용한다", async () => {
    await expect(
      assertDevStablePublishReconciled({
        repository,
        currentDevSha: "9".repeat(40),
        client: mockClient([devBaselinePull, siblingBaselinePull]),
      }),
    ).resolves.toBeUndefined();
  });

  test("merged baseline에 trusted validation receipt가 없으면 인정하지 않는다", async () => {
    await expect(
      assertDevStablePublishReconciled({
        repository,
        currentDevSha: "9".repeat(40),
        client: mockClient([devBaselinePull, siblingBaselinePull], { includeValidation: false }),
      }),
    ).rejects.toThrow("baseline reconciliation PR");
  });
});
