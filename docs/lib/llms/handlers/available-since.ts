import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import type { JsxNode, LLMHandler } from "../types";

/**
 * Read here rather than through `ctx.attr`, because `remove` runs without a context and
 * both branches have to agree on what counts as a missing `packages`.
 */
function packagesOf(node: JsxNode): string {
  const attribute = node.attributes.find(
    (candidate): candidate is MdxJsxAttribute =>
      candidate.type === "mdxJsxAttribute" && candidate.name === "packages",
  );

  return typeof attribute?.value === "string" ? attribute.value.trim() : "";
}

/**
 * `<AvailableSince packages="@seed-design/react@2.0.0" />` becomes the single line
 * `사용 가능 버전: @seed-design/react@2.0.0`.
 */
export const availableSinceHandler: LLMHandler = {
  names: ["AvailableSince"],
  // Without packages the component renders nothing on screen either.
  remove: (node) => !packagesOf(node),
  render: (node) => {
    const packages = packagesOf(node);
    return packages ? `사용 가능 버전: ${packages}` : undefined;
  },
};
