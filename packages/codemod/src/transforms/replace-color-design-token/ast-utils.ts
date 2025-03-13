import type * as jscodeshift from "jscodeshift";
import type { ASTPath } from "jscodeshift";

export function getMemberExpressionName(path: ASTPath<jscodeshift.MemberExpression>): string {
  const parts: string[] = [];
  let current: jscodeshift.MemberExpression | jscodeshift.Identifier = path.node;

  while (current.type === "MemberExpression") {
    if (current.property.type === "Identifier") {
      parts.unshift(current.property.name);
    }
    current = current.object as jscodeshift.MemberExpression | jscodeshift.Identifier;
  }

  if (current.type === "Identifier") {
    parts.unshift(current.name);
  }

  return parts.join(".");
}

export function buildMemberExpression(
  j: jscodeshift.JSCodeshift,
  name: string,
): jscodeshift.MemberExpression {
  const parts = name.split(".");
  let expr: jscodeshift.Identifier | jscodeshift.MemberExpression = j.identifier(parts[0]);

  for (let i = 1; i < parts.length; i++) {
    expr = j.memberExpression(expr, j.identifier(parts[i]));
  }

  return expr as jscodeshift.MemberExpression;
}
