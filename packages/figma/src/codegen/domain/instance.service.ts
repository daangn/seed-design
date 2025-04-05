import type { NormalizedFrameTrait, NormalizedInstanceNode } from "@/normalizer";
import {
  createElement,
  defineElementTransformer,
  definePropsTransformer,
  type ElementTransformer,
} from "../core";
import type { FigmaComponentService } from "./figma-component.service";
import type { FrameService } from "./frame.service";
import type { IconService } from "./icon.service";
import type { FillPropsService, ShapeFillProps } from "./props/fill-props.service";
import type {
  SeedSelfLayoutProps,
  SelfLayoutPropsService,
} from "./props/self-layout-props.service";

export interface InstanceService {
  transform: ElementTransformer<NormalizedInstanceNode>;
}

export interface SeedInstanceServiceDeps {
  figmaComponentService: FigmaComponentService;
  fillPropsService: FillPropsService<ShapeFillProps>;
  selfLayoutPropsService: SelfLayoutPropsService<SeedSelfLayoutProps>;
  iconService?: IconService;
  frameService?: FrameService;
  ignoredComponentKeys?: Set<string>;
}

export function createSeedInstanceService({
  figmaComponentService,
  fillPropsService,
  selfLayoutPropsService,
  iconService,
  frameService,
  ignoredComponentKeys,
}: SeedInstanceServiceDeps): InstanceService {
  const transformIconColorProps = definePropsTransformer((node: NormalizedFrameTrait, traverse) => {
    if (node.children.length === 0) {
      throw new Error("Node has no children");
    }

    const vectors = node.children.filter(
      (child) => child.type === "VECTOR" || child.type === "BOOLEAN_OPERATION",
    );

    const colorProps = vectors.map((vector) => fillPropsService.transform(vector, traverse));

    const fills = new Set(
      colorProps.map((props) => props.color).filter((color) => color !== undefined),
    );

    // If there are more than 1 color, colors are likely pre-defined in the icon component; we should ignore the color prop.
    if (fills.size > 1) {
      return {};
    }

    return { color: fills.values().next().value };
  });

  const transform = defineElementTransformer((node: NormalizedInstanceNode, traverse) => {
    const { componentKey, componentSetKey } = node;

    if (ignoredComponentKeys?.has(componentKey)) {
      return undefined;
    }

    if (iconService?.isIconComponent(componentKey)) {
      const tagName = iconService.createIconTagName(componentKey);
      const props = {
        ...selfLayoutPropsService.transform(node, traverse),
        ...transformIconColorProps(node, traverse),
      };
      return createElement(tagName, props);
    }

    const componentTransformer = componentSetKey
      ? figmaComponentService.getTransformer(componentSetKey)
      : figmaComponentService.getTransformer(componentKey);

    if (componentTransformer) {
      return componentTransformer.transform(node);
    }

    return frameService?.transform(node, traverse);
  });

  return {
    transform,
  };
}
