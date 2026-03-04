import type { List, ListItem, Paragraph, PhrasingContent, RootContent } from "mdast";
import type {
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
  MdxJsxFlowElement,
} from "mdast-util-mdx-jsx";
import type { Rule } from "./types";
import {
  type EstreeNode,
  isExpressionStatementNode,
  isLiteralNode,
  isProgramNode,
} from "./estree-utils";

interface ObjectExpressionNode extends EstreeNode {
  type: "ObjectExpression";
  properties: EstreeNode[];
}

interface PropertyNode extends EstreeNode {
  type: "Property";
  key: EstreeNode;
  value: EstreeNode;
  computed: boolean;
}

interface IdentifierNode extends EstreeNode {
  type: "Identifier";
  name: string;
}

interface UnaryExpressionNode extends EstreeNode {
  type: "UnaryExpression";
  operator: string;
  argument: EstreeNode;
}

interface BinaryExpressionNode extends EstreeNode {
  type: "BinaryExpression";
  operator: string;
  left: EstreeNode;
  right: EstreeNode;
}

interface TemplateElementNode extends EstreeNode {
  type: "TemplateElement";
  value: {
    cooked: string | null;
  };
}

interface TemplateLiteralNode extends EstreeNode {
  type: "TemplateLiteral";
  quasis: TemplateElementNode[];
  expressions: EstreeNode[];
}

interface JSXTextNode extends EstreeNode {
  type: "JSXText";
  value: string;
}

interface JSXExpressionContainerNode extends EstreeNode {
  type: "JSXExpressionContainer";
  expression: EstreeNode;
}

interface JSXIdentifierNode extends EstreeNode {
  type: "JSXIdentifier";
  name: string;
}

interface JSXElementNode extends EstreeNode {
  type: "JSXElement";
  openingElement: {
    name: EstreeNode;
  };
  children: EstreeNode[];
}

interface JSXFragmentNode extends EstreeNode {
  type: "JSXFragment";
  children: EstreeNode[];
}

interface TypeTableRow {
  name: string;
  type?: string;
  defaultValue?: string;
  required?: string;
  description?: string;
}

function isObjectExpressionNode(node: unknown): node is ObjectExpressionNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "ObjectExpression" &&
    Array.isArray((node as ObjectExpressionNode).properties)
  );
}

function isPropertyNode(node: unknown): node is PropertyNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "Property" &&
    "key" in (node as PropertyNode) &&
    "value" in (node as PropertyNode)
  );
}

function isIdentifierNode(node: unknown): node is IdentifierNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "Identifier" &&
    typeof (node as IdentifierNode).name === "string"
  );
}

function isUnaryExpressionNode(node: unknown): node is UnaryExpressionNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "UnaryExpression" &&
    typeof (node as UnaryExpressionNode).operator === "string"
  );
}

function isBinaryExpressionNode(node: unknown): node is BinaryExpressionNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "BinaryExpression" &&
    typeof (node as BinaryExpressionNode).operator === "string"
  );
}

function isTemplateLiteralNode(node: unknown): node is TemplateLiteralNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "TemplateLiteral" &&
    Array.isArray((node as TemplateLiteralNode).quasis) &&
    Array.isArray((node as TemplateLiteralNode).expressions)
  );
}

function isJSXTextNode(node: unknown): node is JSXTextNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "JSXText" &&
    typeof (node as JSXTextNode).value === "string"
  );
}

function isJSXExpressionContainerNode(node: unknown): node is JSXExpressionContainerNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "JSXExpressionContainer" &&
    "expression" in (node as JSXExpressionContainerNode)
  );
}

function isJSXIdentifierNode(node: unknown): node is JSXIdentifierNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "JSXIdentifier" &&
    typeof (node as JSXIdentifierNode).name === "string"
  );
}

function isJSXElementNode(node: unknown): node is JSXElementNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "JSXElement" &&
    Array.isArray((node as JSXElementNode).children)
  );
}

function isJSXFragmentNode(node: unknown): node is JSXFragmentNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "JSXFragment" &&
    Array.isArray((node as JSXFragmentNode).children)
  );
}

function isTypeAttributeValueExpression(
  value: MdxJsxAttribute["value"],
): value is MdxJsxAttributeValueExpression {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    (value as MdxJsxAttributeValueExpression).type === "mdxJsxAttributeValueExpression"
  );
}

function getPropertyName(node: EstreeNode): string | undefined {
  if (isIdentifierNode(node)) return node.name;
  if (isLiteralNode(node) && typeof node.value === "string") return node.value;
  return undefined;
}

function getJSXTagName(node: EstreeNode): string | undefined {
  if (isJSXIdentifierNode(node)) return node.name;
  return undefined;
}

function normalizeText(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : undefined;
}

function expressionToText(node: EstreeNode | undefined): string | undefined {
  if (!node) return undefined;

  if (isLiteralNode(node)) {
    if (typeof node.value === "string") return node.value;
    if (node.value === null) return "null";
    if (typeof node.value === "boolean" || typeof node.value === "number")
      return String(node.value);
    return undefined;
  }

  if (isIdentifierNode(node)) {
    return node.name;
  }

  if (isUnaryExpressionNode(node)) {
    const argument = expressionToText(node.argument);
    return argument ? `${node.operator}${argument}` : undefined;
  }

  if (isBinaryExpressionNode(node) && node.operator === "+") {
    const left = expressionToText(node.left) ?? "";
    const right = expressionToText(node.right) ?? "";
    return `${left}${right}`;
  }

  if (isTemplateLiteralNode(node)) {
    const parts: string[] = [];
    for (let index = 0; index < node.quasis.length; index += 1) {
      const quasi = node.quasis[index];
      parts.push(quasi.value.cooked ?? "");
      const expression = node.expressions[index];
      if (!expression) continue;
      const expressionText = expressionToText(expression);
      if (expressionText) {
        parts.push(`\${${expressionText}}`);
      }
    }
    return parts.join("");
  }

  if (isJSXExpressionContainerNode(node)) {
    return expressionToText(node.expression);
  }

  if (isJSXTextNode(node)) {
    return node.value;
  }

  if (isJSXFragmentNode(node)) {
    return node.children.map((child) => expressionToText(child) ?? "").join("");
  }

  if (isJSXElementNode(node)) {
    const tagName = getJSXTagName(node.openingElement.name);
    const innerText = node.children.map((child) => expressionToText(child) ?? "").join("");

    if (tagName === "p") return `${innerText}\n`;
    if (tagName === "br") return "\n";
    return innerText;
  }

  return undefined;
}

function getTypeObjectExpression(node: MdxJsxFlowElement): ObjectExpressionNode | undefined {
  const typeAttribute = node.attributes.find(
    (attribute): attribute is MdxJsxAttribute =>
      attribute.type === "mdxJsxAttribute" && attribute.name === "type",
  );
  if (!typeAttribute || !isTypeAttributeValueExpression(typeAttribute.value)) return undefined;

  const estree = typeAttribute.value.data?.estree;
  if (!isProgramNode(estree)) return undefined;

  const statement = estree.body[0];
  if (!isExpressionStatementNode(statement)) return undefined;
  if (!isObjectExpressionNode(statement.expression)) return undefined;

  return statement.expression;
}

function extractRows(typeObject: ObjectExpressionNode): TypeTableRow[] {
  const rows: TypeTableRow[] = [];

  for (const property of typeObject.properties) {
    if (!isPropertyNode(property) || property.computed) continue;

    const rowName = getPropertyName(property.key);
    if (!rowName || !isObjectExpressionNode(property.value)) continue;

    const row: TypeTableRow = { name: rowName };

    for (const metaProperty of property.value.properties) {
      if (!isPropertyNode(metaProperty) || metaProperty.computed) continue;

      const metaName = getPropertyName(metaProperty.key);
      const metaValue = normalizeText(expressionToText(metaProperty.value));

      if (!metaName || !metaValue) continue;

      if (metaName === "type") row.type = metaValue;
      if (metaName === "default") row.defaultValue = metaValue;
      if (metaName === "required") row.required = metaValue;
      if (metaName === "description") row.description = metaValue;
    }

    rows.push(row);
  }

  return rows;
}

function createFieldListItem(label: string, value: string, asCode: boolean): ListItem {
  const paragraphChildren: PhrasingContent[] = [{ type: "text", value: `${label}: ` }];
  paragraphChildren.push(asCode ? { type: "inlineCode", value } : { type: "text", value });

  const paragraph: Paragraph = {
    type: "paragraph",
    children: paragraphChildren,
  };

  return {
    type: "listItem",
    spread: false,
    children: [paragraph],
  };
}

function createRowDetailList(row: TypeTableRow): List {
  const children: ListItem[] = [];

  if (row.type) children.push(createFieldListItem("type", row.type, true));
  if (row.defaultValue) children.push(createFieldListItem("default", row.defaultValue, true));
  if (row.required) children.push(createFieldListItem("required", row.required, true));
  if (row.description) children.push(createFieldListItem("description", row.description, false));

  return {
    type: "list",
    ordered: false,
    spread: false,
    children,
  };
}

function createListItem(row: TypeTableRow): ListItem {
  const nameParagraph: Paragraph = {
    type: "paragraph",
    children: [{ type: "inlineCode", value: row.name }],
  };

  const detailList = createRowDetailList(row);
  const children: ListItem["children"] = [nameParagraph];

  if (detailList.children.length > 0) {
    children.push(detailList);
  }

  return {
    type: "listItem",
    spread: false,
    children,
  };
}

function createTypeTableList(rows: TypeTableRow[]): List {
  return {
    type: "list",
    ordered: false,
    spread: false,
    children: rows.map(createListItem),
  };
}

export const typeTableRule: Rule = {
  name: "TypeTable",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "TypeTable",
  transform: (node) => {
    try {
      const typeObject = getTypeObjectExpression(node);
      if (!typeObject) return [node];

      const rows = extractRows(typeObject);
      if (rows.length === 0) return [node];

      return [createTypeTableList(rows) as RootContent];
    } catch {
      return [node];
    }
  },
};
