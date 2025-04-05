import type { NormalizedRectangleNode } from "@/normalizer";
import { createElement, defineElementTransformer, type ElementTransformer } from "../core";
import type {
  SeedSelfLayoutProps,
  SelfLayoutPropsService,
} from "./props/self-layout-props.service";

export interface RectangleService {
  transform: ElementTransformer<NormalizedRectangleNode>;
}

export interface SeedRectangleServiceDeps {
  selfLayoutPropsService: SelfLayoutPropsService<SeedSelfLayoutProps>;
}

export function createSeedRectangleService({
  selfLayoutPropsService,
}: SeedRectangleServiceDeps): RectangleService {
  const transform = defineElementTransformer((node: NormalizedRectangleNode, traverse) => {
    return createElement(
      "Box",
      { ...selfLayoutPropsService.transform(node, traverse), background: "palette.gray200" },
      undefined,
      "Rectangle Node Placeholder",
    );
  });

  return {
    transform,
  };
}
