import type { RadioProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";
import { camelCase } from "change-case";

const { createLocalSnippetElement } = createLocalSnippetHelper("radio-group");

export const createRadioGroupItemHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<RadioProperties>(metadata.radio.key, ({ componentProperties: props }) => {
    const commonProps = {
      ...(props.State.value === "Disabled" && {
        disabled: true,
      }),
      label: props["Label#49990:171"].value,
      value: props["Label#49990:171"].value,
      size: handleSizeProp(props.Size.value),
      // weight:
      // tone: camelCase(props.Tone.value)
    };

    return createLocalSnippetElement("RadioGroupItem", commonProps);
  });
