import { defineGlobalCss } from "./utils/define";

type BoxSide = "Top" | "Right" | "Bottom" | "Left";

const BOX_SIDES = ["Top", "Right", "Bottom", "Left"] as const satisfies readonly BoxSide[];

const BOX_CORNERS = ["TopLeft", "TopRight", "BottomRight", "BottomLeft"] as const;

const boxVar = (name: string) => `var(--seed-box-${name})` as const;

function boxSpacingRules(prefix: "padding" | "margin" | "bleed") {
  const property = prefix === "bleed" ? "margin" : prefix;
  const value = (name: string) =>
    prefix === "bleed" ? `calc(${boxVar(name)} * -1)` : boxVar(name);
  const rule = (name: string, sides: readonly BoxSide[]) =>
    [
      `.seed-box.seed-box-${name}`,
      Object.fromEntries(sides.map((side) => [`${property}${side}`, value(name)])),
    ] as const;

  // 같은 specificity에서 뒤 규칙이 이기므로 전체 → 축 → 방향 순서가 우선순위다.
  return Object.fromEntries([
    rule(prefix, BOX_SIDES),
    rule(`${prefix}-x`, ["Left", "Right"]),
    rule(`${prefix}-y`, ["Top", "Bottom"]),
    ...BOX_SIDES.map((side) => rule(`${prefix}-${side.toLowerCase()}`, [side])),
  ]);
}

/**
 * Box style prop은 `--seed-box-*` 변수와 설정한 prop의 class만 요소에 붙인다.
 *
 * 웹처럼 `.seed-box` 하나가 모든 속성을 선언하지 않는다. Lynx는 CSS-wide keyword가 없어
 * 상속된 변수를 `initial`로 끊을 수 없고, 값이 없는 `var()`는 다른 class가 준 값까지 0으로
 * 덮는다. prop별 class는 변수가 같은 요소에 있을 때만 붙으므로 두 문제를 피하고, 설정하지
 * 않은 속성은 사용자 className과 Recipe에 그대로 맡긴다.
 *
 * Lynx `gap` shorthand 파서가 var()를 0px로 확정한 적이 있어 shorthand 대신 longhand에 변수를 건다.
 */
const boxGlobalCss = {
  ".seed-box.seed-box-background": { background: boxVar("background") },
  ".seed-box.seed-box-color": { color: boxVar("color") },
  ".seed-box.seed-box-border-color": { borderStyle: "solid", borderColor: boxVar("border-color") },
  ".seed-box.seed-box-border-width": {
    borderStyle: "solid",
    ...Object.fromEntries(BOX_SIDES.map((side) => [`border${side}Width`, boxVar("border-width")])),
  },
  ...Object.fromEntries(
    BOX_SIDES.map((side) => [
      `.seed-box.seed-box-border-${side.toLowerCase()}-width`,
      {
        borderStyle: "solid",
        [`border${side}Width`]: boxVar(`border-${side.toLowerCase()}-width`),
      },
    ]),
  ),
  ".seed-box.seed-box-border-radius": Object.fromEntries(
    BOX_CORNERS.map((corner) => [`border${corner}Radius`, boxVar("border-radius")]),
  ),
  ...Object.fromEntries(
    BOX_CORNERS.map((corner) => {
      const name = `border-${corner.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase()}-radius`;

      return [`.seed-box.seed-box-${name}`, { [`border${corner}Radius`]: boxVar(name) }];
    }),
  ),
  ".seed-box.seed-box-width": { width: boxVar("width") },
  ".seed-box.seed-box-min-width": { minWidth: boxVar("min-width") },
  ".seed-box.seed-box-max-width": { maxWidth: boxVar("max-width") },
  ".seed-box.seed-box-height": { height: boxVar("height") },
  ".seed-box.seed-box-min-height": { minHeight: boxVar("min-height") },
  ".seed-box.seed-box-max-height": { maxHeight: boxVar("max-height") },
  ".seed-box.seed-box-top": { top: boxVar("top") },
  ".seed-box.seed-box-right": { right: boxVar("right") },
  ".seed-box.seed-box-bottom": { bottom: boxVar("bottom") },
  ".seed-box.seed-box-left": { left: boxVar("left") },
  ...boxSpacingRules("padding"),
  // margin이 bleed 뒤에 와야 같은 방향에 둘 다 있을 때 웹처럼 margin이 이긴다.
  ...boxSpacingRules("bleed"),
  ...boxSpacingRules("margin"),
  ".seed-box.seed-box-display": { display: boxVar("display") },
  ".seed-box.seed-box-position": { position: boxVar("position") },
  ".seed-box.seed-box-overflow-x": { overflowX: boxVar("overflow-x") },
  ".seed-box.seed-box-overflow-y": { overflowY: boxVar("overflow-y") },
  ".seed-box.seed-box-z-index": { zIndex: boxVar("z-index") },
  ".seed-box.seed-box-flex-grow": { flexGrow: boxVar("flex-grow") },
  ".seed-box.seed-box-flex-shrink": { flexShrink: boxVar("flex-shrink") },
  ".seed-box.seed-box-flex-direction": { flexDirection: boxVar("flex-direction") },
  ".seed-box.seed-box-flex-wrap": { flexWrap: boxVar("flex-wrap") },
  ".seed-box.seed-box-justify-content": { justifyContent: boxVar("justify-content") },
  ".seed-box.seed-box-justify-self": { justifySelf: boxVar("justify-self") },
  ".seed-box.seed-box-align-items": { alignItems: boxVar("align-items") },
  ".seed-box.seed-box-align-content": { alignContent: boxVar("align-content") },
  ".seed-box.seed-box-align-self": { alignSelf: boxVar("align-self") },
  ".seed-box.seed-box-gap": { rowGap: boxVar("gap"), columnGap: boxVar("gap") },
  ".seed-box.seed-box-row-gap": { rowGap: boxVar("gap") },
  ".seed-box.seed-box-column-gap": { columnGap: boxVar("gap") },
};

export const globalCss = defineGlobalCss({
  ...boxGlobalCss,
  // Lynx 테마 색상 갱신 워크어라운드.
  // SEED <text>는 `color`를 inline style의 var()로 거는데, Lynx 엔진은 테마가 바뀔 때
  // inline var()를 재계산하지 않는다 — rule(class/type selector) 기반 var()만 style
  // invalidation을 추적한다. 테마마다 값이 다른 투명 배경(--seed-color-bg-transparent:
  // light #0000 / dark #fff0)을 type selector(= CSS rule)로 걸면, 테마 전환 시 element
  // re-paint가 강제되어 같은 <text>의 inline `color`까지 함께 갱신된다. 두 테마 모두
  // alpha가 0이라 시각적 부작용은 없다.
  // ⚠️ 다른 곳에서 <text>에 background-color를 직접 설정하지 말 것 — class 기반으로 처리.
  text: {
    backgroundColor: "var(--seed-color-bg-transparent)",
  },
  ".seed-icon, .seed-prefix-icon, .seed-suffix-icon, .seed-icon-slot, .seed-prefix-icon-slot, .seed-suffix-icon-slot":
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  // Keep existing fallback selectors for older React versions. Recipe-bound icons use layout-only classes.
  ".seed-icon": {
    width: "var(--seed-icon-size)",
    height: "var(--seed-icon-size)",
    color: "var(--seed-icon-color, currentColor)",
  },
  ".seed-prefix-icon": {
    width: "var(--seed-prefix-icon-size)",
    height: "var(--seed-prefix-icon-size)",
    color: "var(--seed-prefix-icon-color, currentColor)",

    marginLeft: "var(--seed-prefix-icon-margin-left, 0)",
    marginRight: "var(--seed-prefix-icon-margin-right, 0)",
    marginTop: "var(--seed-prefix-icon-margin-top, 0)",
    marginBottom: "var(--seed-prefix-icon-margin-bottom, 0)",

    alignSelf: "var(--seed-prefix-icon-align-self)",
    justifySelf: "var(--seed-prefix-icon-justify-self)",
  },
  ".seed-suffix-icon": {
    width: "var(--seed-suffix-icon-size)",
    height: "var(--seed-suffix-icon-size)",
    color: "var(--seed-suffix-icon-color, currentColor)",

    marginLeft: "var(--seed-suffix-icon-margin-left, 0)",
    marginRight: "var(--seed-suffix-icon-margin-right, 0)",
    marginTop: "var(--seed-suffix-icon-margin-top, 0)",
    marginBottom: "var(--seed-suffix-icon-margin-bottom, 0)",

    alignSelf: "var(--seed-suffix-icon-align-self)",
    justifySelf: "var(--seed-suffix-icon-justify-self)",
  },
});
