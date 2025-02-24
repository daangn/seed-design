// This code includes portions derived from fuma-nama/fumadocs (https://github.com/fuma-nama/fumadocs)
// Used under the MIT License: https://opensource.org/licenses/MIT

import "server-only";

import {
  type GenerateDocumentationOptions,
  generateDocumentation,
  getProject,
  renderMarkdownToHast,
} from "fumadocs-typescript";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { type Jsx, toJsxRuntime } from "hast-util-to-jsx-runtime";
import fs from "node:fs/promises";
import * as runtime from "react/jsx-runtime";

export interface ReactTypeTableProps {
  /**
   * The path to source TypeScript file.
   */
  path?: string;

  /**
   * Exported type name to generate from.
   */
  name?: string;

  /**
   * Set the type to generate from.
   *
   * When used with `name`, it generates the type with `name` as export name.
   *
   * ```ts
   * export const myName = MyType;
   * ```
   *
   * When `type` contains multiple lines, `export const` is not added.
   * You need to export it manually, and specify the type name with `name`.
   *
   * ```tsx
   * <ReactTypeTable
   *   path="./file.ts"
   *   type={`import { ReactNode } from "react"
   *   export const MyName = ReactNode`}
   *   name="MyName"
   * />
   * ```
   */
  type?: string;

  options?: GenerateDocumentationOptions;
}

export function createReactTypeTable(options: GenerateDocumentationOptions = {}): {
  ReactTypeTable: (props: Omit<ReactTypeTableProps, "options">) => React.ReactNode;
} {
  const project = options.project ?? getProject(options.config);

  return {
    ReactTypeTable(props) {
      return <ReactTypeTable {...props} options={{ ...options, project }} />;
    },
  };
}

/**
 * **Server Component Only**
 *
 * Display properties in an exported interface via Type Table
 */
export async function ReactTypeTable({
  path,
  name,
  type,
  options = {},
}: ReactTypeTableProps): Promise<React.ReactElement> {
  let typeName = name;
  let content = "";

  if (path) {
    content = await fs.readFile(path).then((res) => res.toString());
  }

  if (type && type.split("\n").length > 1) {
    content += `\n${type}`;
  } else if (type) {
    typeName ??= "$Fumadocs";
    content += `\nexport type ${typeName} = ${type}`;
  }

  const output = generateDocumentation(path ?? "temp.ts", typeName, content, {
    ...options,
    // get source file from ts symbol, and check if it's from node_modules
    transform: (entry, _type, symbol) => {
      const sourceFilePath = symbol.getDeclarations()?.[0].getSourceFile().getFilePath();
      const isNodeModules = sourceFilePath?.includes("node_modules");
      if (isNodeModules) {
        entry.tags = { ...entry.tags, external: sourceFilePath };
      }
    },
  });

  if (name && output.length === 0)
    throw new Error(`${name} in ${path ?? "empty file"} doesn't exist`);

  return (
    <>
      {output.map(async (item) => {
        const entries = item.entries
          .filter((entry) => !entry.tags.external)
          .map(
            async (entry) =>
              [
                entry.name,
                {
                  type: entry.type,
                  description: await renderMarkdown(entry.description),
                  default: entry.tags.default || entry.tags.defaultValue,
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
    // @ts-ignore
    components: { ...defaultMdxComponents, img: undefined },
  }) as React.ReactElement;
}
