import { describe, expect, it } from "vitest";
import { run } from "./helpers";

describe("postcss-lynx-compat", () => {
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

  describe("text slot: 테마 셀렉터 스킵", () => {
    it(".seed-color-mode-* 셀렉터는 text slot 분리하지 않는다", async () => {
      const input = `
        :root, :root.seed-color-mode-light-only {
          --seed-color-fg: #1a1c20;
          --seed-color-bg: #fff;
        }
        :root.seed-color-mode-dark-only {
          --seed-color-fg: #f3f4f5;
          --seed-color-bg: #000;
        }
        .seed-action-button {
          color: var(--seed-color-fg);
          display: inline-flex;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        textSlot: {
          suffix: "__text",
          textProperties: ["color", "font-size"],
          sharedProperties: [],
        },
      });
      // 테마 셀렉터에 __text suffix가 추가되면 안 됨
      expect(output).not.toContain("seed-color-mode-light-only__text");
      expect(output).not.toContain("seed-color-mode-dark-only__text");
      // 컴포넌트 셀렉터에는 __text가 정상 추가됨
      expect(output).toContain("seed-action-button__text");
    });

    it(".seed-user-color-scheme-* 셀렉터는 text slot 분리하지 않는다", async () => {
      const input = `
        :root.seed-user-color-scheme-dark {
          --seed-color-fg: #f3f4f5;
          --seed-color-bg: #000;
        }
        .seed-action-button {
          color: var(--seed-color-fg);
          display: inline-flex;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        textSlot: {
          suffix: "__text",
          textProperties: ["color", "font-size"],
          sharedProperties: [],
        },
      });
      expect(output).not.toContain("seed-user-color-scheme-dark__text");
      expect(output).toContain("seed-action-button__text");
    });

    it("컴포넌트+테마 조합 셀렉터는 text slot 분리한다", async () => {
      const input = `
        .seed-action-button.seed-color-mode-dark-only {
          color: red;
          display: inline-flex;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        textSlot: {
          suffix: "__text",
          textProperties: ["color"],
          sharedProperties: [],
        },
      });
      // 컴포넌트 + 테마 조합은 text slot 처리됨
      expect(output).toContain("seed-action-button__text");
    });
  });
});
