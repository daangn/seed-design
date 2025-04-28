import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { match } from "ts-pattern";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type { ActionChipProperties } from "@/codegen/component-properties";
import { handleSizeProp } from "../size";

export const createActionChipHandler = (ctx: SeedComponentHandlerDeps) =>
  defineComponentHandler<ActionChipProperties>(
    metadata.actionChip.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createElement("Icon", {
              svg: ctx.iconHandler.transform(props["Icon#8714:0"]),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#8711:0"]),
            }),
            props["Label#7185:0"].value,
          ],
        }))
        .with("Icon Last", () => ({
          layout: "withText",
          children: [
            props["Label#7185:0"].value,
            createElement("SuffixIcon", {
              svg: ctx.iconHandler.transform(props["Suffix Icon#8711:3"]),
            }),
          ],
        }))
        .with("Icon Both", () => ({
          layout: "withText",
          children: [
            createElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#8711:0"]),
            }),
            props["Label#7185:0"].value,
            createElement("SuffixIcon", {
              svg: ctx.iconHandler.transform(props["Suffix Icon#8711:3"]),
            }),
          ],
        }))
        .with("Text Only", () => ({
          layout: "withText",
          children: props["Label#7185:0"].value,
        }))
        .exhaustive();

      const commonProps = {
        size: handleSizeProp(props.Size.value),
        layout,
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
        ...(props["Show Count#7185:42"].value && {
          count: Number(props["Count#7185:21"].value),
        }),
      };
      return createElement("ActionChip", commonProps, children);
    },
  );
