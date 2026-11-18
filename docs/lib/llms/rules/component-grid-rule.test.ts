import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert, readFixture } from "../test-utils";
import { buildMarkdown, componentGridRule, type ComponentEntry } from "./component-grid-rule";

// 생성된 매니페스트 대신 쓰는 합성 항목. 문서를 추가하거나 지워도 이 기대값은 흔들리지 않는다.
const sampleEntries: ComponentEntry[] = [
  {
    title: "Checkbox",
    description: "옵션 선택 컴포넌트입니다.",
    url: "https://example.com/llms/components/checkbox.txt",
  },
  {
    title: "Floating Action Button",
    description: "",
    url: "https://example.com/llms/components/floating-action-button.txt",
  },
  {
    title: "Action Button",
    description: "기본 인터랙션 컴포넌트입니다.",
    url: "https://example.com/llms/components/action-button.txt",
  },
];

describe("buildMarkdown", () => {
  it("renders alphabetically sorted markdown from entries", () => {
    const expected = readFixture("component-grid", "basic.output.md");

    const actual = buildMarkdown(sampleEntries);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("renders nothing when there is no entry, which makes transform keep the original node", () => {
    expect(buildMarkdown([])).toBe("");
  });
});

describe("componentGridRule", () => {
  it("non-target node passthrough", () => {
    const input = readFixture("component-grid", "passthrough.input.mdx");
    const expected = readFixture("component-grid", "passthrough.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [componentGridRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("keeps the original node when the prefix has no manifest entry", () => {
    const input = `<CatalogGrid pathPrefix="/nonexistent/" />`;

    const actual = normalizeLLMBodyWithRules(input, [componentGridRule]);

    expect(actual).toMatchInlineSnapshot(`"<CatalogGrid pathPrefix="/nonexistent/" />"`);
  });

  // 생성된 매니페스트를 지나는 유일한 단언이라, 항목 텍스트가 아니라 링크가 가리키는 디렉터리만 본다.
  // 항목 렌더링 자체는 위의 buildMarkdown 테스트가 합성 입력으로 덮는다.
  it("links manifest entries under the given prefix instead of the default one", () => {
    const input = `<CatalogGrid pathPrefix="/patterns/" />`;

    const actual = normalizeLLMBodyWithRules(input, [componentGridRule]);

    const linkDirs = [...actual.matchAll(/^- \[[^\]]+\]\((\S+)\)/gm)].map((match) =>
      new URL(match[1]).pathname.replace(/[^/]+$/, ""),
    );

    expect([...new Set(linkDirs)]).toEqual(["/llms/docs/patterns/"]);
  });
});
