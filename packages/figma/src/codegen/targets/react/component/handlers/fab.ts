import type { FabProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

export const createFabHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<FabProperties>(
    metadata.floatingActionButton.key,
    ({ componentProperties: props }) => {
      return createSeedReactElement(
        "Fab",
        undefined,
        createSeedReactElement("Icon", {
          svg: ctx.iconHandler.transform(props["Icon#28796:0"]),
        }),
        {
          comment: "aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
        },
      );
    },
  );
