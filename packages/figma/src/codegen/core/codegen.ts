import type {
  NormalizedBooleanOperationNode,
  NormalizedComponentNode,
  NormalizedFrameNode,
  NormalizedInstanceNode,
  NormalizedRectangleNode,
  NormalizedSceneNode,
  NormalizedTextNode,
  NormalizedVectorNode,
} from "@/normalizer";
import { match } from "ts-pattern";
import { appendSource, createElement, stringifyElement, type ElementNode } from "../core/jsx";
import type { ElementTransformer } from "./element-transformer";
import { applyInferredLayout, inferLayout } from "./infer-layout";

export interface CodeGeneratorDeps {
  frameTransformer: ElementTransformer<
    NormalizedFrameNode | NormalizedComponentNode | NormalizedInstanceNode
  >;
  textTransformer: ElementTransformer<NormalizedTextNode>;
  rectangleTransformer: ElementTransformer<NormalizedRectangleNode>;
  instanceTransformer: ElementTransformer<NormalizedInstanceNode>;
  vectorTransformer: ElementTransformer<NormalizedVectorNode>;
  booleanOperationTransformer: ElementTransformer<NormalizedBooleanOperationNode>;
  shouldInferAutoLayout: boolean;
}

export function createCodeGenerator({
  frameTransformer,
  textTransformer,
  rectangleTransformer,
  instanceTransformer,
  vectorTransformer,
  booleanOperationTransformer,
  shouldInferAutoLayout,
}: CodeGeneratorDeps) {
  function traverse(node: NormalizedSceneNode): ElementNode | undefined {
    if ("visible" in node && !node.visible) {
      return;
    }

    const result = match(node)
      .with({ type: "FRAME" }, (node) =>
        shouldInferAutoLayout
          ? frameTransformer(applyInferredLayout(node, inferLayout(node)), traverse)
          : frameTransformer(node, traverse),
      )
      .with({ type: "TEXT" }, (node) => textTransformer(node, traverse))
      .with({ type: "RECTANGLE" }, (node) => rectangleTransformer(node, traverse))
      .with({ type: "COMPONENT" }, (node) => frameTransformer(node, traverse)) // NOTE: Treat component node as Frame for now
      .with({ type: "INSTANCE" }, (node) => instanceTransformer(node, traverse))
      .with({ type: "VECTOR" }, (node) => vectorTransformer(node, traverse))
      .with({ type: "BOOLEAN_OPERATION" }, (node) => booleanOperationTransformer(node, traverse))
      .with({ type: "UNHANDLED" }, () => createElement("UnhandledFigmaNode"))
      .exhaustive();

    if (result) {
      return appendSource(result, node.id);
    }

    return;
  }

  function generateJsxTree(node: NormalizedSceneNode) {
    return traverse(node);
  }

  function generateCode(node: NormalizedSceneNode, options: { shouldPrintSource: boolean }) {
    const jsxTree = generateJsxTree(node);
    return jsxTree
      ? stringifyElement(jsxTree, { printSource: options.shouldPrintSource })
      : undefined;
  }

  return { generateJsxTree, generateCode };
}
