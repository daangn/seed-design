// This code includes portions derived from fuma-nama/fumadocs (https://github.com/fuma-nama/fumadocs)
// Used under the MIT License: https://opensource.org/licenses/MIT

import "server-only";

import { type Generator, renderMarkdownToHast } from "fumadocs-typescript";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { type Jsx, toJsxRuntime } from "hast-util-to-jsx-runtime";
import * as runtime from "react/jsx-runtime";
import { getReactTypeTableOutput, ReactTypeTableProps } from "./get-react-type-table";

export function createReactTypeTable(generator: Generator): {
  ReactTypeTable: (props: Omit<ReactTypeTableProps, "options">) => React.ReactNode;
} {
  return {
    ReactTypeTable(props) {
      return <ReactTypeTable {...props} generator={generator} />;
    },
  };
}

/**
 * **Server Component Only**
 *
 * Display properties in an exported interface via Type Table
 */
export async function ReactTypeTable(props: ReactTypeTableProps): Promise<React.ReactElement> {
  const output = await getReactTypeTableOutput(props);

  return (
    <>
      {output.map(async (item) => {
        const entries = item.entries.map(
          async (entry) =>
            [
              entry.name,
              {
                type: entry.type,
                description: await renderMarkdown(entry.description),
                default: entry.tags.find(
                  (tag) => tag.name === "default" || tag.name === "defaultValue",
                )?.text,
                required: entry.required,
              },
            ] as const,
        );

        return <TypeTable key={item.name} type={Object.fromEntries(await Promise.all(entries))} />;
      })}
    </>
  );
}

async function renderMarkdown(md: string): Promise<React.ReactElement> {
  return toJsxRuntime(await renderMarkdownToHast(md), {
    Fragment: runtime.Fragment,
    jsx: runtime.jsx as Jsx,
    jsxs: runtime.jsxs as Jsx,
    components: { ...defaultMdxComponents, img: undefined },
  }) as React.ReactElement;
}
