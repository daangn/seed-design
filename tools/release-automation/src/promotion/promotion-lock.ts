import type { LaneName } from "../core/types";

export const promotionPhases = [
  "active",
  "exiting-locked",
  "preflight-ready",
  "published-awaiting-code",
  "code-complete-awaiting-baseline",
  "complete",
] as const;

export type PromotionPhase = (typeof promotionPhases)[number];

export const promotionPullKinds = [
  "general",
  "stable",
  "code-promotion",
  "baseline",
  "other-generated",
] as const;

export type PromotionPullKind = (typeof promotionPullKinds)[number];
export type PromotionLane = Exclude<LaneName, "dev">;
export type PromotionLaneRole = "source" | "dev" | "sibling";

export interface PromotionLock {
  phase: PromotionPhase;
  sourceLane: PromotionLane;
}

export interface PromotionPullCandidate {
  kind: PromotionPullKind;
  lane: LaneName;
}

export interface PromotionPullDecision {
  canMerge: boolean;
  canValidate: boolean;
  reason: string;
}

export interface PromotionRevalidationPull {
  headSha: string;
  lane: LaneName;
  number: number;
  state: "open" | "closed";
}

export interface PromotionRevalidationTarget {
  headSha: string;
  lane: LaneName;
  pullNumbers: number[];
}

const phaseTransitions: Record<PromotionPhase, PromotionPhase | null> = {
  active: "exiting-locked",
  "exiting-locked": "preflight-ready",
  "preflight-ready": "published-awaiting-code",
  "published-awaiting-code": "code-complete-awaiting-baseline",
  "code-complete-awaiting-baseline": "complete",
  complete: null,
};

function isPromotionPhase(value: unknown): value is PromotionPhase {
  return promotionPhases.includes(value as PromotionPhase);
}

function isPromotionPullKind(value: unknown): value is PromotionPullKind {
  return promotionPullKinds.includes(value as PromotionPullKind);
}

function isLaneName(value: unknown): value is LaneName {
  return value === "dev" || value === "minor" || value === "major";
}

function isSourceLane(value: unknown): value is PromotionLane {
  return value === "minor" || value === "major";
}

export function siblingPromotionLane(sourceLane: PromotionLane): PromotionLane {
  return sourceLane === "minor" ? "major" : "minor";
}

export function promotionLaneRole(sourceLane: PromotionLane, lane: LaneName): PromotionLaneRole {
  if (lane === sourceLane) return "source";
  if (lane === "dev") return "dev";
  return "sibling";
}

export function isPromotionMergeLocked(phase: PromotionPhase): boolean {
  return phase !== "active" && phase !== "complete";
}

export function assertPromotionPhaseTransition(
  current: PromotionPhase,
  next: PromotionPhase,
): void {
  if (!isPromotionPhase(current) || !isPromotionPhase(next)) {
    throw new Error("알 수 없는 코드 승격 단계는 전이할 수 없습니다.");
  }
  if (current === next) return;
  if (phaseTransitions[current] !== next) {
    throw new Error(`코드 승격 단계는 ${current}에서 ${next}(으)로 전이할 수 없습니다.`);
  }
}

function allow(reason: string): PromotionPullDecision {
  return { canMerge: true, canValidate: true, reason };
}

function validationOnly(reason: string): PromotionPullDecision {
  return { canMerge: false, canValidate: true, reason };
}

function deny(reason: string): PromotionPullDecision {
  return { canMerge: false, canValidate: false, reason };
}

export function promotionPullDecision(
  lock: PromotionLock,
  candidate: PromotionPullCandidate,
): PromotionPullDecision {
  if (
    !isPromotionPhase(lock.phase) ||
    !isSourceLane(lock.sourceLane) ||
    !isPromotionPullKind(candidate.kind) ||
    !isLaneName(candidate.lane)
  ) {
    return deny("알 수 없는 코드 승격 잠금 입력이므로 fail-closed합니다.");
  }

  if (!isPromotionMergeLocked(lock.phase)) {
    return allow("코드 승격 merge 잠금이 없는 단계입니다.");
  }

  const role = promotionLaneRole(lock.sourceLane, candidate.lane);
  if (candidate.kind === "general") {
    return validationOnly(
      `${role} lane의 일반 PR은 검토할 수 있지만 코드 승격 완료 전 merge할 수 없습니다.`,
    );
  }

  if (candidate.kind === "stable") {
    return lock.phase === "preflight-ready" && role === "source"
      ? allow("두 target의 코드 승격 사전 검증이 끝난 exact Stable Version PR입니다.")
      : deny("Stable Version PR은 preflight-ready 단계의 source lane에서만 허용됩니다.");
  }

  if (candidate.kind === "code-promotion") {
    if (role === "source") {
      return deny("코드 승격 PR은 source lane을 대상으로 할 수 없습니다.");
    }
    if (lock.phase === "exiting-locked" || lock.phase === "preflight-ready") {
      return validationOnly(
        "코드 승격 PR은 게시 전에 검증할 수 있지만 production receipt 전 merge할 수 없습니다.",
      );
    }
    return lock.phase === "published-awaiting-code"
      ? allow("production receipt 뒤 exact 코드 승격 PR merge를 허용합니다.")
      : deny("코드 승격 PR은 준비·사전 검증·게시 후 코드 반영 단계에서만 허용됩니다.");
  }

  if (candidate.kind === "baseline") {
    if (role === "source") {
      return deny("baseline PR은 source lane을 대상으로 할 수 없습니다.");
    }
    return lock.phase === "code-complete-awaiting-baseline"
      ? allow("두 target의 코드 승격 완료 뒤 baseline PR을 허용합니다.")
      : deny("baseline PR은 코드 승격 두 target이 완료된 뒤에만 허용됩니다.");
  }

  return deny("승격 잠금 중에는 다른 generated PR을 허용하지 않습니다.");
}

export function assertPromotionPullMergeAllowed(
  lock: PromotionLock,
  candidate: PromotionPullCandidate,
): void {
  const decision = promotionPullDecision(lock, candidate);
  if (!decision.canMerge) throw new Error(decision.reason);
}

export function selectPromotionRevalidationTargets(
  sourceLane: PromotionLane,
  pulls: PromotionRevalidationPull[],
): PromotionRevalidationTarget[] {
  if (!isSourceLane(sourceLane)) {
    throw new Error("코드 승격 source lane은 minor 또는 major여야 합니다.");
  }

  const affected = new Set<LaneName>(["dev", sourceLane, siblingPromotionLane(sourceLane)]);
  const grouped = new Map<string, PromotionRevalidationTarget>();
  for (const pull of pulls) {
    if (
      pull.state !== "open" ||
      !affected.has(pull.lane) ||
      !Number.isSafeInteger(pull.number) ||
      pull.number <= 0 ||
      !/^[0-9a-f]{40}$/.test(pull.headSha)
    ) {
      continue;
    }
    const key = `${pull.lane}:${pull.headSha}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.pullNumbers.push(pull.number);
      continue;
    }
    grouped.set(key, {
      headSha: pull.headSha,
      lane: pull.lane,
      pullNumbers: [pull.number],
    });
  }

  return [...grouped.values()]
    .map((target) => ({ ...target, pullNumbers: target.pullNumbers.sort((a, b) => a - b) }))
    .sort((left, right) => {
      const laneOrder = ["dev", sourceLane, siblingPromotionLane(sourceLane)];
      const byLane = laneOrder.indexOf(left.lane) - laneOrder.indexOf(right.lane);
      return byLane === 0 ? left.headSha.localeCompare(right.headSha) : byLane;
    });
}
