import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { badgeRule } from "./badge-rule";

describe("badgeRule", () => {
  it("converts a block-level Badge with children to bracketed text", () => {
    const input = `## 제목

<Badge variant="weak" tone="warning">직접 판단 필요</Badge>

본문입니다.`;

    const actual = normalizeLLMBodyWithRules(input, [badgeRule]);

    expect(actual).toContain("[직접 판단 필요]");
    expect(actual).not.toContain("<Badge");
  });

  it("converts an inline Badge inside prose", () => {
    const input = `- <Badge variant="weak" tone="neutral">타입 에러로 발견 가능</Badge>: 패키지를 올리면 잡힙니다.`;

    const actual = normalizeLLMBodyWithRules(input, [badgeRule]);

    expect(actual).toContain("[타입 에러로 발견 가능]");
    expect(actual).not.toContain("<Badge");
  });

  it("passes through non-Badge JSX", () => {
    const input = `<Callout>유지됩니다</Callout>`;

    const actual = normalizeLLMBodyWithRules(input, [badgeRule]);

    expect(actual).toContain("유지됩니다");
  });
});
