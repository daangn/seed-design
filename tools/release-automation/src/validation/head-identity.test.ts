import { describe, expect, test } from "bun:test";
import { assertUniqueOpenReleasePullForHead } from "./head-identity";

const repository = "daangn/seed-design";
const headSha = "a".repeat(40);

function pull(number: number, lane: string, state: "open" | "closed" = "open") {
  return {
    number,
    state,
    body: null,
    draft: false,
    merged_at: null,
    merge_commit_sha: null,
    created_at: "2026-08-10T00:00:00Z",
    user: { login: "human" },
    base: { ref: lane, sha: "b".repeat(40), repo: { full_name: repository } },
    head: { ref: "feature", sha: headSha, repo: { full_name: repository } },
  };
}

function client(pulls: ReturnType<typeof pull>[]) {
  return {
    async paginate<T>(): Promise<T[]> {
      return pulls as T[];
    },
  };
}

describe("release validation head identity", () => {
  test("exact open release PR 하나만 SHA status 대상이 된다", async () => {
    await expect(
      assertUniqueOpenReleasePullForHead({
        client: client([pull(10, "dev"), pull(9, "other"), pull(8, "minor", "closed")]),
        repository,
        pullNumber: 10,
        headSha,
      }),
    ).resolves.toBeUndefined();
  });

  test("같은 SHA의 다른 release PR이나 다른 PR 번호를 거부한다", async () => {
    await expect(
      assertUniqueOpenReleasePullForHead({
        client: client([pull(10, "dev"), pull(11, "minor")]),
        repository,
        pullNumber: 10,
        headSha,
      }),
    ).rejects.toThrow("같은 head SHA");
    await expect(
      assertUniqueOpenReleasePullForHead({
        client: client([pull(10, "dev")]),
        repository,
        pullNumber: 11,
        headSha,
      }),
    ).rejects.toThrow("같은 head SHA");
  });
});
