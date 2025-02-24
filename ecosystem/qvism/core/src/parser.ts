// Forked from https://github.com/postcss/postcss-js/blob/91d72b586410d1711089b14473b14bb59cfd8976/parser.js

import postcss, { type Root, type Container } from "postcss";

const IMPORTANT: RegExp = /\s*!important\s*$/i;

const UNITLESS: Record<string, boolean> = {
  "box-flex": true,
  "box-flex-group": true,
  "column-count": true,
  flex: true,
  "flex-grow": true,
  "flex-positive": true,
  "flex-shrink": true,
  "flex-negative": true,
  "font-weight": true,
  "line-clamp": true,
  "line-height": true,
  opacity: true,
  order: true,
  orphans: true,
  "tab-size": true,
  widows: true,
  "z-index": true,
  zoom: true,
  "fill-opacity": true,
  "stroke-dashoffset": true,
  "stroke-opacity": true,
  "stroke-width": true,
};

function dashify(str: string): string {
  return str
    .replace(/([A-Z])/g, "-$1")
    .replace(/^ms-/, "-ms-")
    .toLowerCase();
}

// Define types for the CSS object structure.
type CSSValue = string | number | boolean | null | undefined;
type CSSObject = Record<string, any>;

// A type guard to determine if a value is a primitive (CSSValue)
function isPrimitive(value: unknown): value is CSSValue {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function decl(parent: Container, name: string, value: CSSValue): void {
  if (value === false || value === null || value === undefined) return;

  if (!name.startsWith("--")) {
    name = dashify(name);
  }

  let valueStr: string;
  if (typeof value === "number") {
    // Append 'px' if needed
    valueStr = value === 0 || UNITLESS[name] ? value.toString() : value + "px";
  } else {
    valueStr = String(value);
  }

  if (name === "css-float") name = "float";

  if (IMPORTANT.test(valueStr)) {
    valueStr = valueStr.replace(IMPORTANT, "");
    parent.push(postcss.decl({ prop: name, value: valueStr, important: true }));
  } else {
    parent.push(postcss.decl({ prop: name, value: valueStr }));
  }
}

function atRule(parent: Container, parts: RegExpMatchArray | null, value: any): void {
  if (!parts) {
    throw new Error("Invalid at-rule format");
  }
  const atRuleName = parts[1]!;
  const params = parts[3] ? parts[3].trim() : "";
  const node = postcss.atRule({ name: atRuleName, params });
  // If the value is an object (and not an array), parse its content as child nodes.
  if (typeof value === "object" && !Array.isArray(value)) {
    node.nodes = [];
    parse(value as CSSObject, node);
  }
  parent.push(node);
}

function parse(obj: CSSObject, parent: Container): void {
  for (const name of Object.keys(obj)) {
    const value = obj[name];
    if (value === null || typeof value === "undefined") {
      continue;
    } else if (name[0] === "@") {
      // Match at-rule format like "@media screen and (min-width: 900px)"
      const parts = name.match(/@(\S+)(\s+([\W\w]*)\s*)?/);
      if (Array.isArray(value)) {
        for (const item of value) {
          atRule(parent, parts, item);
        }
      } else {
        atRule(parent, parts, value);
      }
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (!isPrimitive(item)) {
          throw new Error("Unexpected CSSObject in array; expected CSSValue");
        }
        decl(parent, name, item);
      }
    } else if (typeof value === "object") {
      const node = postcss.rule({ selector: name });
      parse(value as CSSObject, node);
      parent.push(node);
    } else {
      decl(parent, name, value);
    }
  }
}

export default function parseCssJs(obj: CSSObject): Root {
  const root = postcss.root();
  parse(obj, root);
  return root;
}
