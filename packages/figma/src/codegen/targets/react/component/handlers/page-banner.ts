import type {
  PageBannerButtonProperties,
  PageBannerProperties,
} from "@/codegen/component-properties";
import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import * as components from "@/entities/data/__generated__/components";
import type { NormalizedInstanceNode, NormalizedTextNode } from "@/normalizer";
import { findAllInstances, findOne } from "@/utils/figma-node";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("page-banner");

const createPageBannerButtonHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<PageBannerButtonProperties>(
    components.componentPageBannerSuffixAction.key,
    (node) => {
      return createElement(
        "PageBannerButton",
        undefined,
        node.componentProperties["Label#39890:0"].value,
      );
    },
  );

export const createPageBannerHandler = (ctx: ComponentHandlerDeps) => {
  const buttonHandler = createPageBannerButtonHandler(ctx);

  return defineComponentHandler<PageBannerProperties>(
    metadata.componentPageBanner.key,
    (node, traverse) => {
      const { componentProperties: props } = node;

      const { tag, suffix } = match(props.Interaction.value)
        .with("Actionable", () => ({ tag: "ActionablePageBanner", suffix: undefined }))
        .with("Dismissible", () => ({ tag: "DismissiblePageBanner", suffix: undefined }))
        .with("Display", () => ({ tag: "PageBanner", suffix: undefined }))
        .with("Display (With Action)", () => {
          const [buttonNode] = findAllInstances<PageBannerButtonProperties>({
            node,
            key: components.componentPageBannerSuffixAction.key,
          });
          const suffix = buttonNode ? buttonHandler.transform(buttonNode, traverse) : undefined;

          return { tag: "PageBanner", suffix };
        })
        .with("Actionable (Custom)", () => ({
          tag: "PageBanner",
          suffix: createElement("div", undefined, "Custom Content"),
        }))
        .exhaustive();

      const textNode = findOne(
        node,
        (child) => child.type === "TEXT" && child.name === "Text",
      ) as NormalizedTextNode | null;

      if (!textNode) {
        return createLocalSnippetElement(tag, undefined, undefined, {
          comment: "내용을 제공해주세요.",
        });
      }

      const slices = textNode.segments;

      let title: string | undefined;
      let description: string | undefined;

      switch (slices.length) {
        case 1: {
          description = slices[0]?.characters.trim();

          break;
        }
        case 2: {
          title = slices[0]?.characters.trim();
          description = slices[1]?.characters.trim();

          break;
        }
      }

      const iconNode = findOne(
        node,
        (child) => child.type === "INSTANCE" && child.name === "icon",
      ) as NormalizedInstanceNode | null;

      const showPrefixIcon = props["Show Prefix Icon#11840:27"].value && iconNode;
      const prefixIcon = showPrefixIcon ? ctx.iconHandler.transform(iconNode) : undefined;

      const commonProps = {
        title,
        description,
        prefixIcon,
        tone: camelCase(props.Tone.value),
        variant: camelCase(props.Variant.value),
        ...(suffix && { suffix }),
      };

      return createLocalSnippetElement(tag, commonProps);
    },
  );
};
