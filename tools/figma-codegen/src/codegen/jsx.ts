import { ensureArray, exists } from "./util";

export interface ElementNode {
  __IS_JSX_ELEMENT_NODE: true;
  tag: string;
  props: Record<
    string,
    string | number | boolean | ElementNode | object | undefined
  >;
  children: (ElementNode | string)[];
  comment?: string;
}

export function createElement(
  tag: string,
  props: Record<string, string | number | boolean | object | undefined> = {},
  children?:
    | ElementNode
    | string
    | undefined
    | (ElementNode | string | undefined)[],
  comment?: string,
): ElementNode {
  return {
    __IS_JSX_ELEMENT_NODE: true,
    tag,
    props,
    children: ensureArray(children).filter(exists),
    comment,
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

export function stringifyElement(element: ElementNode) {
  function recursive(node: ElementNode | string, depth: number): string {
    if (typeof node === "string") {
      return node;
    }

    const { tag, props, children, comment } = node;
    const propEntries = Object.entries(props);
    const propFragments = propEntries
      .map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}="${value}"`;
        }

        if (typeof value === "number") {
          return `${key}={${value}}`;
        }

        if (typeof value === "boolean") {
          return `${key}={${value}}`;
        }

        if (isElement(value)) {
          return `${key}={${recursive(value, depth + 1)}}`;
        }

        if (typeof value === "object") {
          return `${key}={${JSON.stringify(value)}}`;
        }

        if (typeof value === "undefined") {
          return undefined;
        }
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
      return `<${tag}${propsString} />${comment ? ` {/* ${comment} */}` : ""}`;
    }

    const result = [
      `<${tag}${propsString}>`,
      ...ensureArray(children)
        .filter(exists)
        .map((child) => recursive(child, depth + 1))
        .map((str) => "  ".repeat(depth + 1) + str),
      "  ".repeat(depth) + `</${tag}>`,
    ].join("\n");

    return result;
  }

  return recursive(element, 0);
}
