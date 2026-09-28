import { describe, expect, it } from "vitest";

import { resolveBoxStyleProps } from "./styled";

const SAFE_AREA = { safeAreaInsetTop: "47px", safeAreaInsetBottom: "34px" };

describe("resolveBoxStyleProps", () => {
  it("passes each style prop as a seed-box variable and class", () => {
    expect(
      resolveBoxStyleProps(
        {
          bg: "bg.brandWeak",
          color: "fg.brand",
          borderColor: "stroke.brandWeak",
          borderWidth: 1,
          borderRadius: "r2",
          width: "full",
          p: "x4",
          display: "flex",
          flexDirection: "rowReverse",
          justifyContent: "spaceBetween",
          alignItems: "flexStart",
          flexGrow: true,
          flexShrink: 0,
          flexWrap: true,
          zIndex: 2,
        },
        SAFE_AREA,
      ),
    ).toEqual({
      className:
        "seed-box seed-box-background seed-box-color seed-box-border-color seed-box-border-width seed-box-border-radius seed-box-width seed-box-padding seed-box-display seed-box-z-index seed-box-flex-grow seed-box-flex-shrink seed-box-flex-direction seed-box-flex-wrap seed-box-justify-content seed-box-align-items",
      style: {
        "--seed-box-background": "var(--seed-color-bg-brand-weak)",
        "--seed-box-color": "var(--seed-color-fg-brand)",
        "--seed-box-border-color": "var(--seed-color-stroke-brand-weak)",
        "--seed-box-border-width": "1px",
        "--seed-box-border-radius": "var(--seed-radius-r2)",
        "--seed-box-width": "100%",
        "--seed-box-padding": "var(--seed-dimension-x4)",
        "--seed-box-display": "flex",
        "--seed-box-z-index": "2",
        "--seed-box-flex-grow": "1",
        "--seed-box-flex-shrink": "0",
        "--seed-box-flex-direction": "row-reverse",
        "--seed-box-flex-wrap": "wrap",
        "--seed-box-justify-content": "space-between",
        "--seed-box-align-items": "flex-start",
      },
      restProps: {},
    });
  });

  it("passes every shorthand level so the stylesheet resolves side over axis over all", () => {
    expect(
      resolveBoxStyleProps(
        { padding: "x1", px: "x2", pl: "x3", borderWidth: 0, borderBottomWidth: 1 },
        SAFE_AREA,
      ).style,
    ).toEqual({
      "--seed-box-border-width": "0px",
      "--seed-box-border-bottom-width": "1px",
      "--seed-box-padding": "var(--seed-dimension-x1)",
      "--seed-box-padding-x": "var(--seed-dimension-x2)",
      "--seed-box-padding-left": "var(--seed-dimension-x3)",
    });
  });

  it("resolves safe area padding to the insets it is given", () => {
    expect(
      resolveBoxStyleProps({ pt: "safeArea", paddingBottom: "safeArea" }, SAFE_AREA).style,
    ).toEqual({
      "--seed-box-padding-top": "47px",
      "--seed-box-padding-bottom": "34px",
    });
  });

  it("passes margin values including auto", () => {
    expect(resolveBoxStyleProps({ m: "x1", mx: "auto", mt: 0 }, SAFE_AREA)).toEqual({
      className: "seed-box seed-box-margin seed-box-margin-x seed-box-margin-top",
      style: {
        "--seed-box-margin": "var(--seed-dimension-x1)",
        "--seed-box-margin-x": "auto",
        "--seed-box-margin-top": "0px",
      },
      restProps: {},
    });
  });

  it("passes dimension tokens as bleed values", () => {
    expect(
      resolveBoxStyleProps({ bleedX: "spacingX.globalGutter", bleedTop: "x4" }, SAFE_AREA),
    ).toEqual({
      className: "seed-box seed-box-bleed-x seed-box-bleed-top",
      style: {
        "--seed-box-bleed-x": "var(--seed-dimension-spacing-x-global-gutter)",
        "--seed-box-bleed-top": "var(--seed-dimension-x4)",
      },
      restProps: {},
    });
  });

  it("picks the gap class for the requested axis", () => {
    expect(resolveBoxStyleProps({ gap: "x2" }, SAFE_AREA).className).toBe("seed-box seed-box-gap");
    expect(resolveBoxStyleProps({ gap: "x2" }, { ...SAFE_AREA, gapAxis: "row" }).className).toBe(
      "seed-box seed-box-row-gap",
    );
    expect(resolveBoxStyleProps({ gap: "x2" }, { ...SAFE_AREA, gapAxis: "column" }).className).toBe(
      "seed-box seed-box-column-gap",
    );
  });

  it("keeps the style prop after the variables and forwards other props", () => {
    expect(
      resolveBoxStyleProps(
        { mt: "x4", style: { marginTop: "3px" }, className: "custom", id: "box" },
        SAFE_AREA,
      ),
    ).toEqual({
      className: "seed-box seed-box-margin-top",
      style: { "--seed-box-margin-top": "var(--seed-dimension-x4)", marginTop: "3px" },
      restProps: { className: "custom", id: "box" },
    });
  });

  it("adds no class without style props", () => {
    expect(resolveBoxStyleProps({ style: { opacity: 0.5 } }, SAFE_AREA)).toEqual({
      className: undefined,
      style: { opacity: 0.5 },
      restProps: {},
    });
  });
});
