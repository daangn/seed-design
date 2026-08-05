import { describe, expect, it } from "bun:test";
import { getDaysInMonth, inclusiveDayCount } from "./date";

describe("date utilities", () => {
  it("윤년과 평년의 월별 날짜 수를 계산한다", () => {
    expect(getDaysInMonth({ year: 2024, month: 2, day: 20 })).toBe(29);
    expect(getDaysInMonth({ year: 1900, month: 2, day: 20 })).toBe(28);
    expect(getDaysInMonth({ year: 2000, month: 2, day: 20 })).toBe(29);
  });

  it("양끝을 포함한 날짜 수를 경계와 방향에 맞게 계산한다", () => {
    expect(
      inclusiveDayCount({ year: 2024, month: 2, day: 28 }, { year: 2024, month: 3, day: 1 }),
    ).toBe(3);
    expect(
      inclusiveDayCount({ year: 2026, month: 7, day: 30 }, { year: 2026, month: 7, day: 30 }),
    ).toBe(1);
    expect(
      inclusiveDayCount({ year: 2026, month: 7, day: 31 }, { year: 2026, month: 7, day: 30 }),
    ).toBe(0);
  });
});
