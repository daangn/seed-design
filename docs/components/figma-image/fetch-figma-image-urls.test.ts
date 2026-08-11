import { describe, expect, it } from "bun:test";
import { getRetryDelayMs } from "./fetch-figma-image-urls";

// Mirrors what figma-api throws: an `ApiError` carrying the axios error on `.error`.
function rateLimitError(headers: Record<string, string> = {}) {
  return Object.assign(new Error("Request failed with status code 429"), {
    error: { response: { headers } },
  });
}

describe("getRetryDelayMs", () => {
  it("returns null for an error that is not worth retrying", () => {
    expect(getRetryDelayMs(new Error("FigmaImage requires an 'alt' prop"))).toBeNull();
  });

  it("waits as long as Retry-After asks, plus jitter", () => {
    const delay = getRetryDelayMs(rateLimitError({ "retry-after": "3" }));

    expect(delay).toBeGreaterThanOrEqual(3000);
    expect(delay).toBeLessThan(4000);
  });

  it("falls back to a short delay when the response carries no Retry-After", () => {
    const delay = getRetryDelayMs(rateLimitError());

    expect(delay).toBeGreaterThanOrEqual(1000);
    expect(delay).toBeLessThan(2000);
  });

  it("gives up instead of honoring a Retry-After longer than the build", () => {
    expect(getRetryDelayMs(rateLimitError({ "retry-after": "396749" }))).toBeNull();
  });

  it("retries transient network errors that carry no headers at all", () => {
    const delay = getRetryDelayMs(new Error("socket hang up"));

    expect(delay).toBeGreaterThanOrEqual(1000);
    expect(delay).toBeLessThan(2000);
  });

  it("spreads concurrent retries out instead of waking them on the same tick", () => {
    const delays = new Set(
      Array.from({ length: 50 }, () => getRetryDelayMs(rateLimitError({ "retry-after": "1" }))),
    );

    expect(delays.size).toBeGreaterThan(1);
  });
});
