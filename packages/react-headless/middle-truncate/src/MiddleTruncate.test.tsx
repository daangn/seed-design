import * as React from "react";
import { describe, it, expect, afterEach, vi, beforeAll, afterAll } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MiddleTruncate } from "./MiddleTruncate";

afterEach(cleanup);

// --- Test config (reference: react-truncate/test/config/test-config.tsx) ---
const CHARACTER_WIDTH = 6; // px, monospace assumption
const NUM_CHARACTERS = 20;
const CONTAINER_WIDTH = NUM_CHARACTERS * CHARACTER_WIDTH; // 120px

function setupCanvasMock() {
  let origGetContext: typeof HTMLCanvasElement.prototype.getContext;
  let origGetBCR: typeof HTMLElement.prototype.getBoundingClientRect;

  beforeAll(() => {
    origGetContext = HTMLCanvasElement.prototype.getContext;
    origGetBCR = HTMLElement.prototype.getBoundingClientRect;

    // @ts-expect-error -- mock
    HTMLCanvasElement.prototype.getContext = function () {
      return {
        measureText: (text: string) => ({
          width: text.length * CHARACTER_WIDTH,
        }),
        font: "",
        letterSpacing: "",
      } as unknown as CanvasRenderingContext2D;
    };

    HTMLElement.prototype.getBoundingClientRect = function () {
      return { ...new DOMRect(), width: CONTAINER_WIDTH } as DOMRect;
    };
  });

  afterAll(() => {
    HTMLCanvasElement.prototype.getContext = origGetContext;
    HTMLElement.prototype.getBoundingClientRect = origGetBCR;
  });
}

// --- Basic rendering tests ---

describe("MiddleTruncate", () => {
  describe("basic rendering", () => {
    it("should render a span element", () => {
      const { container } = render(<MiddleTruncate>some text</MiddleTruncate>);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("should render children text when no truncation needed", () => {
      const { container } = render(<MiddleTruncate>short.txt</MiddleTruncate>);
      expect(container.textContent).toContain("short.txt");
    });

    it("should forward ref to the root span", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<MiddleTruncate ref={ref}>test</MiddleTruncate>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("should spread additional HTML attributes", () => {
      const { container } = render(
        <MiddleTruncate data-testid="truncate" className="custom">
          text
        </MiddleTruncate>,
      );
      const span = container.querySelector("span");
      expect(span).toHaveAttribute("data-testid", "truncate");
      expect(span).toHaveClass("custom");
    });
  });

  // --- Truncation tests ---

  describe("truncation behavior", () => {
    setupCanvasMock();

    // Container: 120px = 20 chars at 6px each

    it("should not truncate text that fits in one line", async () => {
      // "short-file.txt" = 14 chars = 84px < 120px
      const text = "short-file.txt";
      const { container } = render(<MiddleTruncate end={4}>{text}</MiddleTruncate>);

      await waitFor(() => {
        expect(container.textContent).toBe(text);
      });
    });

    it("should truncate text that overflows one line, preserving end chars", async () => {
      // 26 chars = 156px > 120px (1 line budget)
      // end=4 -> preserve "wxyz" (4*6=24px), ellipsis "\u2026" (1*6=6px)
      // start budget = 120 - 24 - 6 = 90px = 15 chars
      // result = "abcdefghijklmno" + "\u2026" + "wxyz"
      const text = "abcdefghijklmnopqrstuvwxyz";
      const { container } = render(<MiddleTruncate end={4}>{text}</MiddleTruncate>);

      await waitFor(() => {
        expect(container.textContent).toBe("abcdefghijklmno\u2026wxyz");
      });
    });

    it("should support maxLines=2 (text fits in 2 lines)", async () => {
      // 26 chars = 156px, 2-line budget = 240px -> fits without truncation
      const text = "abcdefghijklmnopqrstuvwxyz";
      const { container } = render(
        <MiddleTruncate end={4} maxLines={2}>
          {text}
        </MiddleTruncate>,
      );

      await waitFor(() => {
        expect(container.textContent).toBe(text);
      });
    });

    it("should truncate at 2 lines when text exceeds 2-line budget", async () => {
      // 50 chars = 300px > 240px (2-line budget)
      // end=4 -> preserve ".pdf" (4*6=24px), ellipsis (6px)
      // start budget = 240 - 24 - 6 = 210px = 35 chars
      const text = "a".repeat(46) + ".pdf";
      const { container } = render(
        <MiddleTruncate end={4} maxLines={2}>
          {text}
        </MiddleTruncate>,
      );

      await waitFor(() => {
        const expected = "a".repeat(35) + "\u2026" + ".pdf";
        expect(container.textContent).toBe(expected);
      });
    });

    it("should call onTruncate(true) when text is truncated", async () => {
      const handleTruncate = vi.fn();
      const text = "abcdefghijklmnopqrstuvwxyz";
      render(
        <MiddleTruncate end={4} onTruncate={handleTruncate}>
          {text}
        </MiddleTruncate>,
      );

      await waitFor(() => {
        expect(handleTruncate).toHaveBeenCalledWith(true);
      });
    });

    it("should call onTruncate(false) when text fits", async () => {
      const handleTruncate = vi.fn();
      render(
        <MiddleTruncate end={4} onTruncate={handleTruncate}>
          short.txt
        </MiddleTruncate>,
      );

      await waitFor(() => {
        expect(handleTruncate).toHaveBeenCalledWith(false);
      });
    });

    it("should handle end=0 (no preserved suffix)", async () => {
      // 26 chars > 20 chars budget
      // end=0, ellipsis=1 char -> start budget = 120 - 0 - 6 = 114px = 19 chars
      const text = "abcdefghijklmnopqrstuvwxyz";
      const { container } = render(<MiddleTruncate end={0}>{text}</MiddleTruncate>);

      await waitFor(() => {
        expect(container.textContent).toBe("abcdefghijklmnopqrs\u2026");
      });
    });

    it("should handle custom ellipsis", async () => {
      // "..." = 3 chars = 18px, end=4 = 24px
      // start budget = 120 - 18 - 24 = 78px = 13 chars
      const text = "abcdefghijklmnopqrstuvwxyz";
      const { container } = render(
        <MiddleTruncate end={4} ellipsis="...">
          {text}
        </MiddleTruncate>,
      );

      await waitFor(() => {
        expect(container.textContent).toBe("abcdefghijklm...wxyz");
      });
    });
  });

  // --- Edge case tests ---

  describe("edge cases", () => {
    setupCanvasMock();

    it("should handle empty string", async () => {
      const { container } = render(<MiddleTruncate end={4}>{""}</MiddleTruncate>);
      await waitFor(() => {
        expect(container.textContent).toBe("");
      });
    });

    it("should handle end larger than text length", async () => {
      // end=20 but text "short.txt" is 9 chars -> fits anyway (9*6=54 < 120)
      const text = "short.txt";
      const { container } = render(<MiddleTruncate end={20}>{text}</MiddleTruncate>);
      await waitFor(() => {
        expect(container.textContent).toBe(text);
      });
    });

    it("should handle text exactly fitting the budget", async () => {
      // Exactly 20 chars = 120px = CONTAINER_WIDTH
      const text = "12345678901234567890";
      const { container } = render(<MiddleTruncate end={4}>{text}</MiddleTruncate>);
      await waitFor(() => {
        expect(container.textContent).toBe(text);
      });
    });

    it("should update when children change", async () => {
      const { container, rerender } = render(
        <MiddleTruncate end={4}>{"abcdefghijklmnopqrstuvwxyz"}</MiddleTruncate>,
      );

      await waitFor(() => {
        expect(container.textContent).toContain("\u2026");
      });

      rerender(<MiddleTruncate end={4}>{"short.txt"}</MiddleTruncate>);

      await waitFor(() => {
        expect(container.textContent).toBe("short.txt");
      });
    });

    it("should handle CJK characters", async () => {
      // Each char still measured as 6px in mock
      // 25 chars = 150px > 120px (1 line)
      // end=3 = 18px, ellipsis = 6px, start budget = 120 - 18 - 6 = 96px = 16 chars
      const text = "가나다라마바사아자차카타파하가나다라마바사아자차카";
      const { container } = render(<MiddleTruncate end={3}>{text}</MiddleTruncate>);

      await waitFor(() => {
        const expected = text.slice(0, 16) + "\u2026" + text.slice(-3);
        expect(container.textContent).toBe(expected);
      });
    });
  });
});
