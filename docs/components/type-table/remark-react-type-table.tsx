// This code includes portions derived from fuma-nama/fumadocs (https://github.com/fuma-nama/fumadocs)
// Used under the MIT License: https://opensource.org/licenses/MIT

import type { Expression, ExpressionStatement, ObjectExpression, Program, Property } from "estree";
import { valueToEstree } from "estree-util-value-to-estree";
import type { DocEntry } from "fumadocs-typescript";
import { type Generator, renderMarkdownToHast } from "fumadocs-typescript";
import { toEstree } from "hast-util-to-estree";
import type { Root } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { dirname } from "node:path";
import { print } from "recast";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";
import { getReactTypeTableOutput, type ReactTypeTableProps } from "./get-react-type-table";

function expressionToAttribute(key: string, value: Expression): MdxJsxAttribute {
  return {
    type: "mdxJsxAttribute",
    name: key,
    value: {
      type: "mdxJsxAttributeValueExpression",
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ExpressionStatement",
              expression: value,
            },
          ],
        } as Program,
      },
      value: print(value).code,
    },
  };
}

async function mapProperty(
  entry: DocEntry,
  renderMarkdown: typeof renderMarkdownToHast,
): Promise<Property> {
  const value = valueToEstree({
    type: entry.type,
    default: entry.tags.default || entry.tags.defaultValue,
  }) as ObjectExpression;

  if (entry.description) {
    const hast = toEstree(await renderMarkdown(entry.description), {
      elementAttributeNameCase: "react",
    }).body[0] as ExpressionStatement;

    value.properties.push({
      type: "Property",
      method: false,
      shorthand: false,
      computed: false,
      key: {
        type: "Identifier",
        name: "description",
      },
      kind: "init",
      value: hast.expression,
    });
  }

  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name: entry.name,
    },
    kind: "init",
    value,
  };
}

export interface RemarkReactTypeTableOptions {
  /**
   * The fumadocs-typescript generator instance.
   */
  generator: Generator;

  /**
   * @defaultValue 'react-type-table'
   */
  name?: string;

  /**
   * @defaultValue 'TypeTable'
   */
  outputName?: string;

  renderMarkdown?: typeof renderMarkdownToHast;

  /**
   * Override some type table props
   */
  options?: ReactTypeTableProps["options"];
}

/**
 * Compile `react-type-table` into Fumadocs UI compatible TypeTable
 *
 * MDX is required to use this plugin.
 */
export function remarkReactTypeTable({
  generator,
  name = "react-type-table",
  outputName = "TypeTable",
  renderMarkdown = renderMarkdownToHast,
  options = {},
}: RemarkReactTypeTableOptions): Transformer<Root, Root> {
  return async (tree, file) => {
    const queue: Promise<void>[] = [];
    const basePath = dirname(file.path);

    visit(tree, "mdxJsxFlowElement", (node) => {
      if (node.name !== name) return;
      const props: Record<string, string> = {};

      for (const attr of node.attributes) {
        if (attr.type !== "mdxJsxAttribute" || typeof attr.value !== "string")
          throw new Error("`react-type-table` does not support non-string attributes");

        props[attr.name] = attr.value;
      }

      async function run() {
        const output = await getReactTypeTableOutput({
          generator,
          ...props,
          options: {
            ...options,
            basePath,
          },
        } as ReactTypeTableProps);

        const rendered = output.map(async (doc) => {
          const properties = await Promise.all(
            doc.entries.map((entry) => mapProperty(entry, renderMarkdown)),
          );

          return {
            type: "mdxJsxFlowElement",
            name: outputName,
            attributes: [
              expressionToAttribute("type", {
                type: "ObjectExpression",
                properties,
              }),
            ],
            data: {
              // for Fumadocs `remarkStructure`
              _string: [
                doc.name,
                doc.description,
                ...doc.entries.flatMap((entry) => [
                  `${entry.name}: ${entry.type}`,
                  entry.description,
                ]),
              ],
            },
            children: [],
          } satisfies MdxJsxFlowElement;
        });

        Object.assign(node, {
          type: "root",
          attributes: [],
          children: await Promise.all(rendered),
        } as Root);
      }

      queue.push(run());
      return "skip";
    });

    await Promise.all(queue);
  };
}
