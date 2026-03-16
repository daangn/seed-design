import { describe, expect, it } from "vitest";
import { run } from "./helpers";

describe("postcss-lynx-compat", () => {
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

  describe("selectorMappings", () => {
    it("data-attribute selector를 class selector로 변환한다", async () => {
      const input = `
        page[data-seed-color-mode="dark-only"] {
          --fg-neutral: #f3f4f5;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [
          { match: 'color-mode="dark-only"', replace: ".seed-color-mode-dark-only" },
        ],
      });
      expect(output).toContain("page.seed-color-mode-dark-only");
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
          { match: 'color-mode="dark-only"', replace: ".seed-color-mode-dark-only" },
          { match: 'color-mode="light-only"', replace: ".seed-color-mode-light-only" },
        ],
      });
      expect(output).toContain("page.seed-color-mode-dark-only");
      expect(output).toContain("page.seed-color-mode-light-only");
    });

    it("콤마 구분 셀렉터에서 각각 변환한다", async () => {
      const input = `
        page, page[data-seed-color-mode="light-only"] {
          --fg: #000;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [
          { match: 'color-mode="light-only"', replace: ".seed-color-mode-light-only" },
        ],
      });
      expect(output).toContain("page.seed-color-mode-light-only");
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
        selectorMappings: [
          { match: 'color-mode="dark-only"', replace: ".seed-color-mode-dark-only" },
        ],
      });
      // selectorMappings는 매칭 안 됨 → Phase 1의 [data-X] 변환이 처리
      expect(output).toContain("--disabled_true");
    });

    it("매핑 후 빈 셀렉터를 필터링한다", async () => {
      const input = `
        page, [data-seed-color-mode="system"] {
          --seed-token: red;
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

    it("user-color-scheme를 class selector로 변환한다", async () => {
      const input = `
        page[data-seed-color-mode="system"][data-seed-user-color-scheme="dark"] {
          --fg: #fff;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [
          { match: 'user-color-scheme="dark"', replace: ".seed-user-color-scheme-dark" },
          { match: 'color-mode="system"', replace: "" },
        ],
      });
      expect(output).toContain("page.seed-user-color-scheme-dark");
      expect(output).not.toContain("[data-seed-user-color-scheme");
      expect(output).not.toContain("[data-seed-color-mode");
    });

    it("descendant selector에서 color-mode를 독립 class로 변환한다", async () => {
      const input = `
        page [data-seed-color-mode="dark-only"] {
          --fg: #fff;
        }
      `;
      const output = await run(input, {
        warnOnly: true,
        selectorMappings: [
          { match: 'color-mode="dark-only"', replace: ".seed-color-mode-dark-only" },
        ],
      });
      expect(output).toContain(".seed-color-mode-dark-only");
    });
  });
});
