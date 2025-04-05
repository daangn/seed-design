import { defineComponentTransformer } from "@/codegen/core";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import * as metadata from "../../../data/__generated__/component-sets";
import { createElement } from "../../../core/jsx";
import { findOne } from "../../../../utils/figma-node";
import type { NormalizedInstanceNode } from "../../../../normalizer";
import { handleSizeProp } from "../size";
import type { TextButtonProperties } from "../properties.type";
import type { SeedComponentTransformerDeps } from "../deps.interface";

export const createTextButtonTransformer = (ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<TextButtonProperties>(metadata.textButton.key, (node) => {
    const { componentProperties: props } = node;

    const states = props.State.value.split("-");

    const { prefixIcon, suffixIcon, children } = match(props.Layout.value)
      .with("Icon First", () => ({
        prefixIcon: createElement(
          ctx.iconService.createIconTagName(props["Prefix Icon#7561:0"].componentKey),
        ),
        suffixIcon: undefined,
        children: props["Label#6148:0"].value,
      }))
      .with("Icon Last", () => {
        const suffixIconNode = findOne(
          node,
          (node) => node.type === "INSTANCE" && node.name === "Suffix Icon",
        ) as NormalizedInstanceNode | null;

        const suffixIconComponentKey = suffixIconNode?.componentKey;

        return {
          prefixIcon: undefined,
          suffixIcon: suffixIconComponentKey
            ? createElement(ctx.iconService.createIconTagName(suffixIconComponentKey))
            : undefined,
          children: props["Label#6148:0"].value,
        };
      })
      .exhaustive();

    const commonProps = {
      tone: camelCase(props.Tone.value),
      size: handleSizeProp(props.Size.value),
      prefixIcon,
      suffixIcon,
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("TextButton", commonProps, children);
  });
