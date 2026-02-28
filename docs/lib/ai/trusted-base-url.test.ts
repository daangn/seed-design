import { describe, expect, it } from "bun:test";
import { resolveTrustedBaseUrl } from "./trusted-base-url";

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
