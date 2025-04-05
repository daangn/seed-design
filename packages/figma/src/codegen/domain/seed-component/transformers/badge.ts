import { defineComponentTransformer } from "@/codegen/core";
import { camelCase } from "change-case";
import * as metadata from "../../../data/__generated__/component-sets";
import { createElement } from "../../../core/jsx";
import { handleSizeProp } from "../size";
import type { BadgeProperties } from "../properties.type";
import type { SeedComponentTransformerDeps } from "../deps.interface";

export const createBadgeTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<BadgeProperties>(
    metadata.badge.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        size: handleSizeProp(props.Size.value),
        tone: camelCase(props.Tone.value),
        variant: camelCase(props.Variant.value),
        shape: camelCase(props.Shape.value),
      };

      return createElement("Badge", commonProps, props["Label#1584:0"].value);
    },
  );
