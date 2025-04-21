import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { ReactionButtonProperties } from "../properties.type";
import { handleSizeProp } from "../size";

export const createReactionButtonTransformer = (ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<ReactionButtonProperties>(
    metadata.reactionButton.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        size: handleSizeProp(props.Size.value),
        ...(states.includes("Loading") && {
          loading: true,
        }),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
        ...(states.includes("Selected") && {
          defaultPressed: true,
        }),
      };

      return createElement("ReactionButton", commonProps, [
        createElement("PrefixIcon", {
          svg: createElement(ctx.iconService.createIconTagName(props["Icon#12379:0"].componentKey)),
        }),
        props["Label#6397:0"].value,
        props["Show Count#6397:33"].value
          ? createElement("Count", {}, props["Count#15816:0"].value)
          : undefined,
      ]);
    },
  );
