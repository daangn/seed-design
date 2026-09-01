import { describe, expect, it } from "bun:test";
import { analyzeSeedTokenContrast, calculateColorContrast } from "./token-contrast";

describe("seed-token-analysis contrast", () => {
  it("alias와 alpha, backdrop을 해석해 light와 dark 대비를 계산한다", async () => {
    const result = await analyzeSeedTokenContrast({
      foreground: "fg/neutral-inverted",
      backgrounds: ["palette/static-black-alpha-500"],
      backdrop: "bg/layer-default",
    });

    expect(result.status).toBe("ok");
    expect(result.request.themes).toEqual(["light", "dark"]);
    expect(result.checks).toHaveLength(2);
    expect(result.checks.every(({ status }) => status === "resolved")).toBe(true);
    expect(result.checks[0]?.foreground.chain).toEqual([
      "$color.fg.neutral-inverted",
      "$color.palette.gray-00",
    ]);
    expect(result.checks[0]?.backdrop?.chain).toEqual([
      "$color.bg.layer-default",
      "$color.palette.gray-00",
    ]);
    expect(result.minimumRatio).toBeGreaterThan(1);
  });

  it("반투명 배경은 불투명 backdrop 없이는 계산하지 않는다", () => {
    expect(calculateColorContrast("#000000", "#ffffff80")).toMatchObject({
      status: "needs-backdrop",
    });

    const resolved = calculateColorContrast("#000000", "#ffffff80", "#000000");
    expect(resolved.status).toBe("resolved");
    if (resolved.status !== "resolved") return;
    expect(resolved.renderedBackground).toBe("#808080");
    expect(resolved.ratio).toBeCloseTo(5.3172100023, 9);
  });
});
