import { serializeProps } from "@json-render/codegen";
import type { Spec } from "@json-render/core";
import { resolveImports } from "./import-resolver";
import { formatImports, wrapSnippetFile, indent } from "./template";
import { flatToNestedSpec } from "../spec-utils";

interface SpecElement {
  type: string;
  props?: Record<string, unknown>;
  children?: (SpecElement | string)[];
}

function collectComponentTypes(element: SpecElement, types: Set<string>) {
  types.add(element.type);
  if (element.children) {
    for (const child of element.children) {
      if (typeof child !== "string") {
        collectComponentTypes(child, types);
      }
    }
  }
}

function renderElement(element: SpecElement, _depth: number): string {
  const { type, props = {}, children = [] } = element;

  // Extract text props (label, content, text) that should become React children
  const { label, content, text, ...restProps } = props as Record<string, unknown>;
  const textContent = (label ?? content ?? text) as string | undefined;

  const propsStr = serializeProps(restProps);
  const propsOutput = propsStr ? ` ${propsStr}` : "";

  const hasElementChildren = children.length > 0;
  const hasTextContent = textContent != null;

  if (!hasElementChildren && !hasTextContent) {
    return `<${type}${propsOutput} />`;
  }

  if (!hasElementChildren && hasTextContent) {
    return `<${type}${propsOutput}>${textContent}</${type}>`;
  }

  const childLines = children
    .map((child) => {
      if (typeof child === "string") {
        return child;
      }
      return renderElement(child, _depth + 1);
    })
    .map((line) => indent(line, 1))
    .join("\n");

  if (hasTextContent) {
    return `<${type}${propsOutput}>\n${indent(String(textContent), 1)}\n${childLines}\n</${type}>`;
  }

  return `<${type}${propsOutput}>\n${childLines}\n</${type}>`;
}

function extractElementTree(spec: Spec): SpecElement | null {
  const s = spec as Record<string, unknown>;

  // Flat spec format: { root: "id", elements: { id: {...} } }
  if (typeof s.root === "string" && s.elements) {
    const nested = flatToNestedSpec(spec);
    const ns = nested as Record<string, unknown>;
    if (typeof ns.root === "object" && ns.root != null) {
      return ns.root as SpecElement;
    }
    return null;
  }

  // Nested spec format: { root: { type: "...", ... } }
  if (typeof s.root === "object" && s.root != null) {
    return s.root as SpecElement;
  }

  return null;
}

export function generateCode(spec: Spec, componentName: string): string {
  const rootElement = extractElementTree(spec);
  if (!rootElement) {
    return wrapSnippetFile("", componentName, "<>{/* empty */}</>");
  }

  const usedTypes = new Set<string>();
  collectComponentTypes(rootElement, usedTypes);
  const imports = resolveImports(usedTypes);
  const importsStr = formatImports(imports);
  const jsxBody = renderElement(rootElement, 0);

  return wrapSnippetFile(importsStr, componentName, jsxBody);
}
