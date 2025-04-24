import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { MannerTempBadgeProperties } from "@/codegen/component-properties";

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
