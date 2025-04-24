import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { ActionButtonProperties } from "@/codegen/component-properties";
import { handleSizeProp } from "../size";

export const createActionButtonTransformer = (ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<ActionButtonProperties>(
    metadata.actionButton.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createElement("Icon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Icon#7574:0"].componentKey),
              ),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createElement("PrefixIcon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Prefix Icon#5987:305"].componentKey),
              ),
            }),
            props["Label#5987:61"].value,
          ],
        }))
        .with("Icon Last", () => ({
          layout: "withText",
          children: [
            props["Label#5987:61"].value,
            createElement("SuffixIcon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Suffix Icon#5987:244"].componentKey),
              ),
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
