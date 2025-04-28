import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { ComponentHandlerDeps } from "../deps.interface";
import type { SwitchProperties } from "@/codegen/component-properties";
import { handleSizeProp } from "../size";

export const createSwitchHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SwitchProperties>(
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
