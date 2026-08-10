import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ReleaseCard } from "./release-card";

afterEach(cleanup);

describe("ReleaseCard", () => {
  it("카드 전체를 접근 가능한 내부 링크로 제공하고 핵심 정보를 표시한다", () => {
    render(
      <ReleaseCard
        href="/updates/pickers-dialog-select"
        title="Quantity Picker, Time Picker, Date Picker, Select, Dialog"
        description="Quantity Picker, Time Picker, Date Picker, Select, Dialog로 입력과 선택 경험을 확장했습니다."
        publishedAt="2026-08-10T00:00:00+09:00"
      />,
    );

    const link = screen.getByRole("link", {
      name: /Quantity Picker, Time Picker, Date Picker, Select, Dialog/,
    });
    const metadataAndTitle = link.querySelectorAll("time, h3");

    expect(link.getAttribute("href")).toBe("/updates/pickers-dialog-select");
    expect(screen.getByText("2026. 8. 10")).toBeDefined();
    expect(Array.from(metadataAndTitle, (element) => element.tagName)).toEqual(["TIME", "H3"]);
    expect(link.querySelector("svg")).toBeNull();
  });

  it("prev/next 계열의 카드 상태와 키보드 포커스, 두 줄 설명 스타일을 사용한다", () => {
    render(
      <ReleaseCard
        href="/updates/pickers-dialog-select"
        title="Quantity Picker, Time Picker, Date Picker, Select, Dialog"
        description="긴 설명은 카드 안에서 두 줄까지만 보입니다."
      />,
    );

    const className = screen.getByRole("link").className;

    expect(className).toContain("rounded-r3");
    expect(className).toContain("bg-bg-transparent-selected");
    expect(className).toContain("hover:bg-bg-transparent-selected-pressed");
    expect(className).toContain("duration-color-transition");
    expect(className).toContain("focus-visible:outline-stroke-focus-ring");
    expect(screen.getByText("긴 설명은 카드 안에서 두 줄까지만 보입니다.").className).toContain(
      "line-clamp-2",
    );
  });
});
