import { defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createElement } from "@/codegen/core";
import type { FabProperties } from "@/codegen/component-properties";
import type { SeedComponentTransformerDeps } from "../deps.interface";

export const createFabTransformer = (ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<FabProperties>(
    metadata.floatingActionButton.key,
    ({ componentProperties: props }) => {
      return createElement(
        "Fab",
        undefined,
        createElement(ctx.iconService.createIconTagName(props["Icon#28796:0"].componentKey)),
        "aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
      );
    },
  );
