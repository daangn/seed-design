import type { RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Rule } from "./types";

export const tokenReferenceRule: Rule = {
  name: "TokenReference",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "TokenReference",
  transform: () => {
    // TokenReference 컴포넌트를 설명 텍스트로 대체
    const nodes: RootContent[] = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "💡 아래 Rootage Token Specifications 섹션에서 이 페이지에 해당하는 디자인 토큰 데이터를 확인할 수 있습니다.",
          },
        ],
      },
    ];

    return nodes;
  },
};
