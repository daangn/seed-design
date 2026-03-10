import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import type { ComponentHandlerDeps } from "../deps.interface";
import type {
  ActionButtonGhostProperties,
  ActionButtonProperties,
} from "@/codegen/component-properties";
import { handleSizeProp } from "../size";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import { findOne } from "@/utils/figma-node";
import type { NormalizedTextNode } from "@/normalizer";

const { createLocalSnippetElement } = createLocalSnippetHelper("action-button");

export const createActionButtonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ActionButtonProperties>(
    metadata.componentActionButton.key,
    ({ componentProperties: props, layoutGrow }) => {
      const states = props.State.value.split("-");

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createSeedReactElement("Icon", {
              svg: ctx.iconHandler.transform(props["Icon#7574:0"]),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createSeedReactElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#5987:305"]),
            }),
            props["Label#5987:61"].value,
          ],
        }))
        .with("Icon Last", () => ({
          layout: "withText",
          children: [
            props["Label#5987:61"].value,
            createSeedReactElement("SuffixIcon", {
              svg: ctx.iconHandler.transform(props["Suffix Icon#5987:244"]),
            }),
          ],
        }))
        .with("Text Only", () => ({
          layout: "withText",
          children: props["Label#5987:61"].value,
        }))
        .exhaustive();

      const commonProps = {
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
        ...(states.includes("Loading") && {
          loading: true,
        }),
        size: handleSizeProp(props.Size.value),
        variant: camelCase(props.Variant.value),
        layout,
        ...(layoutGrow === 1 && { flexGrow: true }),
      };

      return createLocalSnippetElement("ActionButton", commonProps, children);
    },
  );

export const createActionButtonGhostHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ActionButtonGhostProperties>(
    metadata.componentActionButtonGhostButton.key,
    (node) => {
      const props = node.componentProperties;

      const states = props.State.value.split("-");

      const buttonWrapperNode = findOne(
        node,
        (n) => n.type === "FRAME" && n.layoutPositioning !== "ABSOLUTE",
      );

      const labelNode = buttonWrapperNode
        ? (findOne(buttonWrapperNode, (n) => n.type === "TEXT") as NormalizedTextNode | undefined)
        : undefined;

      const color = labelNode ? ctx.valueResolver.getFormattedValue.textFill(labelNode) : null;
      const fontWeight = labelNode
        ? ctx.valueResolver.getFormattedValue.fontWeight(labelNode)
        : null;

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createSeedReactElement("Icon", {
              svg: ctx.iconHandler.transform(props["Icon#30525:15"]),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createSeedReactElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#30511:3"]),
            }),
            props["Label#30511:2"].value,
          ],
        }))
        .with("Icon Last", () => ({
          layout: "withText",
          children: [
            props["Label#30511:2"].value,
            createSeedReactElement("SuffixIcon", {
              svg: ctx.iconHandler.transform(props["Suffix Icon#30525:0"]),
            }),
          ],
        }))
        .with("Text Only", () => ({
          layout: "withText",
          children: props["Label#30511:2"].value,
        }))
        .exhaustive();

      const commonProps = {
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
        ...(states.includes("Loading") && {
          loading: true,
        }),
        size: handleSizeProp(props.Size.value),
        variant: "ghost",
        layout,
        ...(color && { color }),
        ...(fontWeight && { fontWeight }),
        ...(props.Bleed.value === "true" && {
          bleedX: "asPadding",
          bleedY: "asPadding",
        }),
        ...(node.layoutGrow === 1 && { flexGrow: true }),
      };

      return createLocalSnippetElement("ActionButton", commonProps, children);
    },
  );
