import type { ContextualFloatingButtonProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { match } from "ts-pattern";
import { createLocalSnippetHelper, createSeedReactElement } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("contextual-floating-button");

export const createContextualFloatingButtonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ContextualFloatingButtonProperties>(
    metadata.contextualFloatingButton.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const { layout, children } = match(props.Layout.value)
        .with("Icon Only", () => ({
          layout: "iconOnly",
          children: [
            createSeedReactElement("Icon", {
              svg: ctx.iconHandler.transform(props["Icon#28796:0"]),
            }),
          ],
        }))
        .with("Icon First", () => ({
          layout: "withText",
          children: [
            createSeedReactElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Icon#28796:0"]),
            }),
            props["Label#28936:0"].value,
          ],
        }))
        .exhaustive();

      const commonProps = {
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
        ...(states.includes("Loading") && {
          loading: true,
        }),
        variant: match(props.Variant.value)
          .with("Solid", () => "solid")
          .with("Layer", () => "layer")
          .exhaustive(),
        layout,
      };

      return createLocalSnippetElement("ContextualFloatingButton", commonProps, children);
    },
  );
