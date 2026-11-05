import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import index from "@seed-design/rootage-artifacts/index.json";
import type { Rule } from "./types";

export interface SpecResource {
  path: string;
}

/*
  id에 해당하는 컴포넌트 스펙 리소스를 찾아 llms.txt에 실을 URL로 바꿉니다.
  목록에 없으면 null이고, 호출부는 원본 노드를 그대로 둡니다.
*/
export function findSpecUrl(resources: readonly SpecResource[], id: string): string | null {
  const resourcePath = `/components/${id}.json`;
  if (!resources.some((resource) => resource.path === resourcePath)) return null;

  return `/rootage${resourcePath}`;
}

/*
  마크다운 테이블을 생성하는 대신 rootage exchange JSON URL을 안내합니다.
  테이블 생성은 번들된 빌드에서 조용히 실패했고(스펙 JSON fs 접근 불가),
  스펙 전문은 JSON이 소스 오브 트루스이므로 URL 참조가 더 정확합니다.
  variants prop은 llms.txt 출력에서는 무시합니다.
*/
export const componentSpecBlockRule: Rule<MdxJsxFlowElement> = {
  name: "ComponentSpecBlock",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "ComponentSpecBlock",
  transform: (node, context) => {
    const id = context.getStringAttribute(node, "id");
    if (!id) {
      console.warn("[ComponentSpecBlock] id prop이 없어 원본 노드를 유지합니다.");
      return [node];
    }

    const url = findSpecUrl(index.resources, id);
    if (!url) {
      console.warn(`[ComponentSpecBlock] id="${id}"의 스펙 리소스가 없어 원본 노드를 유지합니다.`);
      return [node];
    }

    return [{ type: "html", value: `Component spec (JSON): ${url}` }];
  },
};
