import { afterEach, describe, expect, it } from "bun:test";
import {
  getDocsBaseOrigin,
  getDocsBaseUrl,
  normalizeDocsBaseUrl,
  setDocsBaseUrl,
} from "./runtime-config.js";

afterEach(() => {
  setDocsBaseUrl();
});

describe("runtime-config", () => {
  it("normalizes trailing slash and keeps path", () => {
    const normalized = normalizeDocsBaseUrl("https://seed-design.io/docs/");
    expect(normalized).toBe("https://seed-design.io/docs");
  });

  it("rejects invalid protocol", () => {
    expect(() => normalizeDocsBaseUrl("ftp://seed-design.io")).toThrow(
      "baseUrl must use http or https",
    );
  });

  it("applies runtime baseUrl override", () => {
    setDocsBaseUrl("http://127.0.0.1:3000");
    expect(getDocsBaseUrl()).toBe("http://127.0.0.1:3000");
    expect(getDocsBaseOrigin()).toBe("http://127.0.0.1:3000");
  });
});
