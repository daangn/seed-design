import type {
  BadgeProperties,
  ImageFrameIconProperties,
  ImageFrameOverlayIndicatorProperties,
  ImageFrameProperties,
  ImageFrameReactionButtonProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler, type ElementNode } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import * as components from "@/entities/data/__generated__/components";
import { findAllInstances } from "@/utils/figma-node";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { createBadgeHandler } from "@/codegen/targets/react/component/handlers/badge";

const CORNER_CONFIGS = [
  {
    showKey: "ㄴ Left Top#58686:165",
    swapKey: "Left Top#58686:0",
    placement: "top-start",
  },
  {
    showKey: "ㄴ Right Top#58686:198",
    swapKey: "Right Top#58686:66",
    placement: "top-end",
  },
  {
    showKey: "ㄴ Left Bottom#58686:231",
    swapKey: "Left Bottom#58686:99",
    placement: "bottom-start",
  },
  {
    showKey: "ㄴ Right Bottom#58686:264",
    swapKey: "Right Bottom#58686:132",
    placement: "bottom-end",
  },
] as const satisfies ReadonlyArray<{
  showKey: keyof ImageFrameProperties;
  swapKey: keyof ImageFrameProperties;
  placement: string;
}>;

function formatRatio(ratioStr: string): string {
  const [w, h] = ratioStr.split(":");

  return `${w} / ${h}`;
}

const createImageFrameBadgeHandler = (ctx: ComponentHandlerDeps) => {
  const badgeHandler = createBadgeHandler(ctx);

  return defineComponentHandler<BadgeProperties>(
    components.componentImageFrameBadge.key,
    (node, traverse) => {
      const [badge] = findAllInstances<BadgeProperties>({
        node,
        key: badgeHandler.key,
      });

      if (!badge) throw new Error("Badge component not found within ImageFrameBadge");

      const { tag, ...rest } = badgeHandler.transform(badge, traverse);

      return {
        ...createSeedReactElement("ImageFrameBadge", { tag }),
        ...rest,
      };
    },
  );
};

export const createImageFrameHandler = (ctx: ComponentHandlerDeps) => {
  const imageFrameBadgeHandler = createImageFrameBadgeHandler(ctx);

  return defineComponentHandler<ImageFrameProperties>(
    metadata.componentImageFrame.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const contentMap = new Map<string, ElementNode>([
        ...findAllInstances<BadgeProperties>({
          node,
          key: components.componentImageFrameBadge.key,
        }).map(
          (badge) =>
            [badge.componentKey, imageFrameBadgeHandler.transform(badge, traverse)] as const,
        ),
        ...findAllInstances<ImageFrameIconProperties>({
          node,
          key: components.componentImageFrameIcon.key,
        }).map(
          (icon) =>
            [
              icon.componentKey,
              createSeedReactElement("ImageFrameIcon", {
                svg: ctx.iconHandler.transform(icon.componentProperties["Icon#58686:297"]),
              }),
            ] as const,
        ),
        ...findAllInstances<ImageFrameOverlayIndicatorProperties>({
          node,
          key: components.componentImageFrameOverlayIndicator.key,
        }).map(
          (indicator) =>
            [
              indicator.componentKey,
              createSeedReactElement(
                "ImageFrameIndicator",
                undefined,
                indicator.componentProperties["Text#58708:0"].value,
              ),
            ] as const,
        ),
        ...findAllInstances<ImageFrameReactionButtonProperties>({
          node,
          key: metadata.componentImageFrameReactionButton.key,
        }).map(
          (rb) =>
            [
              rb.componentKey,
              createSeedReactElement("ImageFrameReactionButton", {
                ...(rb.componentProperties.Selected.value === "True" && {
                  defaultPressed: true,
                }),
              }),
            ] as const,
        ),
      ]);

      const floaters = CORNER_CONFIGS.flatMap(({ showKey, swapKey, placement }) => {
        if (!props[showKey].value) return [];

        const content = contentMap.get(props[swapKey].componentKey);
        if (!content) return [];

        return [createSeedReactElement("ImageFrameFloater", { placement }, content)];
      });

      const commonProps = {
        src: `https://placehold.co/${node.absoluteBoundingBox?.width ?? 100}x${node.absoluteBoundingBox?.height ?? 100}`,
        alt: "",
        ratio: formatRatio(props.Ratio.value),

        ...(props.Rounded.value === "True" && {
          borderRadius: ctx.valueResolver.getFormattedValue.topLeftRadius(node),
        }),

        ...(node.layoutGrow === 1
          ? { flexGrow: true }
          : { width: ctx.valueResolver.getFormattedValue.width(node) }),
      };

      return createSeedReactElement(
        "ImageFrame",
        commonProps,
        props["Show Overlay#58686:33"].value && floaters.length > 0 ? floaters : undefined,
        { comment: "alt 텍스트를 제공해야 합니다." },
      );
    },
  );
};
