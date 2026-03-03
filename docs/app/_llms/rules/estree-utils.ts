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

export function isExpressionStatementNode(node: unknown): node is ExpressionStatementNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    (node as EstreeNode).type === "ExpressionStatement" &&
    "expression" in (node as ExpressionStatementNode)
  );
}

export function isLiteralNode(node: unknown): node is LiteralNode {
  return Boolean(node) && typeof node === "object" && (node as EstreeNode).type === "Literal";
}

export function isStringLiteral(node: unknown): node is LiteralNode & { value: string } {
  return isLiteralNode(node) && typeof (node as LiteralNode).value === "string";
}
