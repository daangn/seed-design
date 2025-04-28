import type { InlineBannerProperties } from "@/codegen/component-properties";
import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { NormalizedInstanceNode, NormalizedTextNode } from "@/normalizer";
import { findOne } from "@/utils/figma-node";
import { camelCase } from "change-case";
import type { SeedComponentHandlerDeps } from "../deps.interface";

export const createInlineBannerHandler = (ctx: SeedComponentHandlerDeps) =>
  defineComponentHandler<InlineBannerProperties>(metadata.inlineBanner.key, (node) => {
    const { componentProperties: props } = node;

    const tag = (() => {
      switch (props.Interaction.value) {
        case "Default":
          return "InlineBanner";
        case "Actionable":
          return "ActionableInlineBanner";
        case "Dismissible":
          return "DismissibleInlineBanner";
        case "Link":
          return "InlineBanner";
        default:
          return "InlineBanner";
      }
    })();

    const textNode = findOne(
      node,
      (child) => child.type === "TEXT" && child.name === "Label",
    ) as NormalizedTextNode | null;

    if (!textNode) {
      return createElement(tag, undefined, undefined, "내용을 제공해주세요.");
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

    const showIcon = props["Show Icon#11840:27"] && iconNode;
    const prefixIcon = showIcon ? ctx.iconHandler.transform(iconNode) : undefined;

    const commonProps = {
      variant: camelCase(props.Variant.value),
      title,
      description,
      ...(props.Interaction.value === "Link" && {
        linkProps: {
          children: props["Link Label#1547:81"].value,
        },
      }),
      prefixIcon,
    };

    return createElement(tag, commonProps);
  });
