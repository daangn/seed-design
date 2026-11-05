import { describe, expect, it } from "bun:test";
import {
  getLocalDate,
  isSiteAnnouncementBannerActive,
  isValidDateOnly,
  type SiteAnnouncementBannerConfig,
} from "./site-announcement-banner-config";

const config = {
  id: "test-announcement",
  enabled: true,
  message: "우리는 왜 디자인 엔지니어를 찾게 됐을까",
  href: "/updates/why-we-hired-a-design-engineer",
} satisfies SiteAnnouncementBannerConfig;

describe("site announcement banner config", () => {
  it("사용자의 로컬 날짜를 YYYY-MM-DD 형식으로 계산한다", () => {
    expect(getLocalDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("유효한 날짜 형식과 실제 달력 날짜만 허용한다", () => {
    expect(isValidDateOnly("2026-09-30")).toBe(true);
    expect(isValidDateOnly("2026-9-30")).toBe(false);
    expect(isValidDateOnly("2026-02-30")).toBe(false);
  });

  it("시작일과 종료일을 사용자 로컬 날짜 기준 포함 범위로 판정한다", () => {
    const scheduled = { ...config, startDate: "2026-08-25", endDate: "2026-09-30" };

    expect(isSiteAnnouncementBannerActive(scheduled, "2026-08-24")).toBe(false);
    expect(isSiteAnnouncementBannerActive(scheduled, "2026-08-25")).toBe(true);
    expect(isSiteAnnouncementBannerActive(scheduled, "2026-09-30")).toBe(true);
    expect(isSiteAnnouncementBannerActive(scheduled, "2026-10-01")).toBe(false);
    expect(isSiteAnnouncementBannerActive({ ...scheduled, enabled: false }, "2026-08-25")).toBe(
      false,
    );
  });

  it("잘못 입력한 설정 날짜는 노출하지 않는다", () => {
    expect(isSiteAnnouncementBannerActive({ ...config, endDate: "2026-02-30" }, "2026-02-20")).toBe(
      false,
    );
  });
});
