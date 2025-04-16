import type { IconService } from "@/entities";
import type { NormalizedFrameTrait, NormalizedInstanceNode } from "@/normalizer";
import {
  createElement,
  defineElementTransformer,
  definePropsTransformer,
  type ComponentTransformer,
  type ElementTransformer,
} from "../../core";
import type { PropsTransformers } from "./props";

export interface InstanceTransformerDeps {
  iconService?: IconService;
  ignoredComponentKeys?: Set<string>;
  propsTransformers: PropsTransformers;
  componentTransformers: Record<string, ComponentTransformer>;
  frameTransformer: ElementTransformer<NormalizedInstanceNode>;
}

export function createInstanceTransformer({
  iconService,
  ignoredComponentKeys,
  propsTransformers,
  componentTransformers,
  frameTransformer,
}: InstanceTransformerDeps): ElementTransformer<NormalizedInstanceNode> {
  const transformIconColorProps = definePropsTransformer((node: NormalizedFrameTrait, traverse) => {
    if (node.children.length === 0) {
      throw new Error("Node has no children");
    }

    const vectors = node.children.filter(
      (child) => child.type === "VECTOR" || child.type === "BOOLEAN_OPERATION",
    );

    const colorProps = vectors.map((vector) => propsTransformers.shapeFill(vector, traverse));

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
        ...propsTransformers.selfLayout(node, traverse),
        ...transformIconColorProps(node, traverse),
      };
      return createElement(tagName, props);
    }

    const componentTransformer = componentSetKey
      ? componentTransformers[componentSetKey]
      : componentTransformers[componentKey];

    if (componentTransformer) {
      return componentTransformer.transform(node);
    }

    return frameTransformer(node, traverse);
  });

  return transform;
}
