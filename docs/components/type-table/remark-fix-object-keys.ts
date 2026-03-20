import type { Root } from "mdast";
import type { Transformer } from "unified";
import type { Node as EstreeNode } from "estree";
import { visit } from "unist-util-visit";

const VALID_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

/**
 * Workaround for fumadocs-typescript generating Identifier keys
 * for prop names that contain hyphens (e.g. "aria-hidden", "data-foobar").
 *
 * These are not valid JS identifiers and cause syntax errors when
 * the MDX compiler generates code. This plugin walks the estree AST
 * inside TypeTable nodes and converts invalid Identifier keys to Literals.
 *
 * TODO: Remove this once fumadocs-typescript fixes the upstream issue.
 */
export function remarkFixObjectKeys(): Transformer<Root, Root> {
  return (tree) => {
    visit(tree, "mdxJsxFlowElement", (node) => {
      if (node.name !== "TypeTable") return;

      for (const attr of node.attributes) {
        if (attr.type !== "mdxJsxAttribute") continue;
        const estree =
          attr.value && typeof attr.value !== "string" ? attr.value.data?.estree : null;
        if (!estree) continue;

        walkEstree(estree);
      }
    });
  };
}

function walkEstree(node: unknown): void {
  if (!node || typeof node !== "object") return;

  const n = node as Record<string, unknown>;
  if (n.type === "Property") {
    const key = n.key as EstreeNode & { name?: string };
    if (key.type === "Identifier" && key.name && !VALID_IDENTIFIER.test(key.name)) {
      n.key = { type: "Literal", value: key.name };
    }
  }

  for (const value of Object.values(n)) {
    if (Array.isArray(value)) {
      for (const item of value) walkEstree(item);
    } else if (value && typeof value === "object") {
      walkEstree(value);
    }
  }
}
