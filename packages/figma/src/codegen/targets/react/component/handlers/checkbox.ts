import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import type { ComponentHandlerDeps } from "../deps.interface";
import type { CheckboxProperties } from "@/codegen/component-properties";
import { handleSizeProp } from "../size";

export const createCheckboxHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<CheckboxProperties>(
    metadata.checkbox.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        label: props["Label#49990:0"].value,
        weight: camelCase(props.Weight.value),
        variant: camelCase(props.Shape.value),
        size: handleSizeProp(props.Size.value),
        ...(states.includes("Selected") && {
          defaultChecked: true,
        }),
        ...(states.includes("Indeterminate") && {
          defaultChecked: true,
          indeterminate: true,
        }),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createElement("Checkbox", commonProps);
    },
  );
