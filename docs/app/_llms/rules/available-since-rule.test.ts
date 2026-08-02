import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { availableSinceRule } from "./available-since-rule";

describe("availableSinceRule", () => {
  it("converts AvailableSince to a single caption line", () => {
    const input = `<AvailableSince packages="@seed-design/react@2.0.0, @seed-design/css@2.0.0" />

## Import`;

    const actual = normalizeLLMBodyWithRules(input, [availableSinceRule]);

    expect(actual).toMatchInlineSnapshot(`
      "사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0

      ## Import"
    `);
  });

  it("drops the node when packages is missing", () => {
    const input = `<AvailableSince />

본문입니다.`;

    const actual = normalizeLLMBodyWithRules(input, [availableSinceRule]);

    expect(actual).toMatchInlineSnapshot(`"본문입니다."`);
  });
});
