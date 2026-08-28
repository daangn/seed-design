import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { ScrollFog } from "./ScrollFog";

describe("ScrollFog", () => {
  it("CSS 길이 계산식을 Fog 크기로 전달한다", () => {
    const { container } = render(<ScrollFog size="min(40%, 132px)" />);
    const scrollFog = container.firstElementChild as HTMLElement;

    expect(scrollFog.style.getPropertyValue("--scroll-fog-size-top")).toBe("min(40%, 132px)");
    expect(scrollFog.style.getPropertyValue("--scroll-fog-size-bottom")).toBe("min(40%, 132px)");
  });
});
