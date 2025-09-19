import type { Root } from "mdast";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";
import { getUnionLiterals } from "./get-union-literals";

export interface RemarkUnionLiteralTableOptions {
  /**
   * @defaultValue 'union-literal-table'
   */
  name?: string;
}

/**
 * Compile `union-literal-table` into a simple table at build time
 */
export function remarkUnionLiteralTable({
  name = "union-literal-table",
}: RemarkUnionLiteralTableOptions = {}): Transformer<Root, Root> {
  return async (tree) => {
    const queue: Promise<void>[] = [];

    visit(tree, "mdxJsxFlowElement", (node) => {
      if (node.name !== name) return;

      const props: Record<string, string> = {};

      for (const attr of node.attributes) {
        if (attr.type !== "mdxJsxAttribute" || typeof attr.value !== "string")
          throw new Error("`union-literal-table` does not support non-string attributes");

        props[attr.name] = attr.value;
      }

      async function run() {
        const result = await getUnionLiterals({
          path: props.path,
          name: props.name,
        });

        // Create a proper markdown table AST structure
        const tableNode = {
          type: "table",
          align: ["left"],
          children: [
            {
              type: "tableRow",
              children: [
                {
                  type: "tableCell",
                  children: [
                    {
                      type: "text",
                      value: "Possible Values",
                    },
                  ],
                },
              ],
            },
            ...result.literals.map((literal) => ({
              type: "tableRow",
              children: [
                {
                  type: "tableCell",
                  children: [
                    {
                      type: "inlineCode",
                      value: literal,
                    },
                  ],
                },
              ],
            })),
          ],
        };

        Object.assign(node, tableNode);
      }

      queue.push(run());
      return "skip";
    });

    await Promise.all(queue);
  };
}
