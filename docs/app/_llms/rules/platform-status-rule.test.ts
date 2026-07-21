import { describe, expect, it } from "bun:test";
import { getPlatformStatusMarkdown } from "./platform-status-rule";

describe("getPlatformStatusMarkdown", () => {
  // 헤더 주입(get-llm-text.ts)이 의존하는 계약: 없는 컴포넌트만 넘기면 빈 문자열(throw 아님).
  it("returns an empty string for unknown components", async () => {
    expect(await getPlatformStatusMarkdown(["nonexistent-component"])).toBe("");
  });
});
