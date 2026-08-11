import { describe, expect, test } from "bun:test";
import type { GitHubPullRequest } from "../core/github";
import { encodeMarker } from "../core/marker";
import type { ReleaseMarker } from "../core/types";
import {
  promotionSourceManifestDigest,
  selectActiveEnterPull,
  selectPromotionSources,
  type PromotionFirstParentCommit,
  type SelectPromotionSourcesInput,
} from "./source-selection";

const repository = "daangn/seed-design";
const sha = (character: string) => character.repeat(40);
const enterMergeSha = sha("a");
const generatedMergeSha = sha("b");
const firstSourceMergeSha = sha("c");
const exitBaseSha = sha("d");

function pull(
  number: number,
  mergeSha: string,
  overrides: Partial<GitHubPullRequest> = {},
): GitHubPullRequest {
  return {
    number,
    body: "일반 변경",
    draft: false,
    merged_at: "2026-08-10T00:00:00Z",
    merge_commit_sha: mergeSha,
    created_at: "2026-08-09T00:00:00Z",
    user: { login: "developer" },
    merged_by: { login: "maintainer" },
    base: { ref: "minor", sha: sha("9"), repo: { full_name: repository } },
    head: { ref: `feature/${number}`, sha: sha("8"), repo: { full_name: repository } },
    ...overrides,
  };
}

function generatedPull(number: number, mergeSha: string): GitHubPullRequest {
  const marker: ReleaseMarker = {
    schemaVersion: 1,
    type: "sync",
    lane: "minor",
    targetLane: "minor",
    sourceRepository: repository,
    sourcePr: 100,
  };
  return pull(number, mergeSha, {
    body: encodeMarker(marker),
    user: { login: "github-actions[bot]" },
    merged_by: { login: "github-actions[bot]" },
    head: {
      ref: "release-sync/dev-100-to-minor",
      sha: sha("7"),
      repo: { full_name: repository },
    },
  });
}

function interval(...commits: string[]): PromotionFirstParentCommit[] {
  let parent = enterMergeSha;
  return commits.map((commit) => {
    const result = { sha: commit, parents: [parent] };
    parent = commit;
    return result;
  });
}

function validInput(): SelectPromotionSourcesInput {
  return {
    repository,
    sourceLane: "minor",
    enterMergeSha,
    exitBaseSha,
    firstParentCommits: interval(generatedMergeSha, firstSourceMergeSha, exitBaseSha),
    pulls: [
      generatedPull(200, generatedMergeSha),
      pull(201, firstSourceMergeSha),
      pull(202, exitBaseSha),
    ],
    sourceDiffs: new Map([
      [201, "diff --git a/a.ts b/a.ts\n"],
      [202, "diff --git a/b.ts b/b.ts\n"],
    ]),
  };
}

describe("promotion source selection", () => {
  test("Enter..Exit base first-parent 전체를 FIFO generated/source manifest로 분류한다", () => {
    const selected = selectPromotionSources(validInput());

    expect(selected.manifest.commits).toEqual([
      {
        kind: "generated",
        pr: 200,
        mergeSha: generatedMergeSha,
        generatedType: "sync",
      },
      {
        kind: "source",
        pr: 201,
        mergeSha: firstSourceMergeSha,
        patchSha256: "d352d4c9965d18fca9cecc2de065b0fd315871a9fa55897291e2aeda0f699d7d",
      },
      {
        kind: "source",
        pr: 202,
        mergeSha: exitBaseSha,
        patchSha256: "7d4d80af2ac827ed2f85f2f01185faa93ce67c6e3bb841ba3c83e9c32dbb55e0",
      },
    ]);
    expect(selected.sources.map((source) => source.pr)).toEqual([201, 202]);
    expect(selected.manifestSha256).toBe(promotionSourceManifestDigest(selected.manifest));

    const changed = validInput();
    changed.sourceDiffs = new Map(changed.sourceDiffs).set(202, "changed diff");
    expect(selectPromotionSources(changed).manifestSha256).not.toBe(selected.manifestSha256);
  });

  test("직접 push 또는 rebase merge로 생긴 매핑되지 않은 commit을 거부한다", () => {
    const directPush = validInput();
    directPush.pulls = directPush.pulls.filter((candidate) => candidate.number !== 201);
    expect(() => selectPromotionSources(directPush)).toThrow("direct push 또는 rebase merge");

    const rebased = validInput();
    rebased.firstParentCommits = interval(sha("e"), exitBaseSha);
    rebased.pulls = [pull(202, exitBaseSha)];
    rebased.sourceDiffs = new Map([[202, "diff"]]);
    expect(() => selectPromotionSources(rebased)).toThrow("direct push 또는 rebase merge");
  });

  test("merge commit과 끊기거나 불완전한 first-parent 구간을 거부한다", () => {
    const mergeCommit = validInput();
    mergeCommit.firstParentCommits = [{ sha: exitBaseSha, parents: [enterMergeSha, sha("e")] }];
    mergeCommit.pulls = [pull(202, exitBaseSha)];
    mergeCommit.sourceDiffs = new Map([[202, "diff"]]);
    expect(() => selectPromotionSources(mergeCommit)).toThrow("squash commit");

    const incomplete = validInput();
    incomplete.firstParentCommits = interval(generatedMergeSha, firstSourceMergeSha);
    expect(() => selectPromotionSources(incomplete)).toThrow("exact Enter merge부터 Exit base");
  });

  test("commit 하나에 PR이 여러 개 연결되면 ambiguous mapping으로 거부한다", () => {
    const ambiguous = validInput();
    ambiguous.pulls = [
      ...ambiguous.pulls,
      pull(999, firstSourceMergeSha, { head: { ...pull(999, firstSourceMergeSha).head } }),
    ];
    expect(() => selectPromotionSources(ambiguous)).toThrow("merged PR이 여러 개");
  });

  test("다른 base/repository와 bot source 및 malformed generated marker를 거부한다", () => {
    const wrongBase = validInput();
    wrongBase.pulls = wrongBase.pulls.map((candidate) =>
      candidate.number === 201
        ? pull(201, firstSourceMergeSha, {
            base: { ref: "major", sha: sha("9"), repo: { full_name: repository } },
          })
        : candidate,
    );
    expect(() => selectPromotionSources(wrongBase)).toThrow("exact daangn/seed-design:minor");

    const bot = validInput();
    bot.pulls = bot.pulls.map((candidate) =>
      candidate.number === 201
        ? pull(201, firstSourceMergeSha, { user: { login: "dependabot[bot]" } })
        : candidate,
    );
    expect(() => selectPromotionSources(bot)).toThrow("사람이 작성하고 merge한 source PR");

    const malformed = validInput();
    malformed.pulls = malformed.pulls.map((candidate) =>
      candidate.number === 201
        ? pull(201, firstSourceMergeSha, { body: "<!-- seed-release:{broken} -->" })
        : candidate,
    );
    expect(() => selectPromotionSources(malformed)).toThrow("해석할 수 없는 generated marker");
  });

  test("source diff 누락·잉여를 거부하고 빈 active 주기는 허용한다", () => {
    const missing = validInput();
    missing.sourceDiffs = new Map([[201, "diff"]]);
    expect(() => selectPromotionSources(missing)).toThrow("source PR #202");

    const extra = validInput();
    extra.sourceDiffs = new Map(extra.sourceDiffs).set(999, "diff");
    expect(() => selectPromotionSources(extra)).toThrow("#999");

    const empty = selectPromotionSources({
      repository,
      sourceLane: "major",
      enterMergeSha,
      exitBaseSha: enterMergeSha,
      firstParentCommits: [],
      pulls: [],
      sourceDiffs: new Map(),
    });
    expect(empty.sources).toEqual([]);
    expect(empty.manifest.commits).toEqual([]);
  });
});

describe("active prerelease Enter selection", () => {
  function transitionPull(
    number: number,
    operation: "enter" | "exit",
    mergeSha: string,
  ): GitHubPullRequest {
    const marker: ReleaseMarker = {
      schemaVersion: 1,
      type: "prerelease",
      lane: "minor",
      operation,
      operationId: String(number),
      expectedBaseSha: sha("6"),
      expectedHeadSha: sha("7"),
      controlSha: sha("8"),
      patchSha256: "9".repeat(64),
      ...(operation === "exit" ? { enterPr: number - 1, enterMergeSha: sha("5") } : {}),
    };
    return pull(number, mergeSha, {
      body: encodeMarker(marker),
      user: { login: "github-actions[bot]" },
      merged_by: { login: "maintainer" },
      head: {
        ref: `release-prerelease/minor/${operation}-${number}`,
        sha: marker.expectedHeadSha ?? "",
        repo: { full_name: repository },
      },
    });
  }

  test("first-parent history의 마지막 교대 transition인 Enter를 선택한다", () => {
    const firstEnter = sha("1");
    const firstExit = sha("2");
    const activeEnter = sha("3");
    const selected = selectActiveEnterPull({
      repository,
      sourceLane: "minor",
      currentFirstParentHistory: [sha("0"), firstEnter, firstExit, activeEnter, sha("4")],
      pulls: [
        transitionPull(100, "enter", firstEnter),
        transitionPull(101, "exit", firstExit),
        transitionPull(102, "enter", activeEnter),
      ],
    });
    expect(selected.pull.number).toBe(102);
    expect(selected.mergeSha).toBe(activeEnter);
  });

  test("마지막 transition이 Exit이거나 순서가 깨지면 거부한다", () => {
    const firstEnter = sha("1");
    const firstExit = sha("2");
    expect(() =>
      selectActiveEnterPull({
        repository,
        sourceLane: "minor",
        currentFirstParentHistory: [firstEnter, firstExit],
        pulls: [transitionPull(100, "enter", firstEnter), transitionPull(101, "exit", firstExit)],
      }),
    ).toThrow("마지막 trusted prerelease transition이 Enter");
    expect(() =>
      selectActiveEnterPull({
        repository,
        sourceLane: "minor",
        currentFirstParentHistory: [firstEnter, sha("3")],
        pulls: [transitionPull(100, "enter", firstEnter), transitionPull(102, "enter", sha("3"))],
      }),
    ).toThrow("교대로 이어지지 않습니다");
  });
});
