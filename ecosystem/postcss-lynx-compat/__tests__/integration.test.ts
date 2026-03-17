import { describe, expect, it } from "vitest";
import { run } from "./helpers";

describe("postcss-lynx-compat", () => {
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
