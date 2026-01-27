import type { CheckmarkProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("checkbox");

export const createCheckmarkHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<CheckmarkProperties>(
    metadata.componentCheckmark.key,
    ({ componentProperties: props }) => {
      const tone = match(props.Tone.value)
        .with("Neutral", () => "neutral")
        .with("🚫[Deprecated]Brand", () => "brand")
        .exhaustive();

      const commonProps = {
        tone,
        variant: camelCase(props.Shape.value),
        size: handleSizeProp(props.Size.value),
      };

      return createLocalSnippetElement("Checkmark", commonProps);
    },
  );
