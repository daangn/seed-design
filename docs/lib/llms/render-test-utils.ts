import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import type { Root } from "mdast";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { llmsHandlerOptions, removeForLLMs, tidyLLMMarkdown } from "./options";

/**
 * The unified stand-in for the `_stringify` hint `remarkApplyLlmsFilter` writes in
 * `app/source.tsx`. Both call `removeForLLMs`; only the host API differs.
 */
function remarkLLMRemovals() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (!removeForLLMs(node)) return;
      node.data = { ...node.data, _stringify: { text: "" } };
    });
  };
}

/**
 * Runs MDX through the same plugin order the site uses — removals first, then the llms
 * stringifier — and returns what a page's `processed` export would hold.
 *
 * Handler tests should go through this rather than calling `render` directly: most of
 * what can go wrong lives in the seam (a `render` returning `""` silently falls back to
 * the raw JSX, a `remove` that never fires leaves the tag in place), and calling the
 * handler in isolation reports success for both.
 */
export async function renderLLMMarkdown(mdx: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkLLMRemovals)
    .use(remarkLLMs, { ...llmsHandlerOptions, _data: true });

  const tree = processor.parse(mdx) as Root;
  const file = { data: {} } as never;
  await processor.run(tree, file);

  return tidyLLMMarkdown(String((file as { data: { markdown?: string } }).data.markdown ?? ""));
}
