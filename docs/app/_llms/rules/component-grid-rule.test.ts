import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert, readFixture } from "../test-utils";
import {
  buildMarkdown,
  componentGridRule,
  isDeprecatedValue,
  type ComponentEntry,
} from "./component-grid-rule";

const sampleEntries: ComponentEntry[] = [
  {
    category: "Controls",
    title: "Checkbox",
    description: "옵션 선택 컴포넌트입니다.",
    url: "https://example.com/llms/docs/components/checkbox.txt",
  },
  {
    category: "Buttons",
    title: "Floating Action Button",
    description: "",
    url: "https://example.com/llms/docs/components/floating-action-button.txt",
  },
  {
    category: "Buttons",
    title: "Action Button",
    description: "기본 인터랙션 컴포넌트입니다.",
    url: "https://example.com/llms/docs/components/action-button.txt",
  },
];

describe("componentGridRule", () => {
  it("renders categorized markdown from entries", () => {
    const expected = readFixture("component-grid", "basic.output.md");

    const actual = buildMarkdown(sampleEntries);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("non-target node passthrough", () => {
    const input = readFixture("component-grid", "passthrough.input.mdx");
    const expected = readFixture("component-grid", "passthrough.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [componentGridRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  describe("isDeprecatedValue", () => {
    it("treats message strings as deprecated", () => {
      expect(isDeprecatedValue("더 이상 사용되지 않습니다.")).toBe(true);
      expect(isDeprecatedValue("true")).toBe(true);
      expect(isDeprecatedValue("yes")).toBe(true);
    });

    it("treats explicit false/empty as not deprecated", () => {
      expect(isDeprecatedValue(undefined)).toBe(false);
      expect(isDeprecatedValue("")).toBe(false);
      expect(isDeprecatedValue("  ")).toBe(false);
      expect(isDeprecatedValue("false")).toBe(false);
      expect(isDeprecatedValue("False")).toBe(false);
      expect(isDeprecatedValue("no")).toBe(false);
    });
  });
});
