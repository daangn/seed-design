import { defineComponentTransformer } from "@/codegen/core";
import * as metadata from "../../../data/__generated__/component-sets";
import { createElement } from "../../../core/jsx";
import type { MannerTempBadgeProperties } from "../properties.type";
import type { SeedComponentTransformerDeps } from "../deps.interface";

export const createMannerTempBadgeTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<MannerTempBadgeProperties>(
    metadata.mannerTempBadge.key,
    ({ children }) => {
      const textNode = children.find((child) => child.type === "TEXT");

      const commonProps = {
        temperature: Number(textNode?.characters.replace(/[^\d.-]/g, "") ?? "-1"),
      };

      return createElement("MannerTempBadge", commonProps);
    },
  );
