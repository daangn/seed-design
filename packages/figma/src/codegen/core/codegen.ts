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
import { inferLayout, type ElementNode, type ElementTransformer } from "../core";
import { appendSource, createElement } from "../core/jsx";

export interface CodegenTransformerDeps {
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

export function createCodegenTransformer({
  frameTransformer,
  textTransformer,
  rectangleTransformer,
  instanceTransformer,
  vectorTransformer,
  booleanOperationTransformer,
  shouldInferAutoLayout,
}: CodegenTransformerDeps): (node: NormalizedSceneNode) => ElementNode | undefined {
  function traverse(node: NormalizedSceneNode): ElementNode | undefined {
    if ("visible" in node && !node.visible) {
      return;
    }

    const result = match(node)
      .with({ type: "FRAME" }, (node) =>
        shouldInferAutoLayout
          ? frameTransformer({ ...inferLayout(node), ...node }, traverse)
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

  return (node) => traverse(node);
}
