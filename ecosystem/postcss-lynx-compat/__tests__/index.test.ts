import postcss from "postcss";
import { describe, expect, it } from "vitest";
import { postcssLynxCompat } from "../src/index";

async function run(input: string, opts = {}) {
  const result = await postcss([postcssLynxCompat(opts)]).process(input, { from: undefined });
  return result.css;
}

describe("postcss-lynx-compat", () => {
  describe("프로퍼티 제거 (remove)", () => {
    it("cursor를 제거한다", async () => {
      const input = ".btn { cursor: pointer; display: flex; }";
      const output = await run(input);
      expect(output).not.toContain("cursor");
      expect(output).toContain("display: flex");
    });

    it("box-sizing을 제거한다", async () => {
      const input = ".box { box-sizing: border-box; width: 100px; }";
      const output = await run(input);
      expect(output).not.toContain("box-sizing");
      expect(output).toContain("width: 100px");
    });

    it("text-transform을 제거한다", async () => {
      const input = ".text { text-transform: none; color: red; }";
      const output = await run(input);
      expect(output).not.toContain("text-transform");
      expect(output).toContain("color: red");
    });

    it("여러 웹 전용 프로퍼티를 한번에 제거한다", async () => {
      const input = `.btn {
        cursor: pointer;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        user-select: none;
        display: flex;
      }`;
      const output = await run(input);
      expect(output).not.toContain("cursor");
      expect(output).not.toContain("-webkit-font-smoothing");
      expect(output).not.toContain("-moz-osx-font-smoothing");
      expect(output).not.toContain("user-select");
      expect(output).toContain("display: flex");
    });
  });

  describe("@media 규칙 제거 (removeAtRules)", () => {
    it("@media (hover: hover) 블록을 제거한다", async () => {
      const input = `
        .btn { display: flex; }
        @media (hover: hover) { .btn:hover { background: red; } }
      `;
      const output = await run(input);
      expect(output).not.toContain("@media");
      expect(output).not.toContain("hover");
      expect(output).toContain("display: flex");
    });

    it("@media (hover: none) 블록을 제거한다", async () => {
      const input = `
        @media (hover: none) { .btn:active { background: blue; } }
      `;
      const output = await run(input);
      expect(output.trim()).toBe("");
    });
  });

  describe("셀렉터 변환 (transformSelectors)", () => {
    it(":--engaged를 :active로 변환한다", async () => {
      const input = ".btn:--engaged { background: red; }";
      const output = await run(input);
      expect(output).toContain(".btn:active");
      expect(output).not.toContain(":--engaged");
    });

    it(":is(:disabled, [disabled], [data-disabled])를 --disabled_true 클래스로 변환한다", async () => {
      const input = ".btn:is(:disabled, [disabled], [data-disabled]) { opacity: 0.4; }";
      const output = await run(input);
      // transformSelectors에서 [data-disabled]로 통합 → Phase 1에서 --disabled_true 클래스로 변환
      expect(output).toContain(".btn--disabled_true");
      expect(output).not.toContain("[data-disabled]");
      expect(output).not.toContain(":is(");
    });

    it(":is(:active, [data-active])를 :active로 변환한다", async () => {
      const input = ".btn:is(:active, [data-active]) { background: blue; }";
      const output = await run(input);
      expect(output).toContain(".btn:active");
    });
  });

  describe("셀렉터 제거 (removeSelectors)", () => {
    it(":focus-visible 포함 룰을 제거한다", async () => {
      const input = `
        .btn { display: flex; }
        .btn:focus-visible { outline: 2px solid blue; }
      `;
      const output = await run(input);
      expect(output).not.toContain("focus-visible");
      expect(output).toContain("display: flex");
    });

    it("::-webkit-scrollbar 포함 룰을 제거한다", async () => {
      const input = `
        .scroll { overflow: auto; }
        .scroll::-webkit-scrollbar { display: none; }
      `;
      const output = await run(input);
      expect(output).not.toContain("::-webkit-scrollbar");
      expect(output).toContain("overflow: auto");
    });
  });

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
      expect(output).toContain("--size: 1rem");
    });

    it("clampStrategy: max를 지원한다", async () => {
      const input = ":root { --size: clamp(1rem, 2vw, 1.5rem); }";
      const output = await run(input, { clampStrategy: "max" });
      expect(output).toContain("--size: 1.5rem");
    });
  });

  describe("CSS 커스텀 프로퍼티 통과", () => {
    it("--* 프로퍼티는 항상 통과한다", async () => {
      const input = ".btn { --seed-color: red; --custom-var: 10px; }";
      const output = await run(input);
      expect(output).toContain("--seed-color: red");
      expect(output).toContain("--custom-var: 10px");
    });
  });

  describe("suggestions (빌드 에러)", () => {
    it("suggestion 등록 프로퍼티는 대안과 함께 에러를 던진다", async () => {
      const input = ".box { some-prop: value; }";
      await expect(
        run(input, { suggestions: { "some-prop": "→ 대안을 사용하세요" } }),
      ).rejects.toThrow("some-prop");
    });

    it("overscroll-behavior는 remove 목록에서 조용히 제거된다", async () => {
      const input = ".scroll { overscroll-behavior: none; color: red; }";
      const result = await run(input);
      expect(result).not.toContain("overscroll-behavior");
      expect(result).toContain("color");
    });

    it("grid-column은 remove 목록에서 조용히 제거된다", async () => {
      const input = ".grid { grid-column: 1 / 3; color: red; }";
      const result = await run(input);
      expect(result).not.toContain("grid-column");
      expect(result).toContain("color");
    });
  });

  describe("미등록 프로퍼티", () => {
    it("미등록 프로퍼티는 기본적으로 에러를 던진다", async () => {
      const input = ".box { some-unknown-property: value; }";
      await expect(run(input)).rejects.toThrow("등록되지 않았습니다");
    });

    it("warnOnly: true이면 에러 대신 경고한다", async () => {
      const input = ".box { display: flex; }";
      // display는 supported, 에러가 안 나야 함
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("display: flex");
    });
  });

  describe("지원 프로퍼티 통과", () => {
    it("display, flex 관련 프로퍼티는 통과한다", async () => {
      const input = `.btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }`;
      const output = await run(input);
      expect(output).toContain("display: inline-flex");
      expect(output).toContain("align-items: center");
      expect(output).toContain("justify-content: center");
      expect(output).toContain("gap: 4px");
    });

    it("color, background 프로퍼티는 통과한다", async () => {
      const input = `.btn {
        color: var(--seed-color-fg);
        background-color: var(--seed-color-bg);
        border-radius: 8px;
        opacity: 0.5;
      }`;
      const output = await run(input);
      expect(output).toContain("color: var(--seed-color-fg)");
      expect(output).toContain("background-color: var(--seed-color-bg)");
      expect(output).toContain("border-radius: 8px");
      expect(output).toContain("opacity: 0.5");
    });
  });

  describe("Phase 5: Text Slot Splitting (textSlot)", () => {
    it("base rule을 view/text로 분리한다", async () => {
      const input = `.seed-action-button {
        display: inline-flex;
        color: var(--seed-fg);
        background-color: var(--seed-bg);
        font-size: 16px;
      }`;
      const output = await run(input);
      // view rule: display, background-color 유지 (color, font-size는 text 전용)
      expect(output).toContain(".seed-action-button");
      expect(output).toContain("display: inline-flex");
      expect(output).toContain("background-color: var(--seed-bg)");

      // text rule: color, font-size
      expect(output).toContain(".seed-action-button__text");
      expect(output).toMatch(/\.seed-action-button__text\s*\{[^}]*color: var\(--seed-fg\)/);
      expect(output).toMatch(/\.seed-action-button__text\s*\{[^}]*font-size: 16px/);
    });

    it("variant rule도 분리한다", async () => {
      const input = `.seed-action-button--variant_brandSolid {
        background-color: blue;
        color: white;
        font-weight: 700;
      }`;
      const output = await run(input);
      // view rule
      expect(output).toContain(".seed-action-button--variant_brandSolid");
      expect(output).toContain("background-color: blue");
      // text rule
      expect(output).toContain(".seed-action-button__text--variant_brandSolid");
      expect(output).toMatch(
        /\.seed-action-button__text--variant_brandSolid\s*\{[^}]*color: white/,
      );
      expect(output).toMatch(
        /\.seed-action-button__text--variant_brandSolid\s*\{[^}]*font-weight: 700/,
      );
    });

    it("compound variant 셀렉터를 __text로 치환한다", async () => {
      const input = `.seed-action-button--variant_brandSolid.seed-action-button--size_small {
        color: red;
        padding-top: 4px;
      }`;
      const output = await run(input);
      // compound text selector
      expect(output).toContain(
        ".seed-action-button__text--variant_brandSolid.seed-action-button__text--size_small",
      );
    });

    it("CSS custom properties는 양쪽에 유지한다", async () => {
      const input = `.seed-action-button {
        --seed-color-fg: red;
        --seed-color-bg: blue;
        display: flex;
        color: var(--seed-color-fg);
      }`;
      const output = await run(input);
      // view rule에 CSS vars 유지
      expect(output).toMatch(/\.seed-action-button\s*\{[^}]*--seed-color-fg: red/);
      // text rule에도 CSS vars 유지
      expect(output).toMatch(/\.seed-action-button__text\s*\{[^}]*--seed-color-fg: red/);
    });

    it("shared properties는 양쪽에 유지한다", async () => {
      const input = `.seed-action-button {
        display: flex;
        opacity: 0.5;
        transition: color 0.1s;
        color: red;
      }`;
      const output = await run(input);
      // view rule에 shared props 유지
      expect(output).toMatch(/\.seed-action-button\s*\{[^}]*opacity: 0\.5/);
      expect(output).toMatch(/\.seed-action-button\s*\{[^}]*transition: color 0\.1s/);
      // text rule에도 shared props 유지
      expect(output).toMatch(/\.seed-action-button__text\s*\{[^}]*opacity: 0\.5/);
      expect(output).toMatch(/\.seed-action-button__text\s*\{[^}]*transition: color 0\.1s/);
    });

    it("SlotRecipe CSS (__ 포함 셀렉터)는 분리하지 않는다", async () => {
      const input = `.seed-avatar__image {
        color: red;
        display: flex;
      }`;
      const output = await run(input);
      // __text 셀렉터가 생성되지 않아야 함
      expect(output).not.toContain("__image__text");
      expect(output).toContain(".seed-avatar__image");
      expect(output).toContain("color: red");
    });

    it("text 전용 프로퍼티만 있는 rule은 원래 rule을 제거한다", async () => {
      const input = `.seed-action-button--size_small {
        color: red;
        font-size: 14px;
        font-weight: 500;
      }`;
      const output = await run(input);
      // text rule만 남아야 함
      expect(output).toContain(".seed-action-button__text--size_small");
      expect(output).toMatch(/\.seed-action-button__text--size_small\s*\{[^}]*color: red/);
      // 원래 rule은 빈 body이므로 제거됨 (view-only도 shared도 CSS var도 없음)
      // seed-action-button--size_small이 __text 없이 단독으로 존재하면 안 됨
      const lines = output.split("\n").map((l: string) => l.trim());
      const viewRuleExists = lines.some(
        (l: string) => l.includes(".seed-action-button--size_small") && !l.includes("__text"),
      );
      expect(viewRuleExists).toBe(false);
    });

    it("text properties가 없으면 분리하지 않는다", async () => {
      const input = `.seed-action-button {
        display: flex;
        background-color: red;
        padding-top: 8px;
      }`;
      const output = await run(input);
      // view-only 프로퍼티만 → __text 생성 안 됨
      expect(output).not.toContain("__text");
      expect(output).toContain("display: flex");
      expect(output).toContain("background-color: red");
    });

    it("seed- 접두사가 없는 rule은 분리하지 않는다", async () => {
      const input = `.my-button {
        display: flex;
        color: red;
        font-size: 14px;
      }`;
      const output = await run(input, { warnOnly: true });
      expect(output).not.toContain("__text");
      expect(output).toContain("color: red");
    });

    it("data attribute가 클래스로 변환된 셀렉터도 올바르게 분리한다", async () => {
      const input = `.seed-action-button--variant_brandSolid[data-disabled] {
        color: gray;
        background-color: lightgray;
      }`;
      const output = await run(input);
      // [data-disabled] → --disabled_true 클래스로 변환 후 text slot 분리
      expect(output).toContain("seed-action-button--disabled_true");
      expect(output).toContain("seed-action-button__text--disabled_true");
    });
  });

  describe("[data-*] 속성 셀렉터 → 클래스 변환", () => {
    it("[data-disabled]를 --disabled_true 클래스로 변환한다", async () => {
      const input = `.seed-action-button[data-disabled] { opacity: 0.4; }`;
      const output = await run(input);
      expect(output).toContain(".seed-action-button--disabled_true");
      expect(output).not.toContain("[data-disabled]");
    });

    it("[data-loading]를 --loading_true 클래스로 변환한다", async () => {
      const input = `.seed-action-button[data-loading] { opacity: 0.6; }`;
      const output = await run(input);
      expect(output).toContain(".seed-action-button--loading_true");
      expect(output).not.toContain("[data-loading]");
    });

    it("variant + [data-disabled] compound 셀렉터를 변환한다", async () => {
      const input = `.seed-action-button--variant_brandSolid[data-disabled] { background-color: gray; }`;
      const output = await run(input);
      expect(output).toContain(
        ".seed-action-button--variant_brandSolid.seed-action-button--disabled_true",
      );
      expect(output).not.toContain("[data-disabled]");
    });

    it("__text 슬롯 + [data-disabled]를 변환한다", async () => {
      const input = `.seed-action-button__text--variant_brandSolid[data-disabled] { color: gray; }`;
      const output = await run(input);
      expect(output).toContain(
        ".seed-action-button__text--variant_brandSolid.seed-action-button__text--disabled_true",
      );
      expect(output).not.toContain("[data-disabled]");
    });

    it("[data-hover] 포함 룰을 제거한다", async () => {
      const input = `
        .seed-action-button { display: flex; }
        .seed-action-button[data-hover] { background: blue; }
      `;
      const output = await run(input);
      expect(output).not.toContain("[data-hover]");
      expect(output).toContain("display: flex");
    });

    it('[data-X="value"] 패턴을 --X_value로 변환한다', async () => {
      const input = `.seed-component[data-state="checked"] { background: green; }`;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain(".seed-component--state_checked");
      expect(output).not.toContain("[data-state=");
    });
  });

  describe("transition 값 필터링", () => {
    it("transition에서 미지원 프로퍼티(outline-color) 항목을 제거한다", async () => {
      const input = `.btn {
        transition: background-color 0.1s ease, outline-color 0.15s ease;
      }`;
      const output = await run(input);
      expect(output).toContain("background-color 0.1s ease");
      expect(output).not.toContain("outline-color");
    });

    it("transition의 모든 항목이 미지원이면 선언 자체를 제거한다", async () => {
      const input = `.btn {
        display: flex;
        transition: outline-color 0.1s, cursor 0.2s;
      }`;
      const output = await run(input);
      expect(output).not.toContain("transition");
      expect(output).toContain("display: flex");
    });

    it("transition-property에서 미지원 프로퍼티를 제거한다", async () => {
      const input = `.btn {
        transition-property: background-color, outline-color, opacity;
      }`;
      const output = await run(input);
      expect(output).toContain("background-color");
      expect(output).toContain("opacity");
      expect(output).not.toContain("outline-color");
    });

    it("var() 포함 transition 값을 올바르게 처리한다", async () => {
      const input = `.btn {
        transition: background-color var(--dur) var(--ease), outline-color var(--dur) var(--ease);
      }`;
      const output = await run(input);
      expect(output).toContain("background-color var(--dur) var(--ease)");
      expect(output).not.toContain("outline-color");
    });

    it("지원 프로퍼티만 있으면 transition을 그대로 유지한다", async () => {
      const input = `.btn {
        transition: background-color 0.1s ease, color 0.1s ease;
      }`;
      const output = await run(input);
      expect(output).toContain("background-color 0.1s ease, color 0.1s ease");
    });
  });

  describe("중첩 CSS variable 해소 (resolveNestedVars)", () => {
    it("page 셀렉터 내 1단계 중첩 var()를 해소한다", async () => {
      const input = `
        page {
          --color-raw: #fa6616;
          --color-bg: var(--color-raw);
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("--color-raw: #fa6616");
      expect(output).toContain("--color-bg: #fa6616");
      expect(output).not.toMatch(/--color-bg:\s*var\(/);
    });

    it("page 셀렉터 내 2단계 중첩 var()를 해소한다", async () => {
      const input = `
        page {
          --base: 16px;
          --spacing: var(--base);
          --pad: var(--spacing);
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("--base: 16px");
      expect(output).toContain("--spacing: 16px");
      expect(output).toContain("--pad: 16px");
    });

    it("calc() 내 var()도 해소한다", async () => {
      const input = `
        page {
          --size: 10px;
          --half-size: calc(var(--size) / 2);
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("--half-size: calc(10px / 2)");
    });

    it("page에 없는 변수 참조는 그대로 유지한다", async () => {
      const input = `
        page {
          --known: 10px;
        }
        .seed-btn {
          --local: var(--unknown);
          padding: var(--known);
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("--local: var(--unknown)");
    });

    it("컴포넌트 셀렉터의 커스텀 프로퍼티에서도 page 토큰 참조를 해소한다", async () => {
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
      expect(output).toContain("--btn-bg: #fa6616");
      expect(output).toContain("--btn-pad: 16px");
    });

    it("page[data-*] 셀렉터도 해소 대상이다", async () => {
      const input = `
        page, page[data-seed-color-mode="light"] {
          --palette: #333;
          --fg-color: var(--palette);
        }
      `;
      const output = await run(input, { warnOnly: true });
      expect(output).toContain("--fg-color: #333");
    });
  });

  describe("resolveVarScope: page-only", () => {
    it("page 토큰 정의의 중첩 var()는 해소한다", async () => {
      const input = `
        page {
          --palette-gray: #1a1c20;
          --fg-neutral: var(--palette-gray);
        }
      `;
      const output = await run(input, { warnOnly: true, resolveVarScope: "page-only" });
      expect(output).toContain("--palette-gray: #1a1c20");
      expect(output).toContain("--fg-neutral: #1a1c20");
    });

    it("컴포넌트 CSS의 커스텀 프로퍼티 정의 내 var()도 해소한다", async () => {
      const input = `
        page {
          --palette-gray: #1a1c20;
          --fg-neutral: var(--palette-gray);
          --dimension-x4: 16px;
        }
        .seed-btn {
          --btn-color: var(--fg-neutral);
          --btn-padding: var(--dimension-x4);
        }
      `;
      const output = await run(input, { warnOnly: true, resolveVarScope: "page-only" });
      // page 내부는 flatten
      expect(output).toContain("--fg-neutral: #1a1c20");
      // 컴포넌트 커스텀 프로퍼티도 flatten (Lynx nested var 미지원)
      expect(output).toContain("--btn-color: #1a1c20");
      expect(output).toContain("--btn-padding: 16px");
    });

    it("일반 프로퍼티의 var() 참조는 보존한다", async () => {
      const input = `
        page {
          --fg-neutral: #1a1c20;
          --dimension-x4: 16px;
        }
        .seed-btn {
          color: var(--fg-neutral);
          padding-left: var(--dimension-x4);
        }
      `;
      const output = await run(input, { warnOnly: true, resolveVarScope: "page-only" });
      // 일반 프로퍼티의 var()는 보존 (테마 오버라이드 가능)
      expect(output).toContain("color: var(--fg-neutral)");
      expect(output).toContain("padding-left: var(--dimension-x4)");
    });

    it("page.class 셀렉터도 page-only 해소 대상이다", async () => {
      const input = `
        page.seed-theme-dark {
          --palette-gray: #f3f4f5;
          --fg-neutral: var(--palette-gray);
        }
      `;
      const output = await run(input, { warnOnly: true, resolveVarScope: "page-only" });
      expect(output).toContain("--fg-neutral: #f3f4f5");
    });

    it("resolveVarScope: all (기본값)이면 컴포넌트 var()도 해소한다", async () => {
      const input = `
        page {
          --palette-gray: #1a1c20;
          --fg-neutral: var(--palette-gray);
        }
        .seed-btn {
          --btn-color: var(--fg-neutral);
        }
      `;
      const output = await run(input, { warnOnly: true, resolveVarScope: "all" });
      expect(output).toContain("--btn-color: #1a1c20");
    });
  });

  describe("selectorMappings", () => {
    it("data-attribute selector를 class selector로 변환한다", async () => {
      const input = `
        page[data-seed-color-mode="dark-only"] {
          --fg-neutral: #f3f4f5;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [{ match: 'color-mode="dark-only"', replace: ".seed-theme-dark" }],
      });
      expect(output).toContain("page.seed-theme-dark");
      expect(output).not.toContain("[data-seed-color-mode");
    });

    it("여러 매핑 규칙을 적용한다", async () => {
      const input = `
        page[data-seed-color-mode="dark-only"] {
          --fg: #fff;
        }
        page[data-seed-color-mode="light-only"] {
          --fg: #000;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [
          { match: 'color-mode="dark-only"', replace: ".seed-theme-dark" },
          { match: 'color-mode="light-only"', replace: ".seed-theme-light" },
        ],
      });
      expect(output).toContain("page.seed-theme-dark");
      expect(output).toContain("page.seed-theme-light");
    });

    it("콤마 구분 셀렉터에서 각각 변환한다", async () => {
      const input = `
        page, page[data-seed-color-mode="light-only"] {
          --fg: #000;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [{ match: 'color-mode="light-only"', replace: ".seed-theme-light" }],
      });
      expect(output).toContain("page.seed-theme-light");
      expect(output).toContain("page,");
    });

    it("매칭되지 않는 selector는 변경하지 않는다", async () => {
      const input = `
        .seed-btn[data-disabled] {
          opacity: 0.4;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [{ match: 'color-mode="dark-only"', replace: ".seed-theme-dark" }],
      });
      // selectorMappings는 매칭 안 됨 → Phase 1의 [data-X] 변환이 처리
      expect(output).toContain("--disabled_true");
    });

    it("매핑 후 빈 셀렉터를 필터링한다", async () => {
      const input = `
        page, [data-seed-color-mode="system"] {
          color-scheme: light dark;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [{ match: 'color-mode="system"', replace: "" }],
      });
      expect(output).not.toContain("page,  {");
      expect(output).not.toContain("page, {");
      expect(output).toContain("page {");
    });

    it("모든 셀렉터가 빈 경우 룰 자체를 제거한다", async () => {
      const input = `
        [data-seed-color-mode="system"] {
          color-scheme: light dark;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [{ match: 'color-mode="system"', replace: "" }],
      });
      expect(output.trim()).toBe("");
    });
  });

  describe("통합: 테마 지원 (page-only + selectorMappings)", () => {
    it("토큰 flatten + 커스텀 프로퍼티 resolve + 일반 프로퍼티 var() 보존 + 테마 selector 변환", async () => {
      const input = `
        page, page[data-seed-color-mode="light-only"] {
          --palette-gray-1000: #1a1c20;
          --fg-neutral: var(--palette-gray-1000);
          --dimension-x4: 16px;
        }
        page[data-seed-color-mode="dark-only"] {
          --palette-gray-100: #f3f4f5;
          --fg-neutral: var(--palette-gray-100);
        }
        .seed-action-button {
          --seed-box-color: var(--fg-neutral);
          --seed-box-padding: var(--dimension-x4);
          color: var(--fg-neutral);
          padding-left: var(--seed-box-padding);
          display: inline-flex;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        resolveVarScope: "page-only",
        selectorMappings: [
          { match: 'color-mode="dark-only"', replace: ".seed-theme-dark" },
          { match: 'color-mode="light-only"', replace: ".seed-theme-light" },
        ],
      });

      // 토큰 정의: nested var() flatten
      expect(output).toContain("--fg-neutral: #1a1c20");
      expect(output).toContain("--fg-neutral: #f3f4f5");

      // 테마 selector: class로 변환
      expect(output).toContain("page.seed-theme-dark");
      expect(output).toContain("page.seed-theme-light");
      expect(output).not.toContain("[data-seed-color-mode");

      // 컴포넌트 커스텀 프로퍼티: nested var() resolve (Lynx 미지원)
      expect(output).toContain("--seed-box-color: #1a1c20");
      expect(output).toContain("--seed-box-padding: 16px");

      // 일반 프로퍼티: var() 참조 보존 (테마 전환 가능)
      expect(output).toContain("color: var(--fg-neutral)");
    });
  });

  describe("통합 시나리오: 웹 action-button base 변환", () => {
    it("웹 action-button base 스타일을 Lynx 호환으로 변환한다", async () => {
      const input = `
        .seed-action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          cursor: pointer;
          text-transform: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          vertical-align: middle;
          text-decoration: none;
          color: var(--seed-box-fg);
          background-color: var(--seed-box-bg);
          border-color: var(--seed-box-stroke-color);
          border-radius: var(--seed-box-corner-radius);
          padding-top: var(--seed-box-padding-y);
          padding-bottom: var(--seed-box-padding-y);
          padding-left: var(--seed-box-padding-x);
          padding-right: var(--seed-box-padding-x);
          gap: var(--seed-box-gap);
          opacity: 1;
          transition: background-color 0.1s, color 0.1s;
        }
      `;
      const output = await run(input);

      // 제거됨
      expect(output).not.toContain("box-sizing");
      expect(output).not.toContain("cursor");
      expect(output).not.toContain("text-transform");
      expect(output).not.toContain("-webkit-font-smoothing");
      expect(output).not.toContain("-moz-osx-font-smoothing");
      expect(output).not.toContain("vertical-align");
      expect(output).not.toContain("text-decoration");

      // 유지됨
      expect(output).toContain("display: inline-flex");
      expect(output).toContain("align-items: center");
      expect(output).toContain("color: var(--seed-box-fg)");
      expect(output).toContain("background-color: var(--seed-box-bg)");
      expect(output).toContain("padding-top: var(--seed-box-padding-y)");
      expect(output).toContain("gap: var(--seed-box-gap)");
      expect(output).toContain("opacity: 1");
      expect(output).toContain("transition: background-color 0.1s, color 0.1s");
    });
  });
});
