import { describe, expect, it } from "bun:test";
import { compileMdx } from "@fumadocs/satteri/compile";
import { remarkCodeTab } from "@fumadocs/satteri/remark-code-tab";
import { remarkLlms } from "@fumadocs/satteri/remark-llms";
import { remarkNpm } from "@fumadocs/satteri/remark-npm";
import { normalizeLLMBody } from "@/lib/llms/normalize-llm-body";
import { codeBlockTabsSource } from "./code-block-tabs-source";

async function toLLMBody(source: string) {
  const result = await compileMdx({
    source,
    filePath: "/tmp/doc.mdx",
    options: {
      mdastPlugins: [
        ...codeBlockTabsSource({
          codeTab: remarkCodeTab(),
          npm: remarkNpm({ persist: { id: "package-manager" } }),
          npmGroupId: "package-manager",
        }),
        remarkLlms({ as: "processed" }),
      ],
    },
  });

  return normalizeLLMBody(result.data.markdown);
}

describe("codeBlockTabsSource", () => {
  it("package-install 코드 블록을 패키지 매니저별 명령 목록으로 남긴다", async () => {
    expect(await toLLMBody("설치합니다.\n\n```package-install\n@seed-design/react\n```")).toBe(
      [
        "설치합니다.",
        "",
        "- npm: npm install @seed-design/react",
        "- pnpm: pnpm add @seed-design/react",
        "- yarn: yarn add @seed-design/react",
        "- bun: bun add @seed-design/react",
      ].join("\n"),
    );
  });

  it("탭으로 묶인 코드 블록을 탭 이름별 목록으로 남긴다", async () => {
    const source = [
      '```shell tab="git grep"',
      "git grep -E 'a|b'",
      "```",
      "",
      '```regex tab="정규 표현식"',
      "a|b",
      "```",
      "",
      "뒤 문단",
    ].join("\n");

    expect(await toLLMBody(source)).toBe(
      ["- git grep: git grep -E 'a|b'", "- 정규 표현식: a|b", "", "뒤 문단"].join("\n"),
    );
  });

  it("JSX 안에 들여 쓴 탭 코드 블록도 목록으로 남긴다", async () => {
    const source = [
      '<Callout title="확인 방법">',
      '  ```shell tab="git grep"',
      "  git grep a",
      "  ```",
      "",
      '  ```regex tab="정규 표현식"',
      "  a",
      "  ```",
      "</Callout>",
    ].join("\n");

    expect(await toLLMBody(source)).toBe(
      [
        '<Callout title="확인 방법">',
        "  - git grep: git grep a",
        "  - 정규 표현식: a",
        "</Callout>",
      ].join("\n"),
    );
  });
});
