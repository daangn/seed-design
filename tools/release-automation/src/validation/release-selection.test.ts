import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { encodeMarker } from "../core/marker";
import { recoverStablePromotionItem } from "./release-selection";

const repository = "daangn/seed-design";
const baseSha = "a".repeat(40);
const headSha = "b".repeat(40);
const controlSha = "c".repeat(40);
const runId = 77;
const pull = {
  number: 21,
  body: encodeMarker({
    schemaVersion: 1,
    type: "prerelease",
    lane: "minor",
    operation: "exit",
    operationId: "55",
    expectedBaseSha: "d".repeat(40),
    expectedHeadSha: headSha,
    controlSha,
    patchSha256: "e".repeat(64),
  }),
  draft: false,
  merged_at: "2026-08-10T00:00:00Z",
  merge_commit_sha: baseSha,
  created_at: "2026-08-10T00:00:00Z",
  user: { login: "github-actions[bot]" },
  merged_by: { login: "human" },
  base: { ref: "minor", sha: "d".repeat(40), repo: { full_name: repository } },
  head: {
    ref: "release-prerelease/minor/exit-55",
    sha: headSha,
    repo: { full_name: repository },
  },
};

function client(pulls = [pull]) {
  return {
    async paginate<T>(path: string): Promise<T[]> {
      if (path.includes("pulls?")) return pulls as T[];
      if (path.includes("/statuses")) {
        return [
          {
            id: 1,
            state: "success",
            context: "Validate release lane",
            description: `seed-release-validation:workflow_dispatch:${headSha}`,
            target_url: `https://github.com/${repository}/actions/runs/${runId}`,
            updated_at: "2026-08-10T01:00:00Z",
            creator: { login: "github-actions[bot]" },
          },
        ] as T[];
      }
      throw new Error(path);
    },
    async request<T>(): Promise<T> {
      return {
        id: runId,
        name: "Release lane PR validation",
        path: ".github/workflows/release-pr-validation.yml",
        display_title: `seed-release-validation:${headSha}`,
        event: "workflow_dispatch",
        status: "completed",
        conclusion: "success",
        head_branch: "dev",
        head_sha: controlSha,
        repository: { full_name: repository },
      } as T;
    },
  };
}

describe("exiting stable promotion recovery", () => {
  test("exit 선택과 Stable validator/publish는 sibling dormant를 각각 재확인한다", async () => {
    const [selection, generated, control, authorize] = await Promise.all([
      readFile("tools/release-automation/src/validation/release-selection.ts", "utf8"),
      readFile("tools/release-automation/src/validation/generated-pr-validation.ts", "utf8"),
      readFile("tools/release-automation/bin/control.ts", "utf8"),
      readFile("tools/release-automation/src/publish/authorize-publish-pr.ts", "utf8"),
    ]);
    expect(selection).toContain("await assertSiblingDormant(requestedLane, input.controlSha)");
    expect(selection).toContain("await assertSiblingDormant(lane, input.controlSha)");
    expect(generated).toContain("await assertDormantSibling(marker.lane)");
    expect(control).toContain("await assertDormantSibling(generated.lane)");
    expect(authorize).toContain("await assertCurrentSiblingDormant");
  });

  test("current exiting head의 유일한 human-merged Exit와 validation receipt를 복원한다", async () => {
    await expect(
      recoverStablePromotionItem({ lane: "minor", baseSha, repository, client: client() }),
    ).resolves.toEqual({
      kind: "version",
      lane: "minor",
      base_sha: baseSha,
      release_kind: "stable-promotion",
      operation_id: "55",
      exit_pr: 21,
      exit_merge_sha: baseSha,
    });
  });

  test("exact Exit가 없거나 복수면 fail-closed한다", async () => {
    await expect(
      recoverStablePromotionItem({ lane: "minor", baseSha, repository, client: client([]) }),
    ).rejects.toThrow("유일하지 않습니다");
    await expect(
      recoverStablePromotionItem({
        lane: "minor",
        baseSha,
        repository,
        client: client([pull, { ...pull, number: 22 }]),
      }),
    ).rejects.toThrow("유일하지 않습니다");
  });
});
