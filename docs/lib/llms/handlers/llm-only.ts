import type { LLMHandler } from "../types";

/**
 * `<LLMOnly>` holds text written for the markdown version alone, so its children go out
 * unwrapped. The page never shows them: `remarkDropLlmOnly` takes the node out of the tree
 * once `remarkLlms` has serialized it.
 */
export const llmOnlyHandler: LLMHandler = {
  names: ["LLMOnly"],
  // An empty one would otherwise leak as a bare tag: a `render` returning `""` keeps the JSX.
  remove: (node) => node.children.length === 0,
  render: (_node, { flow }) => flow(),
};
