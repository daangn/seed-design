import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert, readFixture } from "../test-utils";
import {
  buildMarkdown,
  type CatalogEntries,
  type ComponentEntry,
  createComponentGridRule,
} from "./component-grid-rule";

// 실제 문서 대신 쓰는 합성 항목. 문서를 추가하거나 지워도 이 기대값은 흔들리지 않는다.
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

const sampleCatalog: CatalogEntries = {
  "/components/": [sampleEntries[0]],
  "/patterns/": [sampleEntries[2]],
};

async function createReadyRule(entries: CatalogEntries = sampleCatalog) {
  const rule = createComponentGridRule(async () => entries);
  await rule.init?.();

  return rule;
}

describe("componentGridRule", () => {
  it("non-target node passthrough", async () => {
    const input = readFixture("component-grid", "passthrough.input.mdx");
    const expected = readFixture("component-grid", "passthrough.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [await createReadyRule()]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("keeps the original node when the prefix has no entry", async () => {
    const input = `<CatalogGrid pathPrefix="/nonexistent/" />`;

    const actual = normalizeLLMBodyWithRules(input, [await createReadyRule()]);

    expect(actual).toMatchInlineSnapshot(`"<CatalogGrid pathPrefix="/nonexistent/" />"`);
  });

  // init을 부르지 않으면 항목이 없는 것과 같아야 한다. 그러지 않으면 룰이 빈 목록을 llms.txt에
  // 실어 보내, 문서가 통째로 빠진 자리가 정상 출력처럼 보인다.
  it("keeps the original node before init has run", () => {
    const input = `<CatalogGrid pathPrefix="/patterns/" />`;

    const actual = normalizeLLMBodyWithRules(input, [
      createComponentGridRule(async () => sampleCatalog),
    ]);

    expect(actual).toMatchInlineSnapshot(`"<CatalogGrid pathPrefix="/patterns/" />"`);
  });

  it("reads the section the prefix names instead of the default one", async () => {
    const input = `<CatalogGrid pathPrefix="/patterns/" />`;

    const actual = normalizeLLMBodyWithRules(input, [await createReadyRule()]);

    expect(actual).toBe(buildMarkdown([sampleEntries[2]]));
  });

  // pathPrefix에 docs 세그먼트가 붙어 와도 같은 섹션을 가리킨다.
  it("resolves a docs-prefixed path to the same section", async () => {
    const input = `<CatalogGrid pathPrefix="/docs/patterns/" />`;

    const actual = normalizeLLMBodyWithRules(input, [await createReadyRule()]);

    expect(actual).toBe(buildMarkdown([sampleEntries[2]]));
  });

  it("falls back to the components section when pathPrefix is absent", async () => {
    const actual = normalizeLLMBodyWithRules("<CatalogGrid />", [await createReadyRule()]);

    expect(actual).toBe(buildMarkdown([sampleEntries[0]]));
  });
});
