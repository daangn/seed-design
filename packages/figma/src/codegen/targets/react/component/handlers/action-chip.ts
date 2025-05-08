import type { ActionChipProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { match } from "ts-pattern";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

export const createActionChipHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ActionChipProperties>(
    metadata.actionChip.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createSeedReactElement("Icon", {
              svg: ctx.iconHandler.transform(props["Icon#8714:0"]),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createSeedReactElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#8711:0"]),
            }),
            props["Label#7185:0"].value,
          ],
        }))
        .with("Icon Last", () => ({
          layout: "withText",
          children: [
            props["Label#7185:0"].value,
            createSeedReactElement("SuffixIcon", {
              svg: ctx.iconHandler.transform(props["Suffix Icon#8711:3"]),
            }),
          ],
        }))
        .with("Icon Both", () => ({
          layout: "withText",
          children: [
            createSeedReactElement(
              "PrefixIcon",
              {
                svg: ctx.iconHandler.transform(props["Prefix Icon#8711:0"]),
              },
              undefined,
              {
                importPath: "@seed-design/react",
              },
            ),
            props["Label#7185:0"].value,
            createSeedReactElement(
              "SuffixIcon",
              {
                svg: ctx.iconHandler.transform(props["Suffix Icon#8711:3"]),
              },
              undefined,
              {
                importPath: "@seed-design/react",
              },
            ),
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
      return createSeedReactElement("ActionChip", commonProps, children);
    },
  );
