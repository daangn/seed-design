import { describe, expect, test } from "bun:test";
import type { LaneName } from "../core/types";
import {
  assertPromotionPhaseTransition,
  assertPromotionPullMergeAllowed,
  isPromotionMergeLocked,
  promotionLaneRole,
  promotionPullDecision,
  selectPromotionRevalidationTargets,
  siblingPromotionLane,
  type PromotionPhase,
  type PromotionPullKind,
} from "./promotion-lock";

const lockedPhases: PromotionPhase[] = [
  "exiting-locked",
  "preflight-ready",
  "published-awaiting-code",
  "code-complete-awaiting-baseline",
];

describe("code promotion phase", () => {
  test("단계를 순서대로만 전이하고 같은 단계 retry는 허용한다", () => {
    const phases: PromotionPhase[] = [
      "active",
      "exiting-locked",
      "preflight-ready",
      "published-awaiting-code",
      "code-complete-awaiting-baseline",
      "complete",
    ];
    for (let index = 0; index < phases.length - 1; index += 1) {
      const current = phases[index];
      const next = phases[index + 1];
      if (!current || !next) throw new Error("fixture phase가 없습니다.");
      expect(() => assertPromotionPhaseTransition(current, current)).not.toThrow();
      expect(() => assertPromotionPhaseTransition(current, next)).not.toThrow();
    }
  });

  test("단계 건너뛰기와 역방향 전이를 fail-closed한다", () => {
    expect(() => assertPromotionPhaseTransition("active", "preflight-ready")).toThrow(
      "전이할 수 없습니다",
    );
    expect(() =>
      assertPromotionPhaseTransition("published-awaiting-code", "preflight-ready"),
    ).toThrow("전이할 수 없습니다");
    expect(() => assertPromotionPhaseTransition("complete", "active")).toThrow(
      "전이할 수 없습니다",
    );
  });

  test("active와 complete 사이의 모든 승격 단계에서 merge 잠금을 유지한다", () => {
    expect(isPromotionMergeLocked("active")).toBe(false);
    for (const phase of lockedPhases) expect(isPromotionMergeLocked(phase)).toBe(true);
    expect(isPromotionMergeLocked("complete")).toBe(false);
  });
});

describe("code promotion lane roles", () => {
  test("minor source의 dev/source/sibling을 정확히 구분한다", () => {
    expect(siblingPromotionLane("minor")).toBe("major");
    expect(promotionLaneRole("minor", "dev")).toBe("dev");
    expect(promotionLaneRole("minor", "minor")).toBe("source");
    expect(promotionLaneRole("minor", "major")).toBe("sibling");
  });

  test("major source의 dev/source/sibling을 정확히 구분한다", () => {
    expect(siblingPromotionLane("major")).toBe("minor");
    expect(promotionLaneRole("major", "dev")).toBe("dev");
    expect(promotionLaneRole("major", "major")).toBe("source");
    expect(promotionLaneRole("major", "minor")).toBe("sibling");
  });
});

describe("code promotion pull lock policy", () => {
  function decision(phase: PromotionPhase, kind: PromotionPullKind, lane: LaneName) {
    return promotionPullDecision({ phase, sourceLane: "minor" }, { kind, lane });
  }

  test("active와 complete에서는 기존 lane 정책으로 위임한다", () => {
    for (const phase of ["active", "complete"] as const) {
      for (const kind of [
        "general",
        "stable",
        "code-promotion",
        "baseline",
        "other-generated",
      ] as const) {
        expect(decision(phase, kind, "dev")).toMatchObject({
          canMerge: true,
          canValidate: true,
        });
      }
    }
  });

  test("잠금 중 source dev sibling의 일반 PR은 검증만 허용하고 merge를 막는다", () => {
    for (const phase of lockedPhases) {
      for (const lane of ["dev", "minor", "major"] as const) {
        expect(decision(phase, "general", lane)).toMatchObject({
          canMerge: false,
          canValidate: true,
        });
      }
    }
  });

  test("Stable Version PR은 preflight-ready source lane에서만 허용한다", () => {
    expect(decision("exiting-locked", "stable", "minor").canMerge).toBe(false);
    expect(decision("preflight-ready", "stable", "minor")).toMatchObject({
      canMerge: true,
      canValidate: true,
    });
    expect(decision("preflight-ready", "stable", "dev").canMerge).toBe(false);
    expect(decision("preflight-ready", "stable", "major").canMerge).toBe(false);
    expect(decision("published-awaiting-code", "stable", "minor").canMerge).toBe(false);
  });

  test("코드 승격 PR은 게시 전 검증만 하고 receipt 뒤 dev와 sibling merge만 허용한다", () => {
    for (const lane of ["dev", "major"] as const) {
      expect(decision("exiting-locked", "code-promotion", lane)).toMatchObject({
        canMerge: false,
        canValidate: true,
      });
      expect(decision("preflight-ready", "code-promotion", lane)).toMatchObject({
        canMerge: false,
        canValidate: true,
      });
      expect(decision("published-awaiting-code", "code-promotion", lane)).toMatchObject({
        canMerge: true,
        canValidate: true,
      });
    }
    expect(decision("published-awaiting-code", "code-promotion", "minor").canMerge).toBe(false);
    expect(decision("code-complete-awaiting-baseline", "code-promotion", "dev").canMerge).toBe(
      false,
    );
  });

  test("baseline은 코드 승격 완료 뒤 dev와 sibling에서만 허용한다", () => {
    for (const phase of ["exiting-locked", "preflight-ready", "published-awaiting-code"] as const) {
      expect(decision(phase, "baseline", "dev").canMerge).toBe(false);
      expect(decision(phase, "baseline", "major").canMerge).toBe(false);
    }
    expect(decision("code-complete-awaiting-baseline", "baseline", "dev").canMerge).toBe(true);
    expect(decision("code-complete-awaiting-baseline", "baseline", "major").canMerge).toBe(true);
    expect(decision("code-complete-awaiting-baseline", "baseline", "minor").canMerge).toBe(false);
  });

  test("승격 잠금 중 다른 generated PR과 알 수 없는 입력을 fail-closed한다", () => {
    expect(decision("preflight-ready", "other-generated", "dev")).toMatchObject({
      canMerge: false,
      canValidate: false,
    });
    expect(
      promotionPullDecision(
        { phase: "unknown" as PromotionPhase, sourceLane: "minor" },
        { kind: "stable", lane: "minor" },
      ),
    ).toMatchObject({ canMerge: false, canValidate: false });
    expect(() =>
      assertPromotionPullMergeAllowed(
        { phase: "preflight-ready", sourceLane: "minor" },
        { kind: "baseline", lane: "dev" },
      ),
    ).toThrow("코드 승격 두 target");
  });
});

describe("promotion lock revalidation", () => {
  test("source dev sibling의 기존 open PR head를 모두 재검증 대상으로 선택한다", () => {
    const devHead = "a".repeat(40);
    const sourceHead = "b".repeat(40);
    const siblingHead = "c".repeat(40);
    expect(
      selectPromotionRevalidationTargets("minor", [
        { number: 4, lane: "major", headSha: siblingHead, state: "open" },
        { number: 2, lane: "dev", headSha: devHead, state: "open" },
        { number: 3, lane: "minor", headSha: sourceHead, state: "open" },
      ]),
    ).toEqual([
      { lane: "dev", headSha: devHead, pullNumbers: [2] },
      { lane: "minor", headSha: sourceHead, pullNumbers: [3] },
      { lane: "major", headSha: siblingHead, pullNumbers: [4] },
    ]);
  });

  test("이미 green인 head도 포함하고 같은 head의 PR은 한 status 대상으로 묶는다", () => {
    const sharedHead = "d".repeat(40);
    expect(
      selectPromotionRevalidationTargets("major", [
        { number: 12, lane: "dev", headSha: sharedHead, state: "open" },
        { number: 10, lane: "dev", headSha: sharedHead, state: "open" },
      ]),
    ).toEqual([{ lane: "dev", headSha: sharedHead, pullNumbers: [10, 12] }]);
  });

  test("closed PR과 잘못된 identity는 재검증 대상에서 제외한다", () => {
    expect(
      selectPromotionRevalidationTargets("minor", [
        { number: 1, lane: "dev", headSha: "a".repeat(40), state: "closed" },
        { number: 0, lane: "minor", headSha: "b".repeat(40), state: "open" },
        { number: 2, lane: "major", headSha: "short", state: "open" },
      ]),
    ).toEqual([]);
  });
});
