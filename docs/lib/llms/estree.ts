export interface EstreeNode {
  type: string;
}

export interface ProgramNode extends EstreeNode {
  type: "Program";
  body: EstreeNode[];
}

export interface ExpressionStatementNode extends EstreeNode {
  type: "ExpressionStatement";
  expression: EstreeNode;
}

export interface ArrayExpressionNode extends EstreeNode {
  type: "ArrayExpression";
  elements: (EstreeNode | null)[];
}

export interface LiteralNode extends EstreeNode {
  type: "Literal";
  value: unknown;
}

export function isProgramNode(node: unknown): node is ProgramNode {
  return Boolean(node) && typeof node === "object" && (node as EstreeNode).type === "Program";
}

function isLiteralNode(node: unknown): node is LiteralNode {
  return Boolean(node) && typeof node === "object" && (node as EstreeNode).type === "Literal";
}

export function isStringLiteral(node: unknown): node is LiteralNode & { value: string } {
  return isLiteralNode(node) && typeof (node as LiteralNode).value === "string";
}

export function isRegexLiteral(
  node: unknown,
): node is LiteralNode & { regex: { pattern: string; flags: string } } {
  return isLiteralNode(node) && "regex" in (node as LiteralNode);
}
