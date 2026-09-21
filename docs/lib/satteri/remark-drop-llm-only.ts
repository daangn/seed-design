import {
  defineMdastPlugin,
  type MdastVisitorContext,
  type MdxJsxFlowElement,
  type MdxJsxTextElement,
} from "satteri";

/**
 * `<LLMOnly>`를 트리에서 뺍니다. 문서의 마크다운 버전에만 싣는 글이라, 페이지와 검색 색인에는
 * 남지 않아야 합니다.
 *
 * `remarkLlms` 뒤에 두어야 합니다. 플러그인은 차례로 한 번씩 트리를 돌고 `remarkLlms`는 자기
 * 차례에 마크다운을 다 만들어 두므로, 그 뒤에 지우면 마크다운에는 남고 뒤이은 `remarkStructure`와
 * HTML 변환에서만 빠집니다. 구조 필터에서 `false`를 돌려주는 것으로는 부족합니다.
 * `remarkStructure`가 안의 문단을 부모와 상관없이 따로 색인합니다.
 */
export function remarkDropLlmOnly() {
  function drop(
    node: Readonly<MdxJsxFlowElement | MdxJsxTextElement>,
    context: MdastVisitorContext,
  ): void {
    if (node.name === "LLMOnly") context.removeNode(node);
  }

  return defineMdastPlugin({
    name: "remark-drop-llm-only",
    mdxJsxFlowElement: drop,
    mdxJsxTextElement: drop,
  });
}
