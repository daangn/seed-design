import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import index from "@seed-design/rootage-artifacts/index.json";
import type { Rule } from "./types";

/*
  마크다운 테이블을 생성하는 대신 rootage exchange JSON URL을 안내합니다.
  테이블 생성은 번들된 빌드에서 조용히 실패했고(스펙 JSON fs 접근 불가),
  스펙 전문은 JSON이 소스 오브 트루스이므로 URL 참조가 더 정확합니다.
  variants prop은 llms.txt 출력에서는 무시합니다.
*/
export const componentSpecBlockRule: Rule = {
  name: "ComponentSpecBlock",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "ComponentSpecBlock",
  transform: (node, context) => {
    const id = context.getStringAttribute(node, "id");
    if (!id) {
      console.warn("[ComponentSpecBlock] id prop이 없어 원본 노드를 유지합니다.");
      return [node];
    }

    const resourcePath = `/components/${id}.json`;
    if (!index.resources.some((resource) => resource.path === resourcePath)) {
      console.warn(`[ComponentSpecBlock] id="${id}"의 스펙 리소스가 없어 원본 노드를 유지합니다.`);
      return [node];
    }

    return [{ type: "html", value: `Component spec (JSON): /rootage${resourcePath}` }];
  },
};
