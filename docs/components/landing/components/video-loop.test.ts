import { describe, expect, it } from "bun:test";
import { didWrap } from "./video-loop";

describe("didWrap", () => {
  it("detects a loop wrap (near-end jumps back to ~0)", () => {
    expect(didWrap(5.9, 0.02)).toBe(true);
  });

  it("ignores normal forward playback", () => {
    expect(didWrap(2.0, 2.03)).toBe(false);
  });

  it("ignores tiny backward jitter below the threshold", () => {
    expect(didWrap(2.0, 1.9)).toBe(false);
  });
});
