import type { ReactionButtonProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

const { createLocalSnippetElement } = createLocalSnippetHelper("reaction-button");

export const createReactionButtonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ReactionButtonProperties>(
    metadata.componentReactionButton.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        size: handleSizeProp(props.Size.value),
        ...(props.State.value === "Loading" && {
          loading: true,
        }),
        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
        ...(props.Selected.value === "True" && {
          defaultPressed: true,
        }),
      };

      return createLocalSnippetElement("ReactionButton", commonProps, [
        createSeedReactElement("PrefixIcon", {
          svg: ctx.iconHandler.transform(props["Icon#12379:0"]),
        }),
        props["Label#6397:0"].value,
        props["Show Count#6397:33"].value
          ? createSeedReactElement("Count", {}, props["Count#15816:0"].value)
          : undefined,
      ]);
    },
  );
