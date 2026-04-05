import { describe, expect, it } from "vitest";
import { run } from "./helpers";

describe("postcss-lynx-compat", () => {
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

  describe("@supports 규칙 처리 (unwrapSupports)", () => {
    it("env(safe-area-inset) @supports 블록을 unwrap한다 (내용 유지, 블록 제거)", async () => {
      const input = `
        page { --seed-safe-area-top: 0px; }
        @supports (left: env(safe-area-inset-left)) {
          page { --seed-safe-area-top: env(safe-area-inset-top); }
        }
      `;
      const output = await run(input, { replaceVarWithEnv: [] });
      expect(output).not.toContain("@supports");
      expect(output).toContain("env(safe-area-inset-top)");
    });

    it("constant(safe-area-inset) @supports 블록을 전체 제거한다", async () => {
      const input = `
        page { --seed-safe-area-top: 0px; }
        @supports (left: constant(safe-area-inset-left)) {
          page { --seed-safe-area-top: constant(safe-area-inset-top); }
        }
      `;
      const output = await run(input, { replaceVarWithEnv: [] });
      expect(output).not.toContain("@supports");
      expect(output).not.toContain("constant(");
    });

    it("safe-area 전체 패턴: constant 제거 + env unwrap", async () => {
      const input = `
        page { --seed-safe-area-top: 0px; --seed-safe-area-bottom: 0px; }
        @supports (left: constant(safe-area-inset-left)) {
          page {
            --seed-safe-area-top: constant(safe-area-inset-top);
            --seed-safe-area-bottom: constant(safe-area-inset-bottom);
          }
        }
        @supports (left: env(safe-area-inset-left)) {
          page {
            --seed-safe-area-top: env(safe-area-inset-top);
            --seed-safe-area-bottom: env(safe-area-inset-bottom);
          }
        }
      `;
      const output = await run(input, { replaceVarWithEnv: [] });
      expect(output).not.toContain("@supports");
      expect(output).not.toContain("constant(");
      expect(output).toContain("env(safe-area-inset-top)");
      expect(output).toContain("env(safe-area-inset-bottom)");
    });

    it("매칭되지 않는 @supports 블록은 유지한다", async () => {
      const input = `
        @supports (display: grid) {
          .container { display: grid; }
        }
      `;
      const output = await run(input);
      expect(output).toContain("@supports");
      expect(output).toContain("display: grid");
    });
  });
});
