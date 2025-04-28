import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type { MannerTempBadgeProperties } from "@/codegen/component-properties";

export const createMannerTempBadgeHandler = (_ctx: SeedComponentHandlerDeps) =>
  defineComponentHandler<MannerTempBadgeProperties>(
    metadata.mannerTempBadge.key,
    ({ children }) => {
      const textNode = children.find((child) => child.type === "TEXT");

      const commonProps = {
        temperature: Number(textNode?.characters.replace(/[^\d.-]/g, "") ?? "-1"),
      };

      return createElement("MannerTempBadge", commonProps);
    },
  );
