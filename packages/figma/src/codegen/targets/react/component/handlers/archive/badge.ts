import type { BadgeProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { camelCase } from "change-case";
import { createSeedReactElement } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { handleSizeProp } from "../../size";

export const createBadgeHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<BadgeProperties>(metadata.badge.key, ({ componentProperties: props }) => {
    const commonProps = {
      size: handleSizeProp(props.Size.value),
      tone: camelCase(props.Tone.value),
      variant: camelCase(props.Variant.value),
    };

    return createSeedReactElement("Badge", commonProps, props["Label#1584:0"].value);
  });
