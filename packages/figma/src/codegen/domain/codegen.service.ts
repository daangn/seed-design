import type { NormalizedSceneNode } from "@/normalizer";
import type { ElementNode } from "../core";
import { appendSource, createElement, stringifyElement } from "../core/jsx";
import type { FrameService } from "./frame.service";
import type { InstanceService } from "./instance.service";
import type { RectangleService } from "./rectangle.service";
import type { TextService } from "./text.service";
import { match } from "ts-pattern";

export interface CodegenService {
  transform: (node: NormalizedSceneNode) => ElementNode | undefined;
  transformToString: (node: NormalizedSceneNode) => string | undefined;
}

export interface SeedCodegenServiceDeps {
  frameService: FrameService;
  textService: TextService;
  rectangleService: RectangleService;
  instanceService: InstanceService;
  shouldPrintSource: boolean;
}

export function createCodegenService({
  frameService,
  textService,
  rectangleService,
  instanceService,
  shouldPrintSource,
}: SeedCodegenServiceDeps): CodegenService {
  function traverse(node: NormalizedSceneNode): ElementNode | undefined {
    if ("visible" in node && !node.visible) {
      return;
    }

    const result = match(node)
      .with({ type: "FRAME" }, (node) => frameService.transform(node, traverse))
      .with({ type: "TEXT" }, (node) => textService.transform(node, traverse))
      .with({ type: "RECTANGLE" }, (node) => rectangleService.transform(node, traverse))
      .with({ type: "COMPONENT" }, (node) => frameService.transform(node, traverse)) // NOTE: Treat component node as Frame for now
      .with({ type: "INSTANCE" }, (node) => instanceService.transform(node, traverse))
      .with({ type: "VECTOR" }, () => createElement("svg", {}, "Vector Node Placeholder"))
      .with({ type: "BOOLEAN_OPERATION" }, () =>
        createElement("svg", {}, "Boolean Operation Node Placeholder"),
      )
      .with({ type: "UNHANDLED" }, () => createElement("UnhandledFigmaNode"))
      .exhaustive();

    if (result) {
      return appendSource(result, node.id);
    }

    return;
  }

  function transform(node: NormalizedSceneNode): ElementNode | undefined {
    return traverse(node);
  }

  function transformToString(node: NormalizedSceneNode): string | undefined {
    const result = transform(node);
    if (!result) return undefined;

    return stringifyElement(result, {
      printSource: shouldPrintSource,
    });
  }

  return { transform, transformToString };
}
