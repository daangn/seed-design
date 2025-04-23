import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { SwitchProperties } from "../properties.type";
import { handleSizeProp } from "../size";

export const createSwitchTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<SwitchProperties>(
    metadata.switch.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const size = handleSizeProp(props.Size.value);

      const commonProps = {
        size,
        ...(size === "small" && {
          label: props["Label#15191:2"].value,
        }),
        ...(states.includes("Selected") && {
          defaultChecked: true,
        }),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createElement("Switch", commonProps);
    },
  );
