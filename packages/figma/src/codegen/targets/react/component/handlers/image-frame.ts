import type {
  BadgeProperties,
  ImageFrameIconProperties,
  ImageFrameOverlayIndicatorProperties,
  ImageFrameProperties,
  ImageFrameReactionButtonProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import * as components from "@/entities/data/__generated__/components";
import { findAllInstances, findOne } from "@/utils/figma-node";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { createBadgeHandler } from "@/codegen/targets/react/component/handlers/badge";

const CORNER_CONFIGS = [
  {
    showKey: "ㄴ Left Top#58686:165",
    placement: "top-start",
  },
  {
    showKey: "ㄴ Right Top#58686:198",
    placement: "top-end",
  },
  {
    showKey: "ㄴ Left Bottom#58686:231",
    placement: "bottom-start",
  },
  {
    showKey: "ㄴ Right Bottom#58686:264",
    placement: "bottom-end",
  },
] as const satisfies ReadonlyArray<{
  showKey: keyof ImageFrameProperties;
  placement: string;
}>;

function formatRatio(ratioStr: `${number}:${number}`): string {
  const [w, h] = ratioStr.split(":");

  return `${w} / ${h}`;
}

export const createImageFrameBadgeHandler = (ctx: ComponentHandlerDeps) => {
  const badgeHandler = createBadgeHandler(ctx);

  return defineComponentHandler<{}>(components.componentImageFrameBadge.key, (node, traverse) => {
    const [badge] = findAllInstances<BadgeProperties>({
      node,
      key: badgeHandler.key,
    });

    if (!badge) throw new Error("Badge component not found within ImageFrameBadge");

    return { ...badgeHandler.transform(badge, traverse), tag: "ImageFrameBadge" };
  });
};

export const createImageFrameReactionButtonHandler = (_ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<ImageFrameReactionButtonProperties>(
    metadata.componentImageFrameReactionButton.key,
    ({ componentProperties: props }) => {
      return createSeedReactElement("ImageFrameReactionButton", {
        ...(props.Selected.value === "True" && { defaultPressed: true }),
      });
    },
  );
};

export const createImageFrameOverlayIndicatorHandler = (_ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<ImageFrameOverlayIndicatorProperties>(
    components.componentImageFrameOverlayIndicator.key,
    ({ componentProperties: props }) => {
      return createSeedReactElement("ImageFrameIndicator", undefined, props["Text#58708:0"].value);
    },
  );
};

export const createImageFrameIconHandler = (ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<ImageFrameIconProperties>(
    components.componentImageFrameIcon.key,
    ({ componentProperties: props }) => {
      return createSeedReactElement("ImageFrameIcon", {
        svg: ctx.iconHandler.transform(props["Icon#58686:297"]),
      });
    },
  );
};

export const createImageFrameHandler = (ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<ImageFrameProperties>(
    metadata.componentImageFrame.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const floaters = [];
      for (const { showKey, placement } of CORNER_CONFIGS) {
        if (!props[showKey].value) continue;

        const slotName = showKey.split("#")[0];
        const slotNode = findOne(node, (n) => "name" in n && n.name === slotName);
        if (!slotNode) continue;

        const child = traverse(slotNode);
        if (!child) continue;

        floaters.push(createSeedReactElement("ImageFrameFloater", { placement }, child));
      }

      const commonProps = {
        src: `https://placehold.co/${node.absoluteBoundingBox?.width ?? 100}x${node.absoluteBoundingBox?.height ?? 100}`,
        alt: "",
        ratio: formatRatio(props.Ratio.value),

        ...(props.Rounded.value === "True" && {
          borderRadius: ctx.valueResolver.getFormattedValue.topLeftRadius(node),
        }),

        ...(node.layoutGrow === 1
          ? { flexGrow: true }
          : node.layoutAlign === "STRETCH"
            ? { alignSelf: "stretch" }
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
