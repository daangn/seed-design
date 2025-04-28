import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createElement } from "@/codegen/core";
import type { FabProperties } from "@/codegen/component-properties";
import type { ComponentHandlerDeps } from "../deps.interface";

export const createFabHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<FabProperties>(
    metadata.floatingActionButton.key,
    ({ componentProperties: props }) => {
      return createElement(
        "Fab",
        undefined,
        ctx.iconHandler.transform(props["Icon#28796:0"]),
        "aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
      );
    },
  );
