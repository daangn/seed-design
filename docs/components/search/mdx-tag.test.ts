import { describe, expect, it } from "bun:test";
import { decodeCharacterReferences, parseMdxTag } from "./mdx-tag";

describe("parseMdxTag", () => {
  it("parses a self-closing tag with attributes", () => {
    expect(parseMdxTag('<DoImage alt="나란히 배치한 예시" body="나란히 쓸 수 있어요." />')).toEqual(
      {
        name: "DoImage",
        attributes: [
          { name: "alt", value: "나란히 배치한 예시" },
          { name: "body", value: "나란히 쓸 수 있어요." },
        ],
        children: "",
      },
    );
  });

  it("parses a tag with children across multiple lines", () => {
    expect(
      parseMdxTag('<Card title="Foundations" href="/foundations">\n  토큰과 원칙.\n</Card>'),
    ).toEqual({
      name: "Card",
      attributes: [
        { name: "title", value: "Foundations" },
        { name: "href", value: "/foundations" },
      ],
      children: "토큰과 원칙.",
    });
  });

  it("parses a tag with no attributes", () => {
    expect(parseMdxTag("<Callout>\n  © 2025 Daangn Market.\n</Callout>")).toEqual({
      name: "Callout",
      attributes: [],
      children: "© 2025 Daangn Market.",
    });
  });

  it("decodes character references inside attribute values", () => {
    expect(parseMdxTag('<File name="&#x22;a&#x22;.log" />')?.attributes).toEqual([
      { name: "name", value: '"a".log' },
    ]);
  });

  it("keeps a value-less boolean attribute", () => {
    expect(parseMdxTag("<Callout inline>본문</Callout>")?.attributes).toEqual([
      { name: "inline", value: "" },
    ]);
  });

  it("returns null for plain prose", () => {
    expect(parseMdxTag("Elevation은 UI 요소 간의 깊이를 표현합니다.")).toBeNull();
  });

  it("parses the lowercase `img` tag the index carries for Markdown images", () => {
    expect(parseMdxTag('<img alt="당근 로고를 UI 형태로 옮긴 디자인 요소" />')).toEqual({
      name: "img",
      attributes: [{ name: "alt", value: "당근 로고를 UI 형태로 옮긴 디자인 요소" }],
      children: "",
    });
  });

  it("returns null for other lowercase HTML tags, including highlight wrappers", () => {
    expect(parseMdxTag("<mark>Button</mark>")).toBeNull();
    expect(parseMdxTag('<meta name="viewport" />')).toBeNull();
  });

  // JSX written inside a code block must not be labelled as a component result.
  it("returns null when the tag is only part of the content", () => {
    expect(
      parseMdxTag("```tsx\n<DialogRoot open>\n  <DialogContent />\n</DialogRoot>\n```"),
    ).toBeNull();
    expect(parseMdxTag('<File name="a.log" />\n\n뒤따르는 문단.')).toBeNull();
  });

  it("returns null for a malformed opening tag", () => {
    expect(parseMdxTag('<File name="unterminated />')).toBeNull();
  });
});

describe("decodeCharacterReferences", () => {
  it("decodes hexadecimal, decimal, and named references", () => {
    expect(decodeCharacterReferences("&#x2A;*강조**")).toBe("**강조**");
    expect(decodeCharacterReferences("&#42;")).toBe("*");
    expect(decodeCharacterReferences("&amp;&lt;&gt;&quot;")).toBe('&<>"');
  });

  it("leaves unknown and out-of-range references untouched", () => {
    expect(decodeCharacterReferences("&nbsp;")).toBe("&nbsp;");
    expect(decodeCharacterReferences("&#x110000;")).toBe("&#x110000;");
  });
});
