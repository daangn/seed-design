import { describe, expect, test } from "bun:test";
import type { ReleaseMarker } from "../core/types";
import {
  hasOnlyAutomationCommits,
  hasCurrentSyncControlPlane,
  generatedMarkerForPull,
  hasTrustedSyncReceipt,
  hasTrustedSyncAlertComment,
  isCompleteSyncMarker,
  isControlShaMarker,
  isDirectSyncHead,
  isWorkflowRunBoundToPull,
  latestValidationRun,
  nextSyncAttemptBranch,
  parseSyncSkipCommand,
  planSyncAlert,
  selectTrustedGeneratedPullForHead,
  selectTrustedSyncPullForHead,
  shouldDispatchSyncValidation,
  trustedSyncMarkerForPull,
  type ValidationWorkflowRun,
} from "./sync-policy";

const threshold = Date.parse("2026-08-08T00:00:00.000Z");

function run(overrides: Partial<ValidationWorkflowRun> = {}): ValidationWorkflowRun {
  const headSha = overrides.head_sha ?? "a".repeat(40);
  return {
    id: 1,
    name: `seed-release-validation:lane:${headSha}`,
    event: "pull_request",
    status: "completed",
    conclusion: "success",
    head_sha: headSha,
    created_at: "2026-08-07T00:00:00.000Z",
    updated_at: "2026-08-09T00:00:00.000Z",
    html_url: "https://github.com/daangn/seed-design/actions/runs/1",
    ...overrides,
  };
}

describe("sync workflow 신뢰 정책", () => {
  test("현재 head의 최신 release validation run만 선택한다", () => {
    const currentHead = "a".repeat(40);
    const latest = latestValidationRun(
      [
        run({ id: 10, updated_at: "2026-08-08T01:00:00.000Z" }),
        run({ id: 11, updated_at: "2026-08-08T02:00:00.000Z" }),
        run({ id: 12, name: "Other workflow", updated_at: "2026-08-08T03:00:00.000Z" }),
        run({ id: 13, head_sha: "b".repeat(40), updated_at: "2026-08-08T04:00:00.000Z" }),
      ],
      currentHead,
    );

    expect(latest?.id).toBe(11);
  });

  test.each([
    "action_required",
    "failure",
    "failed",
    "cancelled",
    "stale",
  ])("ready PR의 %s 결론을 즉시 blocker로 분류한다", (conclusion) => {
    expect(
      planSyncAlert({
        draft: false,
        pullCreatedAt: "2026-08-09T00:00:00.000Z",
        threshold,
        validationRun: run({ conclusion }),
      }),
    ).toMatchObject({ kind: `validation-${conclusion}` });
  });

  test("검증 누락, 장기 실행, 성공 후 merge 정지를 구분한다", () => {
    expect(
      planSyncAlert({
        draft: false,
        pullCreatedAt: "2026-08-07T00:00:00.000Z",
        threshold,
        validationRun: null,
      }),
    ).toMatchObject({ kind: "validation-missing" });
    expect(
      planSyncAlert({
        draft: false,
        pullCreatedAt: "2026-08-07T00:00:00.000Z",
        threshold,
        validationRun: run({
          status: "in_progress",
          conclusion: null,
          updated_at: "2026-08-07T23:59:00.000Z",
        }),
      }),
    ).toMatchObject({ kind: "validation-stalled" });
    expect(
      planSyncAlert({
        draft: false,
        pullCreatedAt: "2026-08-07T00:00:00.000Z",
        threshold,
        validationRun: run({ updated_at: "2026-08-07T23:59:00.000Z" }),
      }),
    ).toMatchObject({ kind: "merge-stalled" });
  });

  test("dispatch 검증은 missing/terminal/stale success만 재호출하고 실행 중/최근 성공은 기다린다", () => {
    expect(shouldDispatchSyncValidation(null)).toBe(true);
    expect(
      shouldDispatchSyncValidation(run({ event: "workflow_dispatch", conclusion: "failure" })),
    ).toBe(true);
    expect(
      shouldDispatchSyncValidation(
        run({ event: "workflow_dispatch", status: "in_progress", conclusion: null }),
      ),
    ).toBe(false);
    expect(
      shouldDispatchSyncValidation(
        run({ event: "workflow_dispatch", conclusion: "success" }),
        threshold,
      ),
    ).toBe(false);
    expect(
      shouldDispatchSyncValidation(
        run({
          event: "workflow_dispatch",
          conclusion: "success",
          updated_at: "2026-08-07T23:59:00.000Z",
        }),
        threshold,
      ),
    ).toBe(true);
  });

  test("최근 정상 run과 임계시간 전 draft에는 알리지 않는다", () => {
    expect(
      planSyncAlert({
        draft: false,
        pullCreatedAt: "2026-08-09T00:00:00.000Z",
        threshold,
        validationRun: run(),
      }),
    ).toBeNull();
    expect(
      planSyncAlert({
        draft: true,
        pullCreatedAt: "2026-08-09T00:00:00.000Z",
        threshold,
        validationRun: null,
      }),
    ).toBeNull();
  });

  test("GitHub가 확인한 automation login만 신뢰하고 email spoof는 거부한다", () => {
    expect(hasOnlyAutomationCommits([{ author: { login: "github-actions[bot]" } }])).toBe(true);
    expect(
      hasOnlyAutomationCommits([
        {
          author: { login: "human" },
          commit: {
            author: { email: "41898282+github-actions[bot]@users.noreply.github.com" },
          },
        },
      ]),
    ).toBe(false);
    expect(hasOnlyAutomationCommits([])).toBe(false);
  });

  test("automation bot이 작성한 정확한 alert marker만 중복으로 인정한다", () => {
    const marker = "<!-- seed-release-sync-alert:validation-failure -->";
    expect(
      hasTrustedSyncAlertComment(
        [{ body: marker, user: { login: "github-actions[bot]" } }],
        [marker],
      ),
    ).toBe(true);
    expect(hasTrustedSyncAlertComment([{ body: marker, user: { login: "human" } }], [marker])).toBe(
      false,
    );
  });

  test("검증 run SHA와 현재 PR SHA를 정확히 결속한다", () => {
    const head = "a".repeat(40);
    expect(isWorkflowRunBoundToPull(head, head)).toBe(true);
    expect(isWorkflowRunBoundToPull("b".repeat(40), head)).toBe(false);
    expect(isWorkflowRunBoundToPull("", head)).toBe(false);
    const base = "c".repeat(40);
    expect(isDirectSyncHead(`${head} ${base}`, head, base)).toBe(true);
    expect(isDirectSyncHead(`${head} ${"d".repeat(40)}`, head, base)).toBe(false);
    expect(isDirectSyncHead(`${head} ${base} ${"e".repeat(40)}`, head, base)).toBe(false);
  });

  test("source와 hash와 expected head가 완전한 sync marker만 승인한다", () => {
    const marker: ReleaseMarker = {
      schemaVersion: 1,
      type: "sync",
      lane: "minor",
      targetLane: "minor",
      sourceRepository: "daangn/seed-design",
      sourcePr: 1926,
      patchSha256: "a".repeat(64),
      expectedHeadSha: "b".repeat(40),
      targetBump: "minor",
      controlSha: "c".repeat(40),
      controlTreeSha256: "d".repeat(64),
    };
    expect(isCompleteSyncMarker(marker, "daangn/seed-design")).toBe(true);
    expect(isControlShaMarker(marker)).toBe(true);
    expect(isControlShaMarker({ ...marker, controlSha: "not-a-sha" })).toBe(false);
    expect(hasCurrentSyncControlPlane(marker, "d".repeat(64))).toBe(true);
    expect(hasCurrentSyncControlPlane(marker, "e".repeat(64))).toBe(false);
    expect(
      isCompleteSyncMarker(
        { ...marker, sourceRepository: "fork/seed-design" },
        "daangn/seed-design",
      ),
    ).toBe(false);
    expect(isCompleteSyncMarker({ ...marker, patchSha256: "short" }, "daangn/seed-design")).toBe(
      false,
    );

    const pull = {
      number: 2000,
      body: `<!-- seed-release:${JSON.stringify(marker)} -->`,
      user: { login: "github-actions[bot]" },
      base: { ref: "minor", repo: { full_name: "daangn/seed-design" } },
      head: {
        ref: "release-sync/dev-1926-to-minor",
        sha: marker.expectedHeadSha ?? "",
        repo: { full_name: "daangn/seed-design" },
      },
      state: "open",
      draft: false,
      merged_at: null,
    };
    expect(trustedSyncMarkerForPull(pull, "daangn/seed-design")).toMatchObject(marker);
    expect(
      trustedSyncMarkerForPull({ ...pull, user: { login: "human" } }, "daangn/seed-design"),
    ).toBeNull();
    expect(
      trustedSyncMarkerForPull(
        { ...pull, head: { ...pull.head, ref: "release-sync/not-exact" } },
        "daangn/seed-design",
      ),
    ).toBeNull();
    expect(
      trustedSyncMarkerForPull(
        { ...pull, head: { ...pull.head, sha: "e".repeat(40) } },
        "daangn/seed-design",
      ),
    ).toBeNull();
    expect(
      selectTrustedSyncPullForHead(
        [pull],
        "daangn/seed-design",
        marker.expectedHeadSha ?? "",
        pull.head.ref,
      ),
    ).toBe(pull);
    expect(
      selectTrustedSyncPullForHead(
        [{ ...pull, state: "closed" }],
        "daangn/seed-design",
        marker.expectedHeadSha ?? "",
      ),
    ).toBeNull();
    expect(
      selectTrustedGeneratedPullForHead(
        [pull],
        "daangn/seed-design",
        marker.expectedHeadSha ?? "",
        pull.head.ref,
      ),
    ).toMatchObject({ pull: { number: 2000 }, marker: { type: "sync" } });
  });

  test("모든 generated PR type을 exact bot/repository/ref/head marker로만 선택한다", () => {
    const headSha = "f".repeat(40);
    const repository = "daangn/seed-design";
    const generated = [
      { type: "version", lane: "dev", headRef: "changeset-release/dev", fields: {} },
      {
        type: "sync",
        lane: "minor",
        headRef: "release-sync/dev-1926-to-minor",
        fields: { targetLane: "minor", sourceRepository: repository, sourcePr: 1926 },
      },
      {
        type: "activation",
        lane: "dev",
        headRef: "release-activation/enable-sync-100",
        fields: { tag: "enable-sync" },
      },
      {
        type: "bootstrap",
        lane: "minor",
        headRef: "release-bootstrap/minor-100",
        fields: { targetLane: "minor", tag: "beta" },
      },
      {
        type: "baseline",
        lane: "major",
        headRef: `release-baseline/major/${"a".repeat(12)}-100`,
        fields: {
          stablePr: 1956,
          stableMergeSha: "a".repeat(40),
          publishRunId: 100,
          expectedBaseSha: "b".repeat(40),
          codeMergeSha: "b".repeat(40),
          expectedCodeTreeSha: "e".repeat(40),
          expectedBaselineTreeSha: "f".repeat(40),
          promotionManifestSha256: "1".repeat(64),
          stablePatchSha256: "2".repeat(64),
          controlSha: "c".repeat(40),
          versionsSha256: "d".repeat(64),
        },
      },
      {
        type: "code-promotion",
        lane: "dev",
        headRef: `release-code-promotion/dev/1956-${"1".repeat(12)}`,
        fields: {
          sourceLane: "major",
          stablePr: 1956,
          stableVersionHeadSha: "2".repeat(40),
          enterPr: 1900,
          enterMergeSha: "3".repeat(40),
          exitPr: 1955,
          exitBaseSha: "4".repeat(40),
          exitMergeSha: "5".repeat(40),
          expectedBaseSha: "6".repeat(40),
          expectedCodeTreeSha: "7".repeat(40),
          expectedBaselineTreeSha: "8".repeat(40),
          promotionManifestSha256: "1".repeat(64),
          patchSha256: "9".repeat(64),
          stablePatchSha256: "a".repeat(64),
          controlSha: "b".repeat(40),
          controlTreeSha256: "c".repeat(64),
        },
      },
    ] as const;

    for (const { type, lane, headRef, fields } of generated) {
      const marker: ReleaseMarker = {
        schemaVersion: 1,
        type: type as ReleaseMarker["type"],
        lane,
        expectedHeadSha: headSha,
        ...fields,
      };
      const pull = {
        number: 2100,
        body: `<!-- seed-release:${JSON.stringify(marker)} -->`,
        user: { login: "github-actions[bot]" },
        base: { ref: lane, repo: { full_name: repository } },
        head: { ref: headRef, sha: headSha, repo: { full_name: repository } },
        state: "open",
        draft: false,
        merged_at: null,
      };

      expect(selectTrustedGeneratedPullForHead([pull], repository, headSha, headRef)).toMatchObject(
        {
          marker: { type },
        },
      );
      expect(
        selectTrustedGeneratedPullForHead(
          [{ ...pull, head: { ...pull.head, repo: { full_name: "fork/seed-design" } } }],
          repository,
          headSha,
          headRef,
        ),
      ).toBeNull();
      expect(
        selectTrustedGeneratedPullForHead(
          [{ ...pull, head: { ...pull.head, ref: `${headRef}-spoof` } }],
          repository,
          headSha,
          `${headRef}-spoof`,
        ),
      ).toBeNull();
    }

    const codePromotion = generated.at(-1);
    if (!codePromotion) throw new Error("code promotion fixture가 없습니다.");
    const codeMarker: ReleaseMarker = {
      schemaVersion: 1,
      type: "code-promotion",
      lane: "dev",
      expectedHeadSha: headSha,
      ...codePromotion.fields,
    };
    const draftPromotion = {
      number: 2199,
      body: `<!-- seed-release:${JSON.stringify(codeMarker)} -->`,
      user: { login: "github-actions[bot]" },
      base: { ref: "dev", repo: { full_name: repository } },
      head: { ref: codePromotion.headRef, sha: headSha, repo: { full_name: repository } },
      state: "open",
      draft: true,
      merged_at: null,
    };
    expect(
      selectTrustedGeneratedPullForHead(
        [draftPromotion],
        repository,
        headSha,
        codePromotion.headRef,
      ),
    ).toBeNull();
    expect(
      selectTrustedGeneratedPullForHead(
        [draftPromotion],
        repository,
        headSha,
        codePromotion.headRef,
        { allowDraftCodePromotion: true },
      ),
    ).toMatchObject({ marker: { type: "code-promotion" } });

    const legacyVersion = {
      number: 2200,
      body: "Version Packages",
      user: { login: "github-actions[bot]" },
      base: { ref: "dev", repo: { full_name: repository } },
      head: { ref: "changeset-release/dev", sha: headSha, repo: { full_name: repository } },
      state: "open",
      draft: false,
      merged_at: null,
    };
    expect(selectTrustedGeneratedPullForHead([legacyVersion], repository, headSha)).toBeNull();
  });

  test("sync receipt는 bot의 exact first-line schema만 인정한다", () => {
    const key = "daangn/seed-design#1926->minor";
    const marker = `<!-- seed-release-sync:${key}:no-op -->`;
    expect(
      hasTrustedSyncReceipt(
        [{ body: `${marker}\nminor에는 이미 반영됨`, user: { login: "github-actions[bot]" } }],
        key,
      ),
    ).toBe(true);
    expect(hasTrustedSyncReceipt([{ body: marker, user: { login: "human" } }], key)).toBe(false);
    expect(
      hasTrustedSyncReceipt(
        [
          {
            body: `prefix ${marker}`,
            user: { login: "github-actions[bot]" },
          },
        ],
        key,
      ),
    ).toBe(false);
  });

  test("사람 PR의 marker 인용과 generated-like branch를 일반 source에서 제외하지 않는다", () => {
    const repository = "daangn/seed-design";
    const marker: ReleaseMarker = {
      schemaVersion: 1,
      type: "version",
      lane: "dev",
      expectedHeadSha: "a".repeat(40),
    };
    const pull = {
      body: `문서 예시\n<!-- seed-release:${JSON.stringify(marker)} -->`,
      user: { login: "human" },
      base: { ref: "dev", repo: { full_name: repository } },
      head: {
        ref: "changeset-release/dev",
        sha: marker.expectedHeadSha ?? "",
        repo: { full_name: repository },
      },
    };
    expect(generatedMarkerForPull(pull, repository)).toBeNull();
    expect(
      generatedMarkerForPull(
        {
          ...pull,
          body: "ordinary PR",
          head: { ...pull.head, ref: "release-sync-user-feature" },
        },
        repository,
      ),
    ).toBeNull();
    expect(
      generatedMarkerForPull({ ...pull, user: { login: "github-actions[bot]" } }, repository),
    ).toEqual(marker);
  });

  test("sync skip은 trusted comment의 exact first-line command grammar만 해석한다", () => {
    expect(
      parseSyncSkipCommand(
        "/release-sync skip target=major reason=manual-conflict-resolution evidence=#1948\n상세 설명",
      ),
    ).toEqual({
      target: "major",
      reason: "manual-conflict-resolution",
      evidence: "#1948",
    });
    expect(
      parseSyncSkipCommand("/release-sync skip target=minor reason=resolved evidence=abcdef1"),
    ).toEqual({ target: "minor", reason: "resolved", evidence: "abcdef1" });
    for (const invalid of [
      "do not /release-sync skip target=major reason=resolved evidence=#1948",
      "> /release-sync skip target=major reason=resolved evidence=#1948",
      "/release-sync skip target=major reason=resolved evidence=#1948 extra=true",
      "/release-sync skip target=dev reason=resolved evidence=#1948",
      "/release-sync skip target=major reason=two words evidence=#1948",
      "/release-sync skip target=major reason=resolved evidence=#0",
    ]) {
      expect(parseSyncSkipCommand(invalid)).toBeNull();
    }
  });

  test("closed-unmerged attempt의 branch를 재사용하지 않는다", () => {
    const base = "release-sync/dev-1926-to-minor";
    expect(nextSyncAttemptBranch(base, [])).toBe(base);
    expect(nextSyncAttemptBranch(base, [base])).toBe(`${base}-attempt-2`);
    expect(nextSyncAttemptBranch(base, [base, `${base}-attempt-2`])).toBe(`${base}-attempt-3`);
  });
});
