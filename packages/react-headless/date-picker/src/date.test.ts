import { describe, expect, it } from "bun:test";
import {
  getDaysInMonth,
  getMonthWeekCount,
  getMonthWeekStarts,
  inclusiveDayCount,
  resolveWeekStartsOn,
} from "./date";

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

  it("월별 주 수를 locale과 주 시작일에 맞게 계산한다", () => {
    for (const locale of ["ko-KR", "en-US", "en-GB"]) {
      for (const weekStartsOn of [undefined, 0, 1, 6] as const) {
        const resolvedWeekStartsOn = resolveWeekStartsOn(locale, weekStartsOn);

        for (let month = 1; month <= 12; month++) {
          const date = { year: 2026, month, day: 1 };
          expect(getMonthWeekCount(date, resolvedWeekStartsOn)).toBe(
            getMonthWeekStarts(date, locale, weekStartsOn).length,
          );
        }
      }
    }
  });
});
