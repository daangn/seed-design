import type { TextButtonProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { NormalizedInstanceNode } from "@/normalizer";
import { findOne } from "@/utils/figma-node";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

export const createTextButtonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<TextButtonProperties>(metadata.textButton.key, (node) => {
    const { componentProperties: props } = node;

    const states = props.State.value.split("-");

    const { prefixIcon, suffixIcon, children } = match(props.Layout.value)
      .with("Icon First", () => ({
        prefixIcon: ctx.iconHandler.transform(props["Prefix Icon#7561:0"]),
        suffixIcon: undefined,
        children: props["Label#6148:0"].value,
      }))
      .with("Icon Last", () => {
        const suffixIconNode = findOne(
          node,
          (node) => node.type === "INSTANCE" && node.name === "Suffix Icon",
        ) as NormalizedInstanceNode | null;

        return {
          prefixIcon: undefined,
          suffixIcon: suffixIconNode ? ctx.iconHandler.transform(suffixIconNode) : undefined,
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

    return createSeedReactElement("TextButton", commonProps, children);
  });
