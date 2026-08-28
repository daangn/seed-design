import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  getDateInSeoul,
  isSiteAnnouncementBannerActive,
  isValidDateOnly,
  type SiteAnnouncementBannerConfig,
} from "./site-announcement-banner-config";
import { SiteAnnouncementBanner } from "./site-announcement-banner";

const config = {
  id: "test-announcement",
  enabled: true,
  message: "우리는 왜 디자인 엔지니어를 찾게 됐을까",
  href: "/updates/why-we-hired-a-design-engineer",
} satisfies SiteAnnouncementBannerConfig;

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.style.removeProperty("scroll-padding-bottom");
});

describe("site announcement banner config", () => {
  it("서울 날짜를 YYYY-MM-DD 형식으로 계산한다", () => {
    expect(getDateInSeoul(new Date("2026-08-24T15:00:00.000Z"))).toBe("2026-08-25");
  });

  it("유효한 날짜 형식과 실제 달력 날짜만 허용한다", () => {
    expect(isValidDateOnly("2026-09-30")).toBe(true);
    expect(isValidDateOnly("2026-9-30")).toBe(false);
    expect(isValidDateOnly("2026-02-30")).toBe(false);
  });

  it("시작일과 종료일을 서울 기준 포함 범위로 판정한다", () => {
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

describe("SiteAnnouncementBanner", () => {
  it("글 전체를 내부 링크로 제공하고 화면 하단에 고정한다", async () => {
    render(<SiteAnnouncementBanner config={config} />);

    const link = await screen.findByRole("link", {
      name: /우리는 왜 디자인 엔지니어를 찾게 됐을까/,
    });
    const region = screen.getByRole("region", { name: "사이트 새 소식" });

    expect(link.getAttribute("href")).toBe("/updates/why-we-hired-a-design-engineer");
    expect(region.className).toContain("fixed");
    expect(region.className).toContain("inset-x-0");
    expect(region.className).toContain("bottom-0");
    expect(screen.getByRole("button", { name: "새 소식 배너 닫기" })).toBeDefined();
  });

  it("링크를 선택하면 캠페인을 닫은 상태로 저장한다", async () => {
    render(<SiteAnnouncementBanner config={config} />);

    fireEvent.click(
      await screen.findByRole("link", {
        name: /우리는 왜 디자인 엔지니어를 찾게 됐을까/,
      }),
    );

    expect(window.localStorage.getItem("seed-site-announcement-dismissed:test-announcement")).toBe(
      "true",
    );
    expect(screen.queryByRole("region", { name: "사이트 새 소식" })).toBeNull();
  });

  it("닫은 캠페인을 localStorage에 기억하고 숨긴다", async () => {
    render(<SiteAnnouncementBanner config={config} />);

    fireEvent.click(await screen.findByRole("button", { name: "새 소식 배너 닫기" }));

    await waitFor(() => {
      expect(screen.queryByRole("region", { name: "사이트 새 소식" })).toBeNull();
    });
    expect(window.localStorage.getItem("seed-site-announcement-dismissed:test-announcement")).toBe(
      "true",
    );
  });

  it("이미 닫은 캠페인은 다시 렌더링하지 않는다", async () => {
    window.localStorage.setItem("seed-site-announcement-dismissed:test-announcement", "true");

    render(<SiteAnnouncementBanner config={config} />);

    await waitFor(() => {
      expect(screen.queryByRole("region", { name: "사이트 새 소식" })).toBeNull();
    });
  });

  it("localStorage를 읽을 수 없으면 닫히지 않은 것으로 처리한다", async () => {
    const getItem = spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage is unavailable");
    });

    try {
      render(<SiteAnnouncementBanner config={config} />);

      expect(await screen.findByRole("region", { name: "사이트 새 소식" })).toBeDefined();
    } finally {
      getItem.mockRestore();
    }
  });

  it("localStorage에 저장할 수 없어도 현재 배너는 닫는다", async () => {
    const setItem = spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage is unavailable");
    });

    try {
      render(<SiteAnnouncementBanner config={config} />);

      fireEvent.click(await screen.findByRole("button", { name: "새 소식 배너 닫기" }));

      expect(screen.queryByRole("region", { name: "사이트 새 소식" })).toBeNull();
    } finally {
      setItem.mockRestore();
    }
  });
});
