import type { RadioMarkProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

const { createLocalSnippetElement } = createLocalSnippetHelper("radio-group");

export const createRadioMarkHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<RadioMarkProperties>(
    metadata.radioMark.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        size: handleSizeProp(props.Size.value),
      };

      return createLocalSnippetElement("Radiomark", commonProps);
    },
  );
