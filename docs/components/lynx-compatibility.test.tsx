import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { LynxCompatibilityBadges } from "./lynx-compatibility";

describe("LynxCompatibilityBadges", () => {
  it("Engine과 모든 XElement 최소 버전을 표시한다", () => {
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

    expect(screen.getByText("Engine ≥ 3.6")).toBeDefined();
    expect(screen.getByText("XElement · viewpager ≥ 2.5.1")).toBeDefined();
    expect(screen.getByText("XElement · viewpager-item ≥ 2.5.1")).toBeDefined();
  });

  it("호환 정보가 없으면 아무것도 표시하지 않는다", () => {
    const { container } = render(<LynxCompatibilityBadges />);

    expect(container.firstChild).toBeNull();
  });
});
