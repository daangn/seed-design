import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type { ActionButtonProperties } from "@/codegen/component-properties";
import { handleSizeProp } from "../size";

export const createActionButtonHandler = (ctx: SeedComponentHandlerDeps) =>
  defineComponentHandler<ActionButtonProperties>(
    metadata.actionButton.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createElement("Icon", {
              svg: ctx.iconHandler.transform(props["Icon#7574:0"]),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#5987:305"]),
            }),
            props["Label#5987:61"].value,
          ],
        }))
        .with("Icon Last", () => ({
          layout: "withText",
          children: [
            props["Label#5987:61"].value,
            createElement("SuffixIcon", {
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

      return createElement("ActionButton", commonProps, children);
    },
  );
