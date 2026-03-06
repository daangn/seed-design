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
    it(":--engaged를 [data-active]로 변환한다", async () => {
      const input = ".btn:--engaged { background: red; }";
      const output = await run(input);
      expect(output).toContain(".btn[data-active]");
      expect(output).not.toContain(":--engaged");
    });

    it(":is(:disabled, [disabled], [data-disabled])를 [data-disabled]로 변환한다", async () => {
      const input = ".btn:is(:disabled, [disabled], [data-disabled]) { opacity: 0.4; }";
      const output = await run(input);
      expect(output).toContain(".btn[data-disabled]");
      expect(output).not.toContain(":is(");
    });

    it(":is(:active, [data-active])를 [data-active]로 변환한다", async () => {
      const input = ".btn:is(:active, [data-active]) { background: blue; }";
      const output = await run(input);
      expect(output).toContain(".btn[data-active]");
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
