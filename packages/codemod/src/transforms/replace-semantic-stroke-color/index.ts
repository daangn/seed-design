import type * as jscodeshift from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";
import {
  buildMemberExpression,
  getMemberExpressionName,
} from "../replace-seed-design-token-vars/ast-utils.js";

// Logger definition at the top of transform
const logger = createTransformLogger("replace-semantic-stroke-color");

// High priority transformation (must be processed first to prevent chain transformations)
const firstPassMapping = {
  from: "neutralMuted",
  to: "neutralSubtle",
};

// Other transformations (order doesn't matter)
const secondPassMappings = [
  { from: "onImage", to: "neutralSubtle" },
  { from: "neutral", to: "neutralMuted" },
  { from: "fieldFocused", to: "neutralContrast" },
  { from: "control", to: "neutralWeak" },
  { from: "field", to: "neutralWeak" },
  { from: "brand", to: "brandWeak" },
  { from: "positive", to: "positiveWeak" },
  { from: "informative", to: "informativeWeak" },
  { from: "warning", to: "warningWeak" },
  { from: "critical", to: "criticalWeak" },
];

/**
 * Function to transform stroke tokens
 */
function transformStrokeToken(
  root: any,
  j: jscodeshift.JSCodeshift,
  filePath: string,
  mapping: { from: string; to: string },
  isFirstPass = false,
): boolean {
  let hasChanges = false;

  root
    .find(j.MemberExpression)
    .filter((path: any) => {
      const memberName = getMemberExpressionName(path);
      return (
        memberName.startsWith("vars.$color.stroke.") &&
        memberName === `vars.$color.stroke.${mapping.from}`
      );
    })
    .forEach((path: any) => {
      const memberName = getMemberExpressionName(path);
      const line = path.node.loc?.start.line;

      const newName = `vars.$color.stroke.${mapping.to}`;
      const newExpr = buildMemberExpression(j, newName);
      path.replace(newExpr);
      hasChanges = true;

      logger.logTransformResult(filePath, {
        previousToken: memberName,
        nextToken: newName,
        line,
        status: "success",
        description: isFirstPass ? "First pass (priority)" : "Second pass",
      });
    });

  return hasChanges;
}

/**
 * Main transform for JavaScript/TypeScript files
 */
const replaceSemanticStrokeColor: jscodeshift.Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  logger.startFile(file.path);

  let hasChanges = false;

  // First pass: neutralMuted → neutralSubtle priority transformation (prevent chain transformations)
  const firstPassChanged = transformStrokeToken(root, j, file.path, firstPassMapping, true);
  hasChanges = hasChanges || firstPassChanged;

  // Second pass: other transformations
  for (const mapping of secondPassMappings) {
    const secondPassChanged = transformStrokeToken(root, j, file.path, mapping, false);
    hasChanges = hasChanges || secondPassChanged;
  }

  // Log warning if no tokens were transformed
  if (!hasChanges) {
    // Check if there are any vars.$color.stroke tokens
    let hasStrokeTokens = false;
    root
      .find(j.MemberExpression)
      .filter((path: any) => {
        const memberName = getMemberExpressionName(path);
        return memberName.startsWith("vars.$color.stroke.");
      })
      .forEach(() => {
        hasStrokeTokens = true;
      });

    if (hasStrokeTokens) {
      logger.logTransformResult(file.path, {
        previousToken: "Found stroke tokens but no transformations needed",
        nextToken: null,
        status: "warning",
        description: "All stroke tokens are already in v3 format",
      });
    }
  }

  logger.finishFile(file.path);

  if (!hasChanges) {
    return null; // Return null if no changes
  }

  return root.toSource();
};

export default replaceSemanticStrokeColor;
