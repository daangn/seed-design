export * from "./core";
export * from "./domain";

import type { NormalizedSceneNode } from "@/normalizer";
import { codegenService } from "./context";

export function generateJsxTree(node: NormalizedSceneNode) {
  return codegenService.transform(node);
}

export function generateCode(node: NormalizedSceneNode, options: { printSource?: boolean } = {}) {
  return codegenService.transformToString(node, options);
}
