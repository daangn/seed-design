import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { ToggleButtonProperties } from "@/codegen/component-properties";
import { handleSizeProp } from "../size";

export const createToggleButtonTransformer = (ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<ToggleButtonProperties>(
    metadata.toggleButton.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        variant: camelCase(props.Variant.value),
        size: handleSizeProp(props.Size.value),
        ...(states.includes("Selected") && {
          defaultPressed: true,
        }),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
        ...(states.includes("Loading") && {
          loading: true,
        }),
      };

      return createElement("ToggleButton", commonProps, [
        props["Show Prefix Icon#6122:392"].value
          ? createElement("PrefixIcon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Prefix Icon#6122:98"].componentKey),
              ),
            })
          : undefined,
        props["Label#6122:49"].value,
        props["Show Suffix Icon#6122:147"].value
          ? createElement("SuffixIcon", {
              svg: createElement(
                ctx.iconService.createIconTagName(props["Suffix Icon#6122:343"].componentKey),
              ),
            })
          : undefined,
      ]);
    },
  );
