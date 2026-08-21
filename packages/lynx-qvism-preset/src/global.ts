import { defineGlobalCss } from "./utils/define";

export const globalCss = defineGlobalCss({
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
  ".seed-icon, .seed-prefix-icon, .seed-suffix-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
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
