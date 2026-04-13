import type { Spec } from "@json-render/core";

interface FlatSpec {
  root: string;
  elements: Record<string, FlatElement>;
  state?: Record<string, unknown>;
}

interface FlatElement {
  type: string;
  props?: Record<string, unknown>;
  children?: (string | FlatElement)[];
  visible?: unknown;
  on?: Record<string, unknown>;
  watch?: Record<string, unknown>;
}

interface NestedElement {
  type: string;
  props?: Record<string, unknown>;
  children?: (NestedElement | string)[];
  visible?: unknown;
  on?: Record<string, unknown>;
  watch?: Record<string, unknown>;
}

interface NestedSpec {
  root: NestedElement;
  state?: Record<string, unknown>;
}

function resolveElement(
  id: string,
  elements: Record<string, FlatElement>,
  visited: Set<string>,
): NestedElement | string {
  if (visited.has(id)) return id;
  const el = elements[id];
  if (!el) return id;

  visited.add(id);

  const resolved: NestedElement = {
    type: el.type,
    props: el.props,
  };

  if (el.children && el.children.length > 0) {
    resolved.children = el.children.map((child) => {
      if (typeof child === "string") {
        // Could be an element reference or text content
        if (elements[child]) {
          return resolveElement(child, elements, visited);
        }
        return child; // Text content
      }
      return child as NestedElement;
    });
  }

  if (el.visible !== undefined) resolved.visible = el.visible;
  if (el.on) resolved.on = el.on;
  if (el.watch) resolved.watch = el.watch;

  return resolved;
}

export function flatToNestedSpec(spec: unknown): Spec {
  const flat = spec as FlatSpec;
  if (!flat.root || !flat.elements) return spec as Spec;

  // If root is already an object, spec is already nested
  if (typeof flat.root !== "string") return spec as Spec;

  const rootElement = resolveElement(flat.root, flat.elements, new Set());
  if (typeof rootElement === "string") return spec as Spec;

  const nested: NestedSpec = { root: rootElement };
  if (flat.state) nested.state = flat.state;

  return nested as unknown as Spec;
}

export function isNonEmptySpec(spec: unknown): boolean {
  if (!spec || typeof spec !== "object") return false;
  const s = spec as Record<string, unknown>;
  if (!("root" in s) || s.root == null) return false;

  // For flat spec format: need both root and elements with the root element
  if (typeof s.root === "string") {
    const elements = s.elements as Record<string, unknown> | undefined;
    return !!elements && s.root in elements;
  }

  // For nested spec format: root is already an object
  return typeof s.root === "object";
}
