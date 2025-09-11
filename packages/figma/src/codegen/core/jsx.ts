import { ensureArray, exists } from "@/utils/common";

export interface ElementNode {
  __IS_JSX_ELEMENT_NODE: true;
  tag: string;
  props: Record<string, string | number | boolean | ElementNode | object | undefined>;
  children: (ElementNode | string)[];

  meta: {
    comment?: string;
    source?: string;
    importPath?: string;
  };
}

export function createElement(
  tag: string,
  props: Record<string, string | number | boolean | object | undefined> = {},
  children?: ElementNode | string | undefined | (ElementNode | string | undefined)[],
  meta?: ElementNode["meta"],
): ElementNode {
  return {
    __IS_JSX_ELEMENT_NODE: true,
    tag,
    props,
    children: ensureArray(children).filter(exists),
    meta: meta ?? {},
  };
}

export function cloneElement(
  element: ElementNode,
  props: Record<string, string | number | boolean | object | undefined> = {},
  children?: ElementNode | string | undefined | (ElementNode | string | undefined)[],
) {
  return {
    ...element,
    props: { ...element.props, ...props },
    children: children ? ensureArray(children).filter(exists) : element.children,
  };
}

export function appendSource(element: ElementNode, source: string) {
  return {
    ...element,
    source,
  };
}

export function isElement(node: unknown): node is ElementNode {
  return (
    typeof node === "object" &&
    node != null &&
    "__IS_JSX_ELEMENT_NODE" in node &&
    node.__IS_JSX_ELEMENT_NODE === true
  );
}

export function stringifyElement(element: ElementNode, options: { printSource?: boolean } = {}) {
  const importMap = new Map<string, Set<string>>();

  function recursive(node: ElementNode | string, depth: number): string {
    if (typeof node === "string") {
      return node;
    }

    const {
      tag,
      props,
      children,
      meta: { comment, source, importPath },
    } = node;

    if (importPath) {
      const existing = importMap.get(importPath);

      const [namespace] = tag.split(".");

      if (existing) {
        existing.add(namespace);
      } else {
        importMap.set(importPath, new Set([namespace]));
      }
    }

    const propEntries = Object.entries(
      options.printSource ? { ...props, "data-figma-node-id": source } : props,
    );
    const propFragments = propEntries
      .map(([key, value]) => {
        if (typeof value === "string") {
          if (value.includes("\n")) {
            return `${key}={"${value.replaceAll("\n", "\\n")}"}`;
          }

          return `${key}="${value}"`;
        }

        if (typeof value === "number") {
          return `${key}={${value}}`;
        }

        if (typeof value === "boolean") {
          if (value === true) return key;

          return `${key}={${value}}`;
        }

        if (isElement(value)) {
          const elementStr = recursive(value, depth + 1);

          const commentMatch = elementStr.match(/\{\/\* (.+?)\*\/\}$/);

          if (commentMatch) {
            const elementWithoutComment = elementStr.replace(/\{\/\* .+? \*\/\}$/, "");

            return `${key}={${elementWithoutComment}}/* ${commentMatch[1]} */`;
          }

          return `${key}={${elementStr}}`;
        }

        if (typeof value === "object") {
          return `${key}={${JSON.stringify(value)}}`;
        }

        if (typeof value === "undefined") {
          return undefined;
        }

        return undefined;
      })
      .filter(exists);

    const oneLiner = propFragments.join(" ");
    const propsString =
      propEntries.length === 0
        ? ""
        : ` ${
            oneLiner.length < 80
              ? oneLiner
              : `\n${"  ".repeat(depth + 1)}${propFragments.join(
                  `\n${"  ".repeat(depth + 1)}`,
                )}\n${"  ".repeat(depth)}`
          }`;

    if (children == null || children.length === 0) {
      return `<${tag}${propsString} />${comment ? `{/* ${comment} */}` : ""}`;
    }

    const result = [
      `<${tag}${propsString}>`,
      ...ensureArray(children)
        .filter(exists)
        .map((child) => recursive(child, depth + 1))
        .map((str) => "  ".repeat(depth + 1) + str),
      `${"  ".repeat(depth)}</${tag}>${comment ? `{/* ${comment} */}` : ""}`,
    ].join("\n");

    return result;
  }

  const jsx = recursive(element, 0);

  const imports = Array.from(importMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([importPath, tags]) => `import { ${Array.from(tags).join(", ")} } from "${importPath}";`)
    .join("\n");

  return {
    imports,
    jsx,
  };
}
