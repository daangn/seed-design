import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { ExtendedFabProperties } from "@/codegen/component-properties";
import { handleSizeProp } from "../size";

export const createExtendedFabTransformer = (ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<ExtendedFabProperties>(
    metadata.extendedFloatingActionButton.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        size: handleSizeProp(props.Size.value),
        variant: camelCase(props.Variant.value),
      };

      return createElement("ExtendedFab", commonProps, [
        createElement("PrefixIcon", {
          svg: createElement(ctx.iconService.createIconTagName(props["Icon#28796:0"].componentKey)),
        }),
        props["Label#28936:0"].value,
      ]);
    },
  );
