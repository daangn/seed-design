import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { match } from "ts-pattern";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { ActionChipProperties } from "../properties.type";
import { handleSizeProp } from "../size";

export const createActionChipTransformer = (ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<ActionChipProperties>(
    metadata.actionChip.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createElement("Icon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Icon#8714:0"].componentKey),
              ),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createElement("PrefixIcon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Prefix Icon#8711:0"].componentKey),
              ),
            }),
            props["Label#7185:0"].value,
          ],
        }))
        .with("Icon Last", () => ({
          layout: "withText",
          children: [
            props["Label#7185:0"].value,
            createElement("SuffixIcon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Suffix Icon#8711:3"].componentKey),
              ),
            }),
          ],
        }))
        .with("Icon Both", () => ({
          layout: "withText",
          children: [
            createElement("PrefixIcon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Prefix Icon#8711:0"].componentKey),
              ),
            }),
            props["Label#7185:0"].value,
            createElement("SuffixIcon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Suffix Icon#8711:3"].componentKey),
              ),
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
