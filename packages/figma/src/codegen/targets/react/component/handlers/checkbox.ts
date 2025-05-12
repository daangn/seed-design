import type { CheckboxProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

const { createLocalSnippetElement } = createLocalSnippetHelper("checkbox");

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

      return createLocalSnippetElement("Checkbox", commonProps);
    },
  );
