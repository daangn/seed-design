import type { SwitchProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

const { createLocalSnippetElement } = createLocalSnippetHelper("switch");

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

      return createLocalSnippetElement("Switch", commonProps);
    },
  );
