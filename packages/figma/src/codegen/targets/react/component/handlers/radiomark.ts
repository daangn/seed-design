import type { RadiomarkProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("radio-group");

export const createRadiomarkHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<RadiomarkProperties>(
    metadata.componentRadiomark.key,
    ({ componentProperties: props }) => {
      const tone = match(props.Tone.value)
        .with("Neutral", () => "neutral")
        .with("🚫[Deprecated]Brand", () => "brand")
        .exhaustive();

      const commonProps = {
        tone,
        size: handleSizeProp(props.Size.value),
      };

      return createLocalSnippetElement("Radiomark", commonProps);
    },
  );
