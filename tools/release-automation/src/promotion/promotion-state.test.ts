import { describe, expect, test } from "bun:test";
import { assertNoCompetingOpenStablePromotion } from "./promotion-state";
import { promotionStatusContext, promotionStatusDescription } from "./promotion-status";

const repository = "daangn/seed-design";
const headSha = "a".repeat(40);
const malformedStablePull = {
  number: 1956,
  body: "marker was edited",
  draft: true,
  merged_at: null,
  merge_commit_sha: null,
  created_at: "2026-08-10T00:00:00Z",
  user: { login: "github-actions[bot]" },
  base: { ref: "minor", sha: "b".repeat(40), repo: { full_name: repository } },
  head: { ref: "changeset-release/minor", sha: headSha, repo: { full_name: repository } },
};

function client(includeStatus: boolean) {
  return {
    async paginate<T>(path: string): Promise<T[]> {
      if (path.includes("pulls?state=open&base=minor")) return [malformedStablePull] as T[];
      if (path.includes("pulls?state=open&base=major")) return [];
      if (path.includes("/statuses") && includeStatus) {
        return [
          {
            id: 1,
            state: "pending",
            context: promotionStatusContext,
            description: promotionStatusDescription(1956, "c".repeat(64)),
            target_url: null,
            updated_at: "2026-08-10T00:01:00Z",
            creator: { login: "github-actions[bot]" },
          },
        ] as T[];
      }
      if (path.includes("/statuses")) return [];
      throw new Error(path);
    },
  };
}

describe("open stable promotion lock", () => {
  test("durable receipt가 있는 reserved Stable PR은 body marker가 손상돼도 blocker다", async () => {
    await expect(
      assertNoCompetingOpenStablePromotion({ repository, client: client(true) }),
    ).rejects.toThrow("#1956");
  });

  test("일반 beta Version PR처럼 marker와 promotion receipt가 모두 없으면 blocker가 아니다", async () => {
    await expect(
      assertNoCompetingOpenStablePromotion({ repository, client: client(false) }),
    ).resolves.toBeUndefined();
  });
});
