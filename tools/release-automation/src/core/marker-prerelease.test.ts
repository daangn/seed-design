import { describe, expect, test } from "bun:test";
import {
  encodeMarker,
  hasExpectedGeneratedHeadRef,
  isBaselineMarker,
  isCodePromotionMarker,
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
const enterMergeSha = "f".repeat(40);
const treeSha = "1".repeat(40);
const baselineTreeSha = "2".repeat(40);
const digest = "3".repeat(64);
const stablePatchDigest = "4".repeat(64);
const emptyDigest = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
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
    enterPr: 1900,
    enterMergeSha,
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
      { ...marker, enterPr: 0 },
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
    codeMergeSha: baseSha,
    expectedCodeTreeSha: treeSha,
    expectedBaselineTreeSha: baselineTreeSha,
    promotionManifestSha256: digest,
    stablePatchSha256: stablePatchDigest,
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
    exitBaseSha: baseSha,
    exitMergeSha: mergeSha,
    enterPr: 1900,
    enterMergeSha,
    expectedBaseSha: mergeSha,
    expectedHeadSha: headSha,
    controlSha,
    promotionManifestSha256: digest,
    stablePatchSha256: stablePatchDigest,
    promotionTargets: [
      {
        lane: "dev",
        expectedBaseSha: baseSha,
        expectedHeadSha: baseSha,
        expectedCodeTreeSha: treeSha,
        expectedBaselineTreeSha: baselineTreeSha,
        patchSha256: emptyDigest,
        noOp: true,
      },
      {
        lane: "minor",
        expectedBaseSha: controlSha,
        expectedHeadSha: enterMergeSha,
        expectedCodeTreeSha: treeSha,
        expectedBaselineTreeSha: baselineTreeSha,
        patchSha256: digest,
        noOp: false,
      },
    ],
  };

  test("Exit merge와 Version base를 같은 SHA로 exact 결속한다", () => {
    const parsed = parseMarker(encodeMarker(marker));
    expect(parsed && isStablePromotionMarker(parsed)).toBe(true);
    expect(hasExpectedGeneratedHeadRef("changeset-release/major", marker)).toBe(true);
  });

  test("exit PR/merge/operation 또는 base가 빠지거나 다른 marker를 거부한다", () => {
    for (const invalid of [
      { ...marker, exitPr: 0 },
      { ...marker, enterPr: 0 },
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

describe("code promotion marker", () => {
  const marker: ReleaseMarker = {
    schemaVersion: 1,
    type: "code-promotion",
    lane: "dev",
    sourceLane: "major",
    stablePr: 2001,
    stableVersionHeadSha: headSha,
    enterPr: 1900,
    enterMergeSha,
    exitPr: 2000,
    exitBaseSha: baseSha,
    exitMergeSha: mergeSha,
    expectedBaseSha: controlSha,
    expectedHeadSha: "5".repeat(40),
    expectedCodeTreeSha: treeSha,
    expectedBaselineTreeSha: baselineTreeSha,
    promotionManifestSha256: digest,
    patchSha256: "6".repeat(64),
    stablePatchSha256: stablePatchDigest,
    controlSha,
    controlTreeSha256: "7".repeat(64),
  };

  test("source lifecycle과 target tree를 reserved branch에 exact 결속한다", () => {
    const parsed = parseMarker(encodeMarker(marker));
    expect(parsed && isCodePromotionMarker(parsed)).toBe(true);
    expect(
      validateGeneratedPr({
        author: "github-actions[bot]",
        body: encodeMarker(marker),
        baseRef: "dev",
        headRef: `release-code-promotion/dev/2001-${digest.slice(0, 12)}`,
        baseRepository: repository,
        headRepository: repository,
      }),
    ).toEqual(marker);
  });

  test("source 자신을 target으로 지정하거나 추가 필드를 가진 marker를 거부한다", () => {
    expect(parseMarker(encodeMarker({ ...marker, lane: "major" }))).toBeNull();
    expect(parseMarker(encodeMarker({ ...marker, unexpected: true } as ReleaseMarker))).toBeNull();
    expect(
      hasExpectedGeneratedHeadRef(
        `release-code-promotion/dev/2001-${digest.slice(0, 12)}-spoof`,
        marker,
      ),
    ).toBe(false);
  });
});
