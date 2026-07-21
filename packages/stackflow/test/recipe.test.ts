/**
 * Generated-CSS contract tests for the next-app-screen / next-app-bar recipes.
 *
 * happy-dom has no CSS engine, so the load-bearing selectors and declarations
 * are asserted against the generated CSS text (packages/css/recipes/*.css).
 */
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { nextAppBarVariantMap } from "@seed-design/css/recipes/next-app-bar";
import { nextAppBarMainVariantMap } from "@seed-design/css/recipes/next-app-bar-main";
import { nextAppScreen, nextAppScreenVariantMap } from "@seed-design/css/recipes/next-app-screen";

const readCss = (name: string) =>
  readFileSync(new URL(`../../css/recipes/${name}.css`, import.meta.url), "utf8");

const screenCss = readCss("next-app-screen");
const barCss = readCss("next-app-bar");

/**
 * Split a CSS text into { selector, body } rule blocks. Good enough for the
 * flat output qvism emits (no nested at-rules in these recipes).
 */
function parseRules(css: string) {
  const rules: Array<{ selector: string; body: string }> = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;

  for (const match of css.matchAll(re)) {
    rules.push({ selector: match[1].trim(), body: match[2] });
  }

  return rules;
}

describe("next-app-screen recipe", () => {
  it("variantMap이 스펙의 variant 목록과 일치한다", () => {
    expect(nextAppScreenVariantMap).toEqual({
      theme: ["cupertino", "android"],
      transitionStyle: ["horizontalSlide", "verticalSlide", "fadeIn"],
      contentOffsetTop: ["none", "safeArea", "appBar"],
      contentOffsetBottom: ["none", "safeArea"],
      tone: ["layer", "transparent"],
      gradient: [true, false],
    });
  });

  it("slot classname이 seed-next-app-screen__<slot> 형식이다", () => {
    const classNames = nextAppScreen();
    expect(classNames.root).toContain("seed-next-app-screen__root");
    expect(classNames.dim).toContain("seed-next-app-screen__dim");
    expect(classNames.layer).toContain("seed-next-app-screen__layer");
    expect(classNames.content).toContain("seed-next-app-screen__content");
    expect(classNames.edge).toContain("seed-next-app-screen__edge");
  });

  it("push 상태 rule이 seed-enter 애니메이션을 바인딩한다", () => {
    const pushLayerRules = parseRules(screenCss).filter(
      (rule) =>
        rule.selector.includes('[data-screen-state="push"]') && rule.selector.includes("__layer"),
    );
    expect(pushLayerRules.length).toBeGreaterThan(0);
    expect(pushLayerRules.some((rule) => rule.body.includes("seed-enter"))).toBe(true);
  });

  it("idle/idle-behind 상태에는 animation이 전혀 바인딩되지 않는다 (Activity display:none 재노출 대비)", () => {
    const idleRules = parseRules(screenCss).filter((rule) => {
      // strip :not(...) clauses so guards like :not([data-screen-state="idle"]) don't count
      const positiveSelector = rule.selector.replace(/:not\([^)]*\)/g, "");
      return (
        positiveSelector.includes('[data-screen-state="idle"]') ||
        positiveSelector.includes('[data-screen-state="idle-behind"]')
      );
    });

    for (const rule of idleRules) {
      expect(rule.body).not.toContain("animation");
    }
  });

  it("resting 위치가 animation-fill-mode: forwards에 의존하지 않는다 (idle-behind는 정적 transform)", () => {
    const idleBehindLayerRule = parseRules(screenCss).find((rule) => {
      const positiveSelector = rule.selector.replace(/:not\([^)]*\)/g, "");
      return (
        positiveSelector.includes('[data-screen-state="idle-behind"]') &&
        rule.selector.includes("__layer") &&
        rule.body.includes("-30%")
      );
    });
    expect(idleBehindLayerRule).toBeDefined();
  });

  it("layer/content base rule에 resting transform이 없다 (fixed containing-block 회귀 방지)", () => {
    const rules = parseRules(screenCss);
    const baseLayer = rules.find((rule) => rule.selector === ".seed-next-app-screen__layer");
    const baseContent = rules.find((rule) => rule.selector === ".seed-next-app-screen__content");

    expect(baseLayer).toBeDefined();
    expect(baseLayer?.body).not.toContain("transform");
    expect(baseLayer?.body).not.toContain("will-change");
    expect(baseContent).toBeDefined();
    expect(baseContent?.body).not.toContain("transform");

    // horizontalSlide variant 클래스 자체(상태 무관)에도 resting transform이 없어야 한다
    const horizontalLayerBase = rules.filter(
      (rule) =>
        rule.selector.trim() === ".seed-next-app-screen__layer--transitionStyle_horizontalSlide",
    );
    for (const rule of horizontalLayerBase) {
      expect(rule.body).not.toContain("transform");
    }
  });

  it("swipe 중 transform이 CSS 변수로 구동된다", () => {
    expect(screenCss).toContain("var(--seed-swipe-back-displacement");
    expect(screenCss).toContain("var(--seed-swipe-back-displacement-ratio");
    // behind layer: -30%에서 ratio에 비례해 복귀
    expect(screenCss).toContain("-30%");
    const swipingRules = parseRules(screenCss).filter((rule) =>
      rule.selector.includes('[data-swipe-back-state="swiping"]'),
    );
    expect(swipingRules.length).toBeGreaterThan(0);
    expect(swipingRules.some((rule) => rule.body.includes("--seed-swipe-back-displacement"))).toBe(
      true,
    );
  });

  it("canceling/completing 상태는 plain CSS transition으로 릴리즈한다", () => {
    const rules = parseRules(screenCss);
    const releaseRules = rules.filter(
      (rule) =>
        rule.selector.includes('[data-swipe-back-state="canceling"]') ||
        rule.selector.includes('[data-swipe-back-state="completing"]'),
    );
    expect(releaseRules.length).toBeGreaterThan(0);
    expect(releaseRules.some((rule) => rule.body.includes("transition"))).toBe(true);
  });

  it("iOS 타이밍(350ms cubic-bezier(0.2, 0.1, 0.21, 0.99))이 유지된다", () => {
    expect(screenCss).toContain("350ms");
    expect(screenCss).toContain("cubic-bezier(0.2, 0.1, 0.21, 0.99)");
  });

  it("verticalSlide 타이밍(enter 300ms / exit 150ms linear)이 유지된다", () => {
    expect(screenCss).toContain("300ms");
    expect(screenCss).toContain("150ms");
    expect(screenCss).toContain("cubic-bezier(0.23, 0.1, 0.32, 1)");
  });

  it("dim 표현이 transitionStyle을 따라간다 (full/gradient 160px/none)", () => {
    const rules = parseRules(screenCss);
    const verticalDim = rules.find((rule) =>
      rule.selector.includes("__dim--transitionStyle_verticalSlide"),
    );
    expect(verticalDim?.body).toContain("160px");

    const fadeInDim = rules.find((rule) => rule.selector.includes("__dim--transitionStyle_fadeIn"));
    expect(fadeInDim?.body).toContain("display: none");
  });

  it("clip rule이 transition/swipe 중에만 적용된다", () => {
    const clipRules = parseRules(screenCss).filter((rule) =>
      rule.body.includes("--seed-next-app-screen-clip-radius"),
    );
    expect(clipRules.length).toBeGreaterThan(0);

    for (const rule of clipRules) {
      const isTransitioning =
        rule.selector.includes(':not([data-screen-state="idle"])') &&
        rule.selector.includes(':not([data-screen-state="idle-behind"])');
      const isSwiping = rule.selector.includes("[data-swipe-back-state]");
      expect(isTransitioning || isSwiping).toBe(true);
    }
  });

  it("sticky overscroll 핵을 복제하지 않는다", () => {
    expect(screenCss).not.toContain("sticky");
    expect(screenCss).not.toContain("rgba(0, 0, 0, 0.2)");
  });

  it("content가 스크롤 컨테이너다", () => {
    const baseContent = parseRules(screenCss).find(
      (rule) => rule.selector === ".seed-next-app-screen__content",
    );
    expect(baseContent?.body).toContain("overflow-y: scroll");
  });
});

describe("next-app-bar recipe", () => {
  it("variantMap이 스펙의 variant 목록과 일치한다", () => {
    expect(nextAppBarVariantMap).toEqual({
      theme: ["cupertino", "android"],
      transitionStyle: ["horizontalSlide", "verticalSlide", "fadeIn"],
      tone: ["layer", "transparent"],
      gradient: [true, false],
    });
    expect(nextAppBarMainVariantMap["layout"]).toEqual(["titleOnly", "withSubtitle"]);
  });

  it("tone=transparent, gradient=true에서 background slot이 rootage 변수 기반 gradient를 소비한다", () => {
    expect(barCss).toContain("linear-gradient(180deg, #00000059 0%, #00000000 100%)");
    expect(barCss).toContain("var(--seed-dimension-x5)");
  });

  it("gradient에 하드코딩된 rgba 값이 없다", () => {
    expect(barCss).not.toContain("rgba(");
  });

  it("bar root는 stack tier가 아니라 layer 내부 z-index 1이다", () => {
    const rootBase = parseRules(barCss).find(
      (rule) => rule.selector === ".seed-next-app-bar__root",
    );
    expect(rootBase?.body).toContain("z-index: 1");
    expect(rootBase?.body).not.toContain("--z-index-app-bar");
  });
});
