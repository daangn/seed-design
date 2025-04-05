import { defineComponentTransformer } from "@/codegen/core";
import { camelCase } from "change-case";
import * as metadata from "../../../data/__generated__/component-sets";
import { createElement } from "../../../core/jsx";
import { handleSizeProp } from "../size";
import type { ExtendedFabProperties } from "../properties.type";
import type { SeedComponentTransformerDeps } from "../deps.interface";

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
