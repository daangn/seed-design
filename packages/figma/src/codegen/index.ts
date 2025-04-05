export * from "./core";
export * from "./domain";

import type { NormalizedSceneNode } from "@/normalizer";
import { codegenService, devCodegenService } from "./context";

export function generateJsxTree(node: NormalizedSceneNode) {
  return codegenService.transform(node);
}

export function generateCode(node: NormalizedSceneNode, { dev }: { dev?: boolean } = {}) {
  return dev ? devCodegenService.transformToString(node) : codegenService.transformToString(node);
}
