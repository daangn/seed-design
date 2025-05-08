import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import type { ComponentHandlerDeps } from "../deps.interface";
import type { ActionButtonProperties } from "@/codegen/component-properties";
import { handleSizeProp } from "../size";
import { createLocalSnippetHelper } from "../../element-factories";

const { createLocalSnippetElement } = createLocalSnippetHelper("action-button");

export const createActionButtonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ActionButtonProperties>(
    metadata.actionButton.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createLocalSnippetElement("Icon", {
              svg: ctx.iconHandler.transform(props["Icon#7574:0"]),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createLocalSnippetElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#5987:305"]),
            }),
            props["Label#5987:61"].value,
          ],
        }))
        .with("Icon Last", () => ({
          layout: "withText",
          children: [
            props["Label#5987:61"].value,
            createLocalSnippetElement("SuffixIcon", {
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
      };

      return createLocalSnippetElement("ActionButton", commonProps, children);
    },
  );
