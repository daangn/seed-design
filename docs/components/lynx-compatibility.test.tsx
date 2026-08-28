import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { LynxCompatibilityBadges } from "./lynx-compatibility";

describe("LynxCompatibilityBadges", () => {
  it("SEED 최소 Engine 버전과 모든 XElement 태그를 표시한다", () => {
    render(
      <LynxCompatibilityBadges
        compatibility={{
          engine: "2.5",
          "x-elements": [
            { name: "viewpager", version: "2.5.1" },
            { name: "viewpager-item", version: "2.5.1" },
          ],
        }}
      />,
    );

    expect(screen.getByRole("region", { name: "Lynx 호환 정보" })).toBeDefined();
    expect(screen.getByText("Engine ≥ 3.6")).toBeDefined();
    expect(screen.getByText("<viewpager>", { selector: "code" })).toBeDefined();
    expect(screen.getByText("<viewpager-item>", { selector: "code" })).toBeDefined();
  });

  it("SEED 최소 지원 버전보다 높은 Engine 버전은 그대로 표시한다", () => {
    render(<LynxCompatibilityBadges compatibility={{ engine: "3.9" }} />);

    expect(screen.getByText("Engine ≥ 3.9")).toBeDefined();
    expect(screen.queryByText("Engine ≥ 3.6")).toBeNull();
  });

  it("호환 정보가 없으면 아무것도 표시하지 않는다", () => {
    const { container } = render(<LynxCompatibilityBadges />);

    expect(container.firstChild).toBeNull();
  });
});
