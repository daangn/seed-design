export * from "./core";
export * from "./targets";

import type { NormalizedSceneNode } from "@/normalizer";
import { stringifyElement } from "./core/jsx";
import { figma, react } from "./targets";

export function generateJsxTree(
  node: NormalizedSceneNode,
  options: Partial<react.CreateContextOptions> = {},
) {
  const { shouldInferVariableName = true, shouldInferAutoLayout = true } = options;
  const codegen = react.createContext({
    shouldInferVariableName,
    shouldInferAutoLayout,
  });

  return codegen(node);
}

export function generateCode(
  node: NormalizedSceneNode,
  options: Partial<react.CreateContextOptions> & { shouldPrintSource?: boolean } = {},
) {
  const result = generateJsxTree(node, options);
  return result ? stringifyElement(result, { printSource: options.shouldPrintSource }) : undefined;
}

export function generateFigmaSummary(
  node: NormalizedSceneNode,
  options: Partial<figma.CreateContextOptions> & { shouldPrintSource?: boolean } = {},
) {
  const {
    shouldInferVariableName = false,
    shouldPrintSource = false,
    shouldInferAutoLayout = false,
  } = options;
  const codegen = figma.createContext({
    shouldInferVariableName,
    shouldInferAutoLayout,
  });

  const result = codegen(node);

  return result ? stringifyElement(result, { printSource: shouldPrintSource }) : undefined;
}
