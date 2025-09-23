import { SyntaxKind } from "ts-morph";

import type { Transformer } from "@/src/utils/transformers";

export const transformRsc: Transformer = async ({ sourceFile, config }) => {
  if (config.rsc) {
    return sourceFile;
  }

  // Remove "use client" from the top of the file.
  // We need to be careful to only remove the directive itself, not any JSDoc comments

  const firstExpressionStatement = sourceFile.getFirstChildByKind(SyntaxKind.ExpressionStatement);
  if (!firstExpressionStatement) return sourceFile;

  const expression = firstExpressionStatement.getExpression();
  if (!expression) return sourceFile;

  const expressionText = expression.getText().trim();

  if (expressionText !== `"use client"` && expressionText !== `'use client'`) return sourceFile;

  const expressionStatementText = firstExpressionStatement.getText();
  const expressionStatementFullText = firstExpressionStatement.getFullText();

  if (expressionStatementText.trim() === expressionStatementFullText.trim()) return sourceFile;

  const triviaOnly = expressionStatementFullText.replace(expressionStatementText, "");
  const cleanedTriviaOnly = triviaOnly.replace(/^\s*\n/, "").replace(/\n\s*$/, "");

  firstExpressionStatement.replaceWithText(cleanedTriviaOnly);

  return sourceFile;
};
