import type { NormalizedSceneNode } from "@/normalizer";
import type { ElementNode } from "../core";
import { stringifyElement } from "../core/jsx";
import type { FrameService } from "./frame.service";
import type { InstanceService } from "./instance.service";
import type { RectangleService } from "./rectangle.service";
import type { TextService } from "./text.service";

export interface CodegenService {
  transform: (node: NormalizedSceneNode) => ElementNode | undefined;
  transformToString: (node: NormalizedSceneNode) => string | undefined;
}

export interface SeedCodegenServiceDeps {
  frameService: FrameService;
  textService: TextService;
  rectangleService: RectangleService;
  instanceService: InstanceService;
}

export function createCodegenService({
  frameService,
  textService,
  rectangleService,
  instanceService,
}: SeedCodegenServiceDeps): CodegenService {
  function traverse(node: NormalizedSceneNode): ElementNode | undefined {
    if ("visible" in node && !node.visible) {
      return;
    }

    if (node.type === "FRAME") return frameService.transform(node, traverse);
    if (node.type === "TEXT") return textService.transform(node, traverse);
    if (node.type === "RECTANGLE") return rectangleService.transform(node, traverse);
    if (node.type === "COMPONENT") return frameService.transform(node, traverse); // NOTE: Treat component node as Frame for now
    if (node.type === "INSTANCE") return instanceService.transform(node, traverse);

    return;
  }

  function transform(node: NormalizedSceneNode): ElementNode | undefined {
    return traverse(node);
  }

  function transformToString(node: NormalizedSceneNode): string | undefined {
    const result = transform(node);
    if (!result) return undefined;

    return stringifyElement(result);
  }

  return { transform, transformToString };
}
