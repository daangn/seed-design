import type { ControlChipProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { match } from "ts-pattern";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

const { createLocalSnippetElement } = createLocalSnippetHelper("control-chip");

export const createControlChipHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ControlChipProperties>(
    metadata.controlChip.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const count = props["Show Count#7185:42"].value ? props["Count#7185:21"].value : undefined;

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createSeedReactElement("Icon", {
              svg: ctx.iconHandler.transform(props["Icon#8722:41"]),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createSeedReactElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#8722:0"]),
            }),
            props["Label#7185:0"].value,
            count ? createSeedReactElement("Count", undefined, [count]) : undefined,
          ],
        }))
        .with("Icon Last", () => ({
          layout: "withText",
          children: [
            props["Label#7185:0"].value,
            createSeedReactElement("SuffixIcon", {
              svg: ctx.iconHandler.transform(props["Suffix Icon#8722:82"]),
            }),
          ],
        }))
        .with("Icon Both", () => ({
          layout: "withText",
          children: [
            createSeedReactElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#8722:0"]),
            }),
            props["Label#7185:0"].value,
            createSeedReactElement("SuffixIcon", {
              svg: ctx.iconHandler.transform(props["Suffix Icon#8722:82"]),
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
        ...(states.includes("Selected") && {
          defaultChecked: true,
        }),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
        ...(props["Show Count#7185:42"].value && {
          count: Number(props["Count#7185:21"].value),
        }),
      };

      return createLocalSnippetElement("ControlChip.Toggle", commonProps, children);
    },
  );
