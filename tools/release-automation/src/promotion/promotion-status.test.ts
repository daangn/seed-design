import { describe, expect, test } from "bun:test";
import {
  isPromotionStatusFor,
  latestPromotionStatus,
  promotionStatusContext,
  promotionStatusDescription,
} from "./promotion-status";

const manifest = "a".repeat(64);

function status(id: number, state: "pending" | "success", description: string) {
  return {
    id,
    state,
    context: promotionStatusContext,
    description,
    target_url: null,
    updated_at: `2026-08-10T00:00:0${id}Z`,
    creator: { login: "github-actions[bot]" },
  };
}

describe("durable promotion status", () => {
  test("stable PR과 manifest에 결속된 최신 상태만 선택한다", () => {
    const pending = status(1, "pending", promotionStatusDescription(1956, manifest));
    const success = status(2, "success", promotionStatusDescription(1956, manifest));
    expect(latestPromotionStatus([pending, success])).toBe(success);
    expect(isPromotionStatusFor(success, 1956, manifest)).toBe(true);
    expect(isPromotionStatusFor(success, 1957, manifest)).toBe(false);
  });

  test("사람이나 다른 context의 상태는 receipt가 아니다", () => {
    const exact = status(1, "pending", promotionStatusDescription(1956, manifest));
    expect(
      latestPromotionStatus([
        { ...exact, creator: { login: "human" } },
        { ...exact, context: "Validate release lane" },
      ]),
    ).toBeNull();
  });
});
