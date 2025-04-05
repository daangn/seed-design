import type {
  NormalizedComponentNode,
  NormalizedFrameNode,
  NormalizedInstanceNode,
} from "@/normalizer";
import { createElement, defineElementTransformer, type ElementTransformer } from "../core";
import type {
  ContainerLayoutPropsService,
  SeedContainerLayoutProps,
} from "./props/container-layout-props.service";
import type { FillPropsService, FrameFillProps } from "./props/fill-props.service";
import type { RadiusPropsService, SeedRadiusProps } from "./props/radius-props.service";
import type {
  SeedSelfLayoutProps,
  SelfLayoutPropsService,
} from "./props/self-layout-props.service";
import type { SeedFrameStrokeProps, StrokePropsService } from "./props/stroke-props.service";

export interface FrameService {
  transform: ElementTransformer<
    NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode
  >;
}

export interface SeedFrameServiceDeps {
  containerLayoutPropsService: ContainerLayoutPropsService<SeedContainerLayoutProps>;
  selfLayoutPropsService: SelfLayoutPropsService<SeedSelfLayoutProps>;
  radiusPropsService: RadiusPropsService<SeedRadiusProps>;
  fillPropsService: FillPropsService<FrameFillProps>;
  strokePropsService: StrokePropsService<SeedFrameStrokeProps>;
}

export function createSeedFrameService({
  containerLayoutPropsService,
  selfLayoutPropsService,
  radiusPropsService,
  fillPropsService,
  strokePropsService,
}: SeedFrameServiceDeps): FrameService {
  function inferLayoutComponent(props: SeedContainerLayoutProps) {
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

    return "Flex";
  }

  const transform = defineElementTransformer(
    (node: NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode, traverse) => {
      const children = node.children;

      const props = {
        ...radiusPropsService.transform(node, traverse),
        ...containerLayoutPropsService.transform(node, traverse),
        ...selfLayoutPropsService.transform(node, traverse),
        ...fillPropsService.transform(node, traverse),
        ...strokePropsService.transform(node, traverse),
      };

      const layoutComponent = inferLayoutComponent(props);

      if (layoutComponent === "Stack") {
        const { flexDirection, ...rest } = props;

        return createElement("Stack", rest, children.map(traverse));
      }

      if (layoutComponent === "Inline") {
        const { flexDirection, flexWrap, alignItems, justifyContent, ...rest } = props;

        return createElement("Inline", rest, children.map(traverse));
      }

      if (layoutComponent === "Columns") {
        const { flexDirection, flexWrap, justifyContent, ...rest } = props;

        const childrenResult = children.map(traverse);

        return createElement(
          "Columns",
          rest,
          childrenResult.map((child) => createElement("Column", {}, child)),
        );
      }
    },
  );

  return {
    transform,
  };
}
