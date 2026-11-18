import {
  defineMdastPlugin,
  type MdastVisitorContext,
  type MdxJsxFlowElement,
  type MdxJsxTextElement,
} from "satteri";
import { replaceWithChildren } from "./replace-source";

/** `true`면 JSX 태그를 그대로 남기고, `false`면 태그를 접어 자식만 남깁니다. */
export type FilterElement = (node: { name?: string | null }) => boolean;

/**
 * `remarkLlms`는 작성한 원문을 그대로 잘라 내보내므로, 남기지 않을 MDX 컴포넌트를 자식 Markdown으로
 * 미리 바꿔 둡니다. 이 플러그인은 `remarkLlms`보다 앞에 둡니다.
 */
export function remarkApplyLlmsFilter(filterElement: FilterElement) {
  function apply(
    node: Readonly<MdxJsxFlowElement | MdxJsxTextElement>,
    context: MdastVisitorContext,
  ): void {
    if (filterElement(node)) return;

    replaceWithChildren(context, node);
  }

  return defineMdastPlugin({
    name: "remark-apply-llms-filter",
    options: { position: true },
    mdxJsxFlowElement: apply,
    mdxJsxTextElement: apply,
  });
}
