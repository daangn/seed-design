import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import type { JsxNode, LLMHandler } from "../types";

/**
 * Read here rather than through `ctx.attr`, because `remove` runs without a context and
 * both branches have to agree on which examples earn the heading.
 */
function isPreview(node: JsxNode): boolean {
  const attribute = node.attributes.find(
    (candidate): candidate is MdxJsxAttribute =>
      candidate.type === "mdxJsxAttribute" && candidate.name === "name",
  );

  return typeof attribute?.value === "string" && attribute.value.endsWith("/preview");
}

/**
 * `<ComponentExample name="react/action-button/preview">` renders a live demo above the
 * code it wraps. llms.txt keeps the code and drops the frame.
 *
 * The `/preview` example opens the page, which is why it is the one example with no
 * heading of its own in the source — so `## Preview` is written back in its place. When
 * it wraps no code block, that heading is all the node leaves behind.
 *
 * `LynxComponentExample` is the same frame for the Lynx examples, down to the `/preview`
 * naming, so it shares this handler rather than a copy that would drift.
 */
export const componentExampleHandler: LLMHandler = {
  names: ["ComponentExample", "LynxComponentExample"],
  // Nothing to unwrap and no heading to earn.
  remove: (node) => node.children.length === 0 && !isPreview(node),
  render: (node, { flow }) => {
    const body = flow().trim();
    const rendered = (isPreview(node) ? ["## Preview", body] : [body]).filter(Boolean).join("\n\n");

    return rendered || undefined;
  },
};
