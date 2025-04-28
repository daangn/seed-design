import type { NormalizedInstanceNode } from "@/normalizer";
import {
  createElement,
  defineElementTransformer,
  type ComponentHandler,
  type ElementTransformer,
} from "../../core";
import type { IconHandler } from "./icon";
import type { PropsConverters } from "./props";

export interface InstanceTransformerDeps {
  iconHandler?: IconHandler;
  propsConverters: PropsConverters;
  componentHandlers: Record<string, ComponentHandler>;
  frameTransformer: ElementTransformer<NormalizedInstanceNode>;
}

export function createInstanceTransformer({
  iconHandler,
  propsConverters,
  componentHandlers,
  frameTransformer,
}: InstanceTransformerDeps): ElementTransformer<NormalizedInstanceNode> {
  const transform = defineElementTransformer((node: NormalizedInstanceNode, traverse) => {
    const { componentKey, componentSetKey } = node;

    if (iconHandler?.isIconInstance(node)) {
      const props = {
        ...propsConverters.iconSelfLayout(node),
        ...propsConverters.vectorChildrenFill(node),
      };
      return createElement("Icon", { svg: iconHandler.transform(node), ...props });
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
