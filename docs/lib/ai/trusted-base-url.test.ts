import { describe, expect, it } from "bun:test";
import { resolveTrustedBaseUrl, resolveTrustedBaseUrlFromEnv } from "./trusted-base-url";

describe("resolveTrustedBaseUrl", () => {
  it("allows trusted production hosts with https", () => {
    expect(resolveTrustedBaseUrl("https://seed-design.io/api/chat")).toBe("https://seed-design.io");
    expect(resolveTrustedBaseUrl("https://www.seed-design.io/api/chat")).toBe(
      "https://www.seed-design.io",
    );
  });

  it("allows local hosts for development", () => {
    expect(resolveTrustedBaseUrl("http://localhost:3000/api/chat")).toBe("http://localhost:3000");
    expect(resolveTrustedBaseUrl("http://127.0.0.1:4000/api/chat")).toBe("http://127.0.0.1:4000");
  });

  it("falls back to default base URL for untrusted hosts", () => {
    expect(resolveTrustedBaseUrl("https://evil.example.com/api/chat")).toBe("https://seed-design.io");
    expect(resolveTrustedBaseUrl("http://seed-design.io/api/chat")).toBe("https://seed-design.io");
  });

  it("falls back to default base URL for invalid URL", () => {
    expect(resolveTrustedBaseUrl("not-a-url")).toBe("https://seed-design.io");
  });
});

describe("resolveTrustedBaseUrlFromEnv", () => {
  it("returns default base URL for empty env object", () => {
    expect(resolveTrustedBaseUrlFromEnv({})).toBe("https://seed-design.io");
  });

  it("uses explicit docs base URL when trusted", () => {
    expect(
      resolveTrustedBaseUrlFromEnv({
        SEED_DOCS_BASE_URL: "https://www.seed-design.io/docs",
      }),
    ).toBe("https://www.seed-design.io");
  });

  it("supports local base URL from env", () => {
    expect(
      resolveTrustedBaseUrlFromEnv({
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000");
  });

  it("falls back to default base URL for untrusted env values", () => {
    expect(
      resolveTrustedBaseUrlFromEnv({
        SEED_DOCS_BASE_URL: "https://evil.example.com",
        NEXT_PUBLIC_SITE_URL: "http://seed-design.io",
      }),
    ).toBe("https://seed-design.io");
  });

  it("uses vercel production URL when trusted", () => {
    expect(
      resolveTrustedBaseUrlFromEnv({
        VERCEL_PROJECT_PRODUCTION_URL: "seed-design.io",
      }),
    ).toBe("https://seed-design.io");
  });
});
