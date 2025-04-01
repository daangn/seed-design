import { match } from "ts-pattern";
import * as metadata from "../../data/__generated__/component-sets";
import { createIconTagNameFromKey } from "../../icon";
import { createElement } from "../../jsx";
import { findAll, findAllInstances, findOne } from "../../node-util";
import type { NormalizedInstanceNode, NormalizedTextNode } from "../../normalizer/types";
import type {
  AppBarLeftProperties,
  AppBarMainProperties,
  AppBarProperties,
  AppBarRightProperties,
} from "../type";
import type { ComponentHandler } from "../type-helper";

export const appBarHandler: ComponentHandler<AppBarProperties> = {
  key: metadata.standardNavigation.key,
  codegen: async (node) => {
    const props = node.componentProperties;

    const theme = (() => {
      switch (props.OS.value) {
        case "Android":
          return "android";
        case "iOS":
          return "cupertino";
      }
    })();

    const tone = (() => {
      switch (props.Variant.value) {
        case "Layer Default":
          return "layer";
        case "Transparent":
          return "transparent";
      }
    })();

    const mainNode = await findAllInstances<AppBarMainProperties>({
      key: appBarMainHandler.key,
      node,
    });
    const onlyMainNode = mainNode.length === 1 ? mainNode[0] : undefined;
    const main = onlyMainNode ? await appBarMainHandler.codegen(onlyMainNode) : undefined;

    const leftNode = await findAllInstances<AppBarLeftProperties>({
      key: appBarLeftHandler.key,
      node,
    });
    const onlyLeftNode = leftNode.length === 1 ? leftNode[0] : undefined;
    const left = onlyLeftNode ? await appBarLeftHandler.codegen(onlyLeftNode) : undefined;

    const rightNode = await findAllInstances<AppBarRightProperties>({
      key: appBarRightHandler.key,
      node,
    });
    const onlyRightNode = rightNode.length === 1 ? rightNode[0] : undefined;
    const right = onlyRightNode ? await appBarRightHandler.codegen(onlyRightNode) : undefined;

    return createElement(
      "AppBar",
      { theme, tone },
      [left, main, right].filter(Boolean),
      tone === "transparent"
        ? `<AppScreen layerOffsetTop="none">으로 상단 패딩을 제거할 수 있습니다.`
        : undefined,
    );
  },
};

const appBarMainHandler: ComponentHandler<AppBarMainProperties> = {
  key: "336b49b26c3933485d87cc460b06c390976ea58e",
  codegen: async ({ componentProperties: props }) => {
    const { title, subtitle, layout } = match(props.Type.value)
      .with("Title", () => ({
        title: props["Title#16944:0"].value,
        subtitle: undefined,
        layout: undefined,
      }))
      .with("Title-Subtitle", () => ({
        title: props["Title#16944:0"].value,
        subtitle: props["Subtitle#16958:9"].value,
        layout: "withSubtitle",
      }))
      .otherwise(() => ({
        title: undefined,
        subtitle: undefined,
        layout: undefined,
      }));

    const commonProps = {
      title,
      subtitle,
      layout,
    };

    return createElement(
      "AppBarMain",
      commonProps,
      undefined,
      title === undefined ? "Title을 제공해주세요." : undefined,
    );
  },
};

const appBarLeftHandler: ComponentHandler<AppBarLeftProperties> = {
  key: "e5d2e47052a22395db79f195a0991a570dc1b6c9",
  codegen: async (node) => {
    const props = node.componentProperties;

    const children = await (async () => {
      switch (props.Action.value) {
        case "Back":
          return createElement("AppBarBackButton", undefined);
        case "Close":
          return createElement("AppBarCloseButton", undefined);
        case "Other": {
          const iconNode = findOne(
            node,
            (child) => child.type === "INSTANCE" && child.name === "Icon",
          ) as NormalizedInstanceNode | null;

          const iconComponentKey = iconNode?.componentKey ?? undefined;

          return createElement(
            "AppBarIconButton",
            undefined,
            iconComponentKey
              ? createElement(createIconTagNameFromKey(iconComponentKey))
              : undefined,
            iconComponentKey === undefined
              ? "아이콘과, aria-label 또는 aria-labelledby를 제공해주세요."
              : "aria-label 또는 aria-labelledby를 제공해주세요.",
          );
        }
      }
    })();

    return createElement("AppBarLeft", undefined, children);
  },
};

const appBarRightHandler: ComponentHandler<AppBarRightProperties> = {
  key: "9e157fc2d1f89ffee938a5bc62f4a58064fec44e",
  codegen: async (node) => {
    const props = node.componentProperties;

    const children = await (async () => {
      switch (props.Type.value) {
        case "1 Text": {
          const textNode = findOne(
            node,
            (child) => child.type === "TEXT",
          ) as NormalizedTextNode | null;

          return textNode?.characters;
        }
        default: {
          const iconNodes = findAll(
            node,
            (child) => child.type === "INSTANCE" && child.name === "Icon",
          ) as NormalizedInstanceNode[];

          const iconComponentKeys = iconNodes.map((iconNode) => iconNode.componentKey);

          return iconComponentKeys.map((iconComponentKey) =>
            createElement(
              "AppBarIconButton",
              undefined,
              iconComponentKey
                ? createElement(createIconTagNameFromKey(iconComponentKey))
                : undefined,
              iconComponentKey === undefined
                ? "아이콘과, aria-label 또는 aria-labelledby를 제공해주세요."
                : "aria-label 또는 aria-labelledby를 제공해주세요.",
            ),
          );
        }
      }
    })();

    return createElement("AppBarRight", undefined, children);
  },
};
