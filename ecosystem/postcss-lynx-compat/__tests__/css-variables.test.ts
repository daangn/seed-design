import { describe, expect, it } from "vitest";
import { run } from "./helpers";

describe("postcss-lynx-compat", () => {
  describe("clamp() 변환", () => {
    it("CSS 커스텀 프로퍼티의 clamp()를 preferred 값으로 변환한다", async () => {
      const input = ":root { --font-size: clamp(1rem, 2vw, 1.5rem); }";
      const output = await run(input);
      expect(output).toContain("--font-size: 2vw");
      expect(output).not.toContain("clamp");
    });

    it("일반 프로퍼티의 clamp()를 preferred 값으로 변환한다", async () => {
      const input = ".text { font-size: clamp(14px, 2vw, 18px); }";
      const output = await run(input);
      expect(output).toContain("font-size: 2vw");
    });

    it("clampStrategy: min을 지원한다", async () => {
      const input = ":root { --size: clamp(1rem, 2vw, 1.5rem); }";
      const output = await run(input, { clampStrategy: "min" });
      // 1rem → 16px (rem→px 변환 적용됨)
      expect(output).toContain("--size: 16px");
    });

    it("clampStrategy: max를 지원한다", async () => {
      const input = ":root { --size: clamp(1rem, 2vw, 1.5rem); }";
      const output = await run(input, { clampStrategy: "max" });
      // 1.5rem → 24px (rem→px 변환 적용됨)
      expect(output).toContain("--size: 24px");
    });
  });

  describe("nested var() 유지 (Lynx 3.6+ 네이티브 지원)", () => {
    it("page 내 nested var()를 그대로 유지한다", async () => {
      const input = `
        page {
          --color-raw: #fa6616;
          --color-bg: var(--color-raw);
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("--color-raw: #fa6616");
      expect(output).toContain("--color-bg: var(--color-raw)");
    });

    it("컴포넌트 커스텀 프로퍼티의 var() 참조를 유지한다", async () => {
      const input = `
        page {
          --color-raw: #fa6616;
          --spacing: 16px;
        }
        .seed-btn {
          --btn-bg: var(--color-raw);
          --btn-pad: var(--spacing);
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("--btn-bg: var(--color-raw)");
      expect(output).toContain("--btn-pad: var(--spacing)");
    });

    it("2단계 nested var() 체인을 유지한다", async () => {
      const input = `
        page {
          --base: 16px;
          --spacing: var(--base);
          --pad: var(--spacing);
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("--base: 16px");
      expect(output).toContain("--spacing: var(--base)");
      expect(output).toContain("--pad: var(--spacing)");
    });

    it("calc() 내 var()도 유지한다", async () => {
      const input = `
        page {
          --size: 10px;
          --half-size: calc(var(--size) / 2);
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("--half-size: calc(var(--size) / 2)");
    });
  });

  describe("replaceVarWithEnv", () => {
    it("var(--seed-safe-area-top)을 env(safe-area-inset-top)로 치환한다", async () => {
      const input = `
        .seed-app-bar {
          padding-top: var(--seed-safe-area-top);
        }
      `;
      const output = await run(input);
      expect(output).toContain("padding-top: env(safe-area-inset-top)");
      expect(output).not.toContain("var(--seed-safe-area-top)");
    });

    it("fallback 있는 var()도 치환한다", async () => {
      const input = `
        .seed-app-bar {
          padding-top: var(--seed-safe-area-top, 10px);
        }
      `;
      const output = await run(input);
      expect(output).toContain("padding-top: env(safe-area-inset-top)");
    });

    it("calc() 내부 var()를 치환한다", async () => {
      const input = `
        .seed-app-bar {
          height: calc(44px + var(--seed-safe-area-top));
        }
      `;
      const output = await run(input);
      expect(output).toContain("height: calc(44px + env(safe-area-inset-top))");
    });

    it("page/:root 셀렉터에서 매핑된 커스텀 프로퍼티 정의를 제거한다", async () => {
      const input = `
        :root {
          --seed-safe-area-top: 0px;
          --seed-other-var: 10px;
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).not.toContain("--seed-safe-area-top");
      expect(output).toContain("--seed-other-var: 10px");
    });

    it("빈 룰을 제거한다", async () => {
      const input = `
        :root {
          --seed-safe-area-top: 0px;
          --seed-safe-area-bottom: 0px;
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output.trim()).toBe("");
    });

    it("@supports unwrap + replaceVarWithEnv 통합 동작한다", async () => {
      const input = `
        :root { --seed-safe-area-top: 0px; }
        @supports (left: constant(safe-area-inset-left)) {
          :root { --seed-safe-area-top: constant(safe-area-inset-top); }
        }
        @supports (left: env(safe-area-inset-left)) {
          :root { --seed-safe-area-top: env(safe-area-inset-top); }
        }
        .seed-app-bar {
          padding-top: var(--seed-safe-area-top);
          height: calc(44px + var(--seed-safe-area-top));
        }
      `;
      const output = await run(input);
      // @supports 처리됨
      expect(output).not.toContain("@supports");
      expect(output).not.toContain("constant(");
      // safe-area 커스텀 프로퍼티 정의 제거됨
      expect(output).not.toContain("--seed-safe-area-top");
      // var() → env() 치환됨
      expect(output).toContain("padding-top: env(safe-area-inset-top)");
      expect(output).toContain("height: calc(44px + env(safe-area-inset-top))");
    });

    it("빈 배열로 비활성화할 수 있다", async () => {
      const input = `
        .seed-app-bar {
          padding-top: var(--seed-safe-area-top);
        }
      `;
      const output = await run(input, { replaceVarWithEnv: [] });
      expect(output).toContain("var(--seed-safe-area-top)");
    });
  });

  describe("env() fallback strip", () => {
    it("env(name, fallback) → env(name)으로 fallback을 제거한다", async () => {
      const input = `
        .snackbar-region {
          left: calc(env(safe-area-inset-left, 0px));
          right: calc(env(safe-area-inset-right, 0px));
          bottom: calc(env(safe-area-inset-bottom, 0px) + var(--snackbar-region-offset, 0px));
        }
      `;
      const output = await run(input, { replaceVarWithEnv: [] });
      expect(output).toContain("left: calc(env(safe-area-inset-left))");
      expect(output).toContain("right: calc(env(safe-area-inset-right))");
      expect(output).toContain(
        "bottom: calc(env(safe-area-inset-bottom) + var(--snackbar-region-offset, 0px))",
      );
    });

    it("fallback 없는 env()는 그대로 유지한다", async () => {
      const input = `
        .test { padding-top: env(safe-area-inset-top); }
      `;
      const output = await run(input, { replaceVarWithEnv: [] });
      expect(output).toContain("padding-top: env(safe-area-inset-top)");
    });

    it("replaceVarWithEnv와 함께 동작한다", async () => {
      const input = `
        page { --seed-safe-area-top: env(safe-area-inset-top); }
        .app-bar { padding-top: var(--seed-safe-area-top); }
        .snackbar { bottom: calc(env(safe-area-inset-bottom, 0px)); }
      `;
      const output = await run(input);
      // replaceVarWithEnv: var() → env() (fallback 없이 생성)
      expect(output).toContain("padding-top: env(safe-area-inset-top)");
      // 직접 작성된 env() fallback도 strip됨
      expect(output).toContain("bottom: calc(env(safe-area-inset-bottom))");
      expect(output).not.toContain("0px");
    });
  });

  describe("플랫폼 셀렉터 매핑", () => {
    it("[data-seed-platform='ios']를 .seed-platform-ios로 변환한다", async () => {
      const input = '[data-seed-platform="ios"] { --seed-custom-var: 1.35; }';
      const output = await run(input);
      expect(output).toContain(".seed-platform-ios");
      expect(output).not.toContain("[data-seed-platform");
    });
  });

  describe("rem → px 변환", () => {
    it("CSS custom property 내 rem을 px로 변환한다 (1rem = 16px)", async () => {
      const input =
        ":root { --seed-font-size-t5: calc(1rem * var(--seed-font-size-multiplier, 1)); }";
      const output = await run(input);
      expect(output).toContain("16px");
      expect(output).not.toContain("1rem");
    });

    it("소수점 rem을 변환한다 (.6875rem → 11px)", async () => {
      const input =
        ":root { --seed-font-size-t1: calc(.6875rem * var(--seed-font-size-multiplier, 1)); }";
      const output = await run(input);
      expect(output).toContain("11px");
      expect(output).not.toContain(".6875rem");
    });

    it("일반 프로퍼티의 rem도 변환한다", async () => {
      const input = ".text { font-size: 1.5rem; }";
      const output = await run(input);
      expect(output).toContain("font-size: 24px");
    });

    it("em은 변환하지 않는다", async () => {
      const input = ".text { font-size: 1.5em; }";
      const output = await run(input);
      expect(output).toContain("font-size: 1.5em");
    });
  });

  describe("font-size-multiplier calc() 해소", () => {
    it("calc(<px> * var(--seed-font-size-multiplier, 1)) → <px>", async () => {
      const input =
        ":root { --seed-font-size-t1: calc(.6875rem * var(--seed-font-size-multiplier, 1)); }";
      const output = await run(input);
      // rem→px 변환 후 calc 해소: calc(11px * var(..., 1)) → 11px
      expect(output).toContain("--seed-font-size-t1: 11px");
      expect(output).not.toContain("calc(");
    });

    it("다른 var()는 건드리지 않는다", async () => {
      const input =
        ":root { --seed-enter-translate-x: calc(var(--swipe-back-displacement, 0) * 0.15); }";
      const output = await run(input);
      expect(output).toContain("calc(var(--swipe-back-displacement, 0) * 0.15)");
    });
  });

  describe("static 토큰 + multiplier/limit 제거", () => {
    it("--seed-font-size-*-static 선언을 제거한다", async () => {
      const input = ":root { --seed-font-size-t1-static: 11px; --seed-font-size-t1: 11px; }";
      const output = await run(input);
      expect(output).not.toContain("--seed-font-size-t1-static");
      expect(output).toContain("--seed-font-size-t1: 11px");
    });

    it("--seed-font-size-multiplier 선언을 제거한다", async () => {
      const input = ":root { --seed-font-size-multiplier: 1; --seed-font-size-t1: 11px; }";
      const output = await run(input);
      expect(output).not.toContain("--seed-font-size-multiplier");
      expect(output).toContain("--seed-font-size-t1");
    });

    it("--seed-font-size-limit-* 선언을 제거한다", async () => {
      const input =
        ":root { --seed-font-size-limit-min: .8; --seed-font-size-limit-max: 1.5; --seed-font-size-t1: 11px; }";
      const output = await run(input);
      expect(output).not.toContain("--seed-font-size-limit-min");
      expect(output).not.toContain("--seed-font-size-limit-max");
    });

    it("--seed-line-height-*-static 선언을 제거한다", async () => {
      const input = ":root { --seed-line-height-t1-static: 15px; --seed-line-height-t1: 15px; }";
      const output = await run(input);
      expect(output).not.toContain("--seed-line-height-t1-static");
      expect(output).toContain("--seed-line-height-t1: 15px");
    });
  });
});
