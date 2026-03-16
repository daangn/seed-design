import { describe, expect, it } from "vitest";
import { run } from "./helpers";

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

  describe("빈 룰 제거", () => {
    it("모든 declaration이 제거된 빈 룰을 정리한다", async () => {
      const input = `
        .seed-color-mode-light-only {
          color-scheme: light;
        }
      `;
      const output = await run(input, { warnOnly: false });
      // color-scheme은 removeProperties에 등록됨 → 제거 → 빈 룰 → 제거
      expect(output).not.toContain(".seed-color-mode-light-only");
    });
  });
});
