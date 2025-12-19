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
import { createSeedReactElement } from "./element-factories";
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
        ...propsConverters.shadow(node),
      };

      const isStretch = props.align === undefined || props.align === "stretch";

      const layoutComponent = inferLayoutComponent(props, isFlex);

      const hasSpacingMismatch =
        node.layoutWrap === "WRAP" &&
        node.counterAxisSpacing !== undefined &&
        node.itemSpacing !== node.counterAxisSpacing;

      const hasImageFill = node.fills.some(({ type }) => type === "IMAGE");
      const imgElement = hasImageFill
        ? createElement("img", {
            src: `https://placehold.co/${node.absoluteBoundingBox?.width ?? 100}x${node.absoluteBoundingBox?.height ?? 100}`,
          })
        : undefined;

      const processedChildren = [
        imgElement,
        ...(isStretch
          ? transformedChildren.map((child) =>
              child ? cloneElement(child, { alignSelf: undefined }) : child,
            )
          : transformedChildren),
      ];

      const comment = [
        hasSpacingMismatch &&
          // currently counterAxisSpacing is only supported when direction=row
          `row-gap과 column-gap이 다릅니다. (row-gap: ${node.counterAxisSpacing}, column-gap: ${node.itemSpacing})`,
      ]
        .filter((cmt) => cmt)
        .join(" ");

      switch (layoutComponent) {
        case "VStack":
        case "HStack": {
          const { direction: _direction, ...rest } = props;

          return createSeedReactElement(layoutComponent, rest, processedChildren, { comment });
        }
        case "Box":
          return createSeedReactElement("Box", props, processedChildren, { comment });
      }
    },
  );
}
