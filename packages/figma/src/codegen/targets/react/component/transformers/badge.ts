import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { BadgeProperties } from "../properties.type";
import { handleSizeProp } from "../size";

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
