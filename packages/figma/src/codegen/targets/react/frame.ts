import type {
  NormalizedComponentNode,
  NormalizedFrameNode,
  NormalizedInstanceNode,
} from "@/normalizer";
import {
  cloneElement,
  createElement,
  defineElementTransformer,
  type ElementTransformer,
} from "../../core";
import type { ContainerLayoutProps, PropsConverters } from "./props";

export interface FrameTransformerDeps {
  propsConverters: PropsConverters;
}

export function createFrameTransformer({
  propsConverters,
}: FrameTransformerDeps): ElementTransformer<
  NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode
> {
  function inferLayoutComponent(props: ContainerLayoutProps, isFlex: boolean) {
    if (!isFlex) {
      return "Box";
    }

    if (props.direction === "column") {
      return "VStack";
    }

    return "HStack";
  }

  return defineElementTransformer(
    (node: NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode, traverse) => {
      const children = node.children;
      const transformedChildren = children.map(traverse);
      const isFlex = node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL";

      const props = {
        ...propsConverters.radius(node),
        ...(isFlex ? propsConverters.containerLayout(node) : {}),
        ...propsConverters.selfLayout(node),
        ...propsConverters.frameFill(node),
        ...propsConverters.stroke(node),
      };

      const isStretch = props.align === undefined || props.align === "stretch";
      const processedChildren = isStretch
        ? transformedChildren.map((child) =>
            child ? cloneElement(child, { alignSelf: undefined }) : child,
          )
        : transformedChildren;

      const layoutComponent = inferLayoutComponent(props, isFlex);

      if (layoutComponent === "VStack") {
        const { direction, ...rest } = props;

        return createElement("VStack", rest, processedChildren);
      }

      if (layoutComponent === "HStack") {
        const { direction, ...rest } = props;

        return createElement("HStack", rest, processedChildren);
      }

      if (layoutComponent === "Box") {
        return createElement("Box", props, processedChildren);
      }
    },
  );
}
