import type { SwitchProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("switch");

export const createSwitchHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SwitchProperties>(
    metadata.switch.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        size: props.Size.value,
        label: props["Label#36578:0"].value,
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
