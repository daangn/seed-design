import { describe, expect, it } from "bun:test";
import { compileMdx } from "@fumadocs/satteri/compile";
import { remarkStructure } from "@fumadocs/satteri/remark-structure";
import { remarkSearchRows, structureOptions } from "./search-structure";

/**
 * 컨테이너를 row로 잡으면 안의 문단이 같은 문장을 한 번 더 색인하거나, 반대로 아예 색인되지
 * 않는다. 부분 일치로는 그 중복·누락이 잡히지 않아 `contents` 전체를 비교한다.
 */
async function structuredContents(source: string) {
  const result = await compileMdx({
    source,
    filePath: "/tmp/doc.mdx",
    options: { mdastPlugins: [remarkSearchRows(), remarkStructure(structureOptions)] },
  });

  return result.data.structuredData?.contents;
}

describe("structureOptions", () => {
  it("blockquote를 row로 잡지 않아 안의 문단만 색인한다", async () => {
    expect(await structuredContents("> 인용된 문장")).toEqual([
      { heading: undefined, content: "인용된 문장" },
    ]);
  });

  it("표 셀은 구분자와 정렬 공백 없이 셀 내용만 색인한다", async () => {
    expect(
      await structuredContents("| 이름   | 설명 |\n| ------ | ---- |\n| `size` | 크기 |"),
    ).toEqual([
      { heading: undefined, content: "이름" },
      { heading: undefined, content: "설명" },
      { heading: undefined, content: "`size`" },
      { heading: undefined, content: "크기" },
    ]);
  });

  it("이미지만 담은 문단은 alt를 태그 형태로 색인한다", async () => {
    expect(await structuredContents('![색상 "토큰" 예시](/token.png)')).toEqual([
      { heading: undefined, content: '<img alt="색상 &#x22;토큰&#x22; 예시" />' },
    ]);
  });

  it("Do/Don't 이미지는 src를 뺀 태그로 색인한다", async () => {
    expect(
      await structuredContents(`<DontImage src="/a.png" alt='겹친 "버튼"' body="본문" />`),
    ).toEqual([
      { heading: undefined, content: '<DontImage alt="겹친 &#x22;버튼&#x22;" body="본문" />' },
    ]);
  });

  it("title 없는 Callout은 row를 만들지 않고 본문만 색인한다", async () => {
    const contents = await structuredContents('<Callout type="info">\n\n본문 문단\n\n</Callout>');

    expect(contents).toEqual([{ heading: undefined, content: "본문 문단" }]);
  });

  it("자식이 없는 Callout도 title이 없으면 row를 만들지 않는다", async () => {
    expect(await structuredContents('<Callout type="info" />')).toEqual([]);
    expect(await structuredContents('<Callout type="info"></Callout>')).toEqual([]);
  });

  it("title 있는 Callout은 자식 없는 태그 row와 본문 row로 나뉜다", async () => {
    const contents = await structuredContents(
      '<Callout type="info" title="확인 방법">\n\n본문 문단\n\n</Callout>',
    );

    expect(contents).toEqual([
      { heading: undefined, content: '<Callout type="info" title="확인 방법" />' },
      { heading: undefined, content: "본문 문단" },
    ]);
  });

  it("Callout 안의 리스트 항목이 각자 row가 되고 Callout row에 다시 실리지 않는다", async () => {
    const contents = await structuredContents(
      '<Callout type="warn" title="확인 방법">\n\n* 첫째 항목\n* 둘째 항목\n\n</Callout>',
    );

    expect(contents).toEqual([
      { heading: undefined, content: '<Callout type="warn" title="확인 방법" />' },
      { heading: undefined, content: "첫째 항목" },
      { heading: undefined, content: "둘째 항목" },
    ]);
  });

  it("title 안의 따옴표를 속성값으로 이스케이프한다", async () => {
    const contents = await structuredContents(
      "<Callout title='\"underline\"을 쓰기 전에'>\n\n본문 문단\n\n</Callout>",
    );

    expect(contents).toEqual([
      { heading: undefined, content: '<Callout title="&#x22;underline&#x22;을 쓰기 전에" />' },
      { heading: undefined, content: "본문 문단" },
    ]);
  });

  it("표현식으로 쓴 title도 row로 남긴다", async () => {
    const contents = await structuredContents(
      '<Callout type="warn" title={"확인 방법"}>\n\n본문 문단\n\n</Callout>',
    );

    expect(contents).toEqual([
      { heading: undefined, content: '<Callout type="warn" title="&#x22;확인 방법&#x22;" />' },
      { heading: undefined, content: "본문 문단" },
    ]);
  });

  it("Callout row가 안의 코드블록을 삼키지 않는다", async () => {
    const contents = await structuredContents(
      '<Callout type="info" title="확인 방법">\n\n```\ngit grep -E \'(A|B)\'\n```\n\n</Callout>',
    );

    expect(contents).toEqual([
      { heading: undefined, content: '<Callout type="info" title="확인 방법" />' },
    ]);
  });
});
