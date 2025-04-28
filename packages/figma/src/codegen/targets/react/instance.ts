import type { IconService } from "@/entities";
import type { NormalizedInstanceNode } from "@/normalizer";
import {
  createElement,
  defineElementTransformer,
  type ComponentHandler,
  type ElementTransformer,
} from "../../core";
import type { PropsConverters } from "./props";

export interface InstanceTransformerDeps {
  iconService?: IconService;
  propsConverters: PropsConverters;
  componentHandlers: Record<string, ComponentHandler>;
  frameTransformer: ElementTransformer<NormalizedInstanceNode>;
}

export function createInstanceTransformer({
  iconService,
  propsConverters,
  componentHandlers,
  frameTransformer,
}: InstanceTransformerDeps): ElementTransformer<NormalizedInstanceNode> {
  const transform = defineElementTransformer((node: NormalizedInstanceNode, traverse) => {
    const { componentKey, componentSetKey } = node;

    if (iconService?.isIconComponent(componentKey)) {
      const tagName = iconService.createIconTagName(componentKey);
      const props = {
        ...propsConverters.iconSelfLayout(node),
        ...propsConverters.vectorChildrenFill(node),
      };
      return createElement("Icon", { svg: createElement(tagName), ...props });
    }

    const componentHandler = componentSetKey
      ? componentHandlers[componentSetKey]
      : componentHandlers[componentKey];

    if (componentHandler) {
      return componentHandler.transform(node);
    }

    return frameTransformer(node, traverse);
  });

  return transform;
}
