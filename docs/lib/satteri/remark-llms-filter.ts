import type { LLMsOptions } from "@fumadocs/satteri/remark-llms";
import {
  defineMdastPlugin,
  type MdastVisitorContext,
  type MdxJsxFlowElement,
  type MdxJsxTextElement,
} from "satteri";

type FilterElement = NonNullable<LLMsOptions["filterElement"]>;

/**
 * Fumadocs `remarkLlms`가 덮어쓰는 MDX 필터를 `_stringify` 힌트로 미리 적용합니다.
 */
export function remarkApplyLlmsFilter(filterElement: FilterElement) {
  function apply(
    node: Readonly<MdxJsxFlowElement | MdxJsxTextElement>,
    context: MdastVisitorContext,
  ): void {
    const visibility = filterElement(node);
    if (visibility === true) return;

    const data = { ...(node.data as Record<string, unknown> | undefined) };
    data._stringify = visibility === "children-only" ? "children-only" : { text: "" };
    context.setProperty(node, "data", data);
  }

  return defineMdastPlugin({
    name: "remark-apply-llms-filter",
    mdxJsxFlowElement: apply,
    mdxJsxTextElement: apply,
  });
}
