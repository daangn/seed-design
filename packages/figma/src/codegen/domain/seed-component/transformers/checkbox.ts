import { defineComponentTransformer } from "@/codegen/core";
import { camelCase } from "change-case";
import * as metadata from "../../../data/__generated__/component-sets";
import { createElement } from "../../../core/jsx";
import { handleSizeProp } from "../size";
import type { CheckboxProperties } from "../properties.type";
import type { SeedComponentTransformerDeps } from "../deps.interface";

export const createCheckboxTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<CheckboxProperties>(
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
