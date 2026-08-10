import { describe, expect, test } from "bun:test";
import {
  encodeMarker,
  hasExpectedGeneratedHeadRef,
  isBaselineMarker,
  isPrereleaseMarker,
  isStablePromotionMarker,
  parseMarker,
  validateGeneratedPr,
} from "./marker";
import type { PullRequestIdentity, ReleaseMarker } from "./types";

const baseSha = "a".repeat(40);
const headSha = "b".repeat(40);
const controlSha = "c".repeat(40);
const mergeSha = "d".repeat(40);
const repository = "daangn/seed-design";

describe("prerelease generated marker", () => {
  const marker: ReleaseMarker = {
    schemaVersion: 1,
    type: "prerelease",
    lane: "minor",
    operation: "exit",
    operationId: "123",
    expectedBaseSha: baseSha,
    expectedHeadSha: headSha,
    controlSha,
    patchSha256: "e".repeat(64),
  };
  const identity: PullRequestIdentity = {
    author: "github-actions[bot]",
    body: encodeMarker(marker),
    baseRef: "minor",
    headRef: "release-prerelease/minor/exit-123",
    baseRepository: repository,
    headRepository: repository,
  };

  test("operation과 exact branch/base/head/control/patch를 모두 결속한다", () => {
    const parsed = parseMarker(identity.body);
    expect(parsed && isPrereleaseMarker(parsed)).toBe(true);
    expect(validateGeneratedPr(identity)).toEqual(marker);
    expect(hasExpectedGeneratedHeadRef(identity.headRef, marker)).toBe(true);
    expect(validateGeneratedPr({ ...identity, headRef: `${identity.headRef}-spoof` })).toBeNull();
  });

  test("누락·추가·dev lane·잘못된 operation ID를 fail-closed한다", () => {
    for (const invalid of [
      { ...marker, operationId: "0" },
      { ...marker, lane: "dev" },
      { ...marker, expectedHeadSha: "short" },
      { ...marker, extra: true },
    ]) {
      expect(parseMarker(`<!-- seed-release:${JSON.stringify(invalid)} -->`)).toBeNull();
    }
  });
});

describe("baseline reconciliation marker", () => {
  const marker: ReleaseMarker = {
    schemaVersion: 1,
    type: "baseline",
    lane: "dev",
    stablePr: 1956,
    stableMergeSha: mergeSha,
    publishRunId: 321,
    expectedBaseSha: baseSha,
    expectedHeadSha: headSha,
    controlSha,
    versionsSha256: "e".repeat(64),
  };

  test("stable receipt와 dev base/head를 exact reserved branch에 결속한다", () => {
    const parsed = parseMarker(encodeMarker(marker));
    expect(parsed && isBaselineMarker(parsed)).toBe(true);
    expect(
      validateGeneratedPr({
        author: "github-actions[bot]",
        body: encodeMarker(marker),
        baseRef: "dev",
        headRef: `release-baseline/dev/${mergeSha.slice(0, 12)}-321`,
        baseRepository: repository,
        headRepository: repository,
      }),
    ).toEqual(marker);
  });

  test("추가 필드와 branch spoof를 거부한다", () => {
    expect(parseMarker(encodeMarker({ ...marker, extra: true } as ReleaseMarker))).toBeNull();
    expect(
      hasExpectedGeneratedHeadRef(`release-baseline/dev/${mergeSha.slice(0, 12)}-321-x`, marker),
    ).toBe(false);
  });
});

describe("stable promotion marker", () => {
  const marker: ReleaseMarker = {
    schemaVersion: 1,
    type: "version",
    lane: "major",
    releaseKind: "stable-promotion",
    operationId: "456",
    exitPr: 2001,
    exitMergeSha: mergeSha,
    expectedBaseSha: mergeSha,
    expectedHeadSha: headSha,
    controlSha,
  };

  test("Exit merge와 Version base를 같은 SHA로 exact 결속한다", () => {
    const parsed = parseMarker(encodeMarker(marker));
    expect(parsed && isStablePromotionMarker(parsed)).toBe(true);
    expect(hasExpectedGeneratedHeadRef("changeset-release/major", marker)).toBe(true);
  });

  test("exit PR/merge/operation 또는 base가 빠지거나 다른 marker를 거부한다", () => {
    for (const invalid of [
      { ...marker, exitPr: 0 },
      { ...marker, operationId: "not-a-run" },
      { ...marker, exitMergeSha: baseSha },
      { ...marker, expectedBaseSha: baseSha },
      { ...marker, releaseKind: "stable" },
      { ...marker, unexpected: "field" },
    ]) {
      expect(parseMarker(`<!-- seed-release:${JSON.stringify(invalid)} -->`)).toBeNull();
    }
  });
});
