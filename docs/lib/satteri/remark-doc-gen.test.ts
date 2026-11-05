import { describe, expect, it } from "bun:test";
import type { DocGenerator } from "fumadocs-docgen";
import { mdxToJs } from "satteri";
import { remarkDocGen } from "./remark-doc-gen";

const source = "```json doc-gen:test\n{}\n```";

async function compile(generator: DocGenerator) {
  return mdxToJs(source, {
    fileURL: new URL("file:///tmp/doc.mdx"),
    mdastPlugins: [remarkDocGen({ generators: [generator] })],
  });
}

describe("remarkDocGen", () => {
  it("여러 생성 노드로 코드 블록을 교체한다", async () => {
    const result = await compile({
      name: "test",
      run: () => [
        { type: "paragraph", children: [{ type: "text", value: "첫 번째" }] },
        { type: "paragraph", children: [{ type: "text", value: "두 번째" }] },
      ],
    });

    expect(result.code).toContain("첫 번째");
    expect(result.code).toContain("두 번째");
    expect(result.code).not.toContain("doc-gen:test");
  });

  it("빈 배열을 반환하면 코드 블록을 제거한다", async () => {
    const result = await compile({ name: "test", run: () => [] });

    expect(result.code).not.toContain("doc-gen:test");
  });

  it("지원하지 않는 onFile 훅을 조용히 무시하지 않는다", () => {
    expect(() =>
      remarkDocGen({
        generators: [{ name: "test", run: () => undefined, onFile: () => undefined }],
      }),
    ).toThrow("does not support the onFile hook");
  });
});
