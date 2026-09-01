import { describe, expect, it } from "bun:test";
import { mapSeedColorToken } from "./token-map";

describe("seed-token-analysis token map", () => {
  it("현재 체크아웃에서 색상 토큰의 alias, 사용처와 생성 표면을 연결한다", async () => {
    const result = await mapSeedColorToken("fg/on-neutral-solid");

    expect(result.token).toMatchObject({
      canonical: "$color.fg.on-neutral-solid",
      state: "matched",
      publicNames: {
        cssVariable: "--seed-color-fg-on-neutral-solid",
        tailwind: "fg-on-neutral-solid",
      },
    });
    expect(result.definition).toMatchObject({
      path: "packages/rootage/color.yaml",
      values: {
        "theme-light": "$color.palette.gray-00",
        "theme-dark": "$color.palette.gray-100",
      },
    });
    expect(result.resolvedValues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mode: "theme-light",
          resolved: "#ffffff",
          chain: ["$color.fg.on-neutral-solid", "$color.palette.gray-00"],
        }),
      ]),
    );
    expect(result.componentUsages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          component: "action-button",
          path: "packages/rootage/components/action-button.yaml",
          role: "foreground",
        }),
      ]),
    );
    expect(
      result.generatedSurfaces.filter(({ status }) => status === "present").map(({ id }) => id),
    ).toEqual([
      "css-lynx",
      "css-web",
      "qvism-lynx",
      "qvism-web",
      "rootage-artifacts",
      "tailwind3",
      "tailwind4",
    ]);

    const palette = await mapSeedColorToken("palette/gray-00");
    expect(palette.dependentTokens).toEqual(
      expect.arrayContaining([
        {
          token: "$color.fg.on-neutral-solid",
          modes: ["theme-light"],
          path: "packages/rootage/color.yaml",
        },
      ]),
    );
  });

  it("정의되지 않은 접두사 토큰을 더 긴 생성 토큰으로 오인하지 않는다", async () => {
    const result = await mapSeedColorToken("fg/neutral-invert");

    expect(result.token.state).toBe("not-found");
    expect(result.componentUsages).toEqual([]);
    expect(result.generatedSurfaces.every(({ status }) => status === "missing")).toBe(true);
  });
});
