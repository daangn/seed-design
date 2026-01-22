// This code includes portions derived from fuma-nama/fumadocs (https://github.com/fuma-nama/fumadocs)
// Used under the MIT License: https://opensource.org/licenses/MIT

import { GenerateOptions, Generator } from "fumadocs-typescript";
import fs from "node:fs/promises";

export interface ReactTypeTableProps {
  /**
   * The fumadocs-typescript generator instance.
   */
  generator: Generator;

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

  options?: GenerateOptions & {
    parseDescriptionAsMarkdown?: boolean;
  };
}

export async function getReactTypeTableOutput({
  generator,
  path,
  type,
  name,
  options = {},
}: ReactTypeTableProps) {
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

  const output = await generator.generateDocumentation(
    { path: path ?? "temp.ts", content },
    typeName,
    {
      ...options,
      // get source file from ts symbol, and check if it's from node_modules
      transform: (entry, _type, symbol) => {
        const sourceFilePath = symbol.getDeclarations()?.[0].getSourceFile().getFilePath();
        const isNodeModules = sourceFilePath?.includes("node_modules");
        if (isNodeModules) {
          entry.tags.push({ name: "external", text: sourceFilePath });
        }
      },
    },
  );

  if (name && output.length === 0)
    throw new Error(`${name} in ${path ?? "empty file"} doesn't exist`);

  return output.map((item) => {
    return {
      ...item,
      entries: item.entries.filter((entry) => entry.tags.every((tag) => tag.name !== "external")),
    };
  });
}
