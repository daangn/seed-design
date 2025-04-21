import type {
  NormalizedComponentNode,
  NormalizedFrameNode,
  NormalizedInstanceNode,
} from "@/normalizer";
import { compactObject } from "@/utils/common";
import {
  cloneElement,
  createElement,
  defineElementTransformer,
  type ElementTransformer,
} from "../../core";
import type { ContainerLayoutProps, PropsTransformers } from "./props";

export interface FrameTransformerDeps {
  propsTransformers: PropsTransformers;
}

export function createFrameTransformer({
  propsTransformers,
}: FrameTransformerDeps): ElementTransformer<
  NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode
> {
  function inferLayoutComponent(props: ContainerLayoutProps) {
    if (
      props.flexDirection === "row" &&
      props.alignItems === "flexStart" &&
      props.justifyContent === "flexStart" &&
      props.flexWrap === "wrap"
    ) {
      return "Inline";
    }

    if (
      props.flexDirection === "row" &&
      props.justifyContent === "flexStart" &&
      props.flexWrap === "nowrap"
    ) {
      return "Columns";
    }

    if (props.flexDirection === "column") {
      return "Stack";
    }

    if (props.flexDirection !== undefined) {
      return "Flex";
    }

    return "Box";
  }

  return defineElementTransformer(
    (node: NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode, traverse) => {
      const children = node.children;
      const transformedChildren = children.map(traverse);

      const props = {
        ...propsTransformers.radius(node, traverse),
        ...propsTransformers.containerLayout(node, traverse),
        ...propsTransformers.selfLayout(node, traverse),
        ...propsTransformers.frameFill(node, traverse),
        ...propsTransformers.stroke(node, traverse),
      };

      const isStretch = props.alignItems === undefined || props.alignItems === "stretch";
      const processedChildren = isStretch
        ? transformedChildren.map((child) =>
            child ? cloneElement(child, { alignSelf: undefined }) : child,
          )
        : transformedChildren;

      const layoutComponent = inferLayoutComponent(props);

      if (layoutComponent === "Stack") {
        const { flexDirection, ...rest } = props;

        return createElement("Stack", rest, processedChildren);
      }

      if (layoutComponent === "Inline") {
        const { flexDirection, flexWrap, alignItems, justifyContent, ...rest } = props;

        return createElement("Inline", rest, processedChildren);
      }

      if (layoutComponent === "Columns") {
        const { flexDirection, flexWrap, justifyContent, ...rest } = props;

        return createElement(
          "Columns",
          rest,
          processedChildren.map((child) => createElement("Column", {}, child)),
        );
      }

      if (layoutComponent === "Flex") {
        const { flexDirection, ...rest } = props;

        return createElement(
          "Flex",
          compactObject({
            flexDirection: flexDirection === "row" ? undefined : flexDirection,
            ...rest,
          }),
          processedChildren,
        );
      }

      if (layoutComponent === "Box") {
        const { flexDirection, ...rest } = props;

        return createElement("Box", rest, processedChildren);
      }
    },
  );
}
